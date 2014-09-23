var Validator        = require('./validator');
var Repository       = require('./repository.js');
var swaggerHelper    = require('./helpers/swagger-helper.js');
var validationHelper = require('./helpers/validator-helper.js');
var propertyHelper   = require('./helpers/property-helper.js');
var dbHelper         = require('./helpers/db-helper.js');
var extend           = require('extend');
var util           = require('util');
var Model;
var Q = require('q');

var publicHelpers = {
  swagger  : swaggerHelper.getSwagger,
  dbMigrate: dbHelper.getSchema
};

module.exports = Model = (function () {

  function Model() {
    throw new Error("Cannot instantiate this class");
  }

  function getSchema(schemaName, modelSchema) {
    return publicHelpers[schemaName](modelSchema);
  }

  Model.init = init;
  Model.instantiate = instantiate;
  Model.addMessages = addMessages;
  Model.getMessages = getMessages;
  Model.setLocale = setLocale;
  Model.getSchema = getSchema;

  Model.prototype.create     = create;
  Model.prototype.load        = load;
  Model.prototype.update     = update;
  Model.prototype.destroy    = destroy;
  Model.prototype.isValid    = isValid;

  this.validators = [];

  return Model;

})();

function init(ref, schema) {
  ref.schema = schema;
  schema.name = ref.name;
  schema.ref = ref;
  ref.access =  function access(key) {
    if (key === 'privates') return schema;
    var func = accessFunctions[key];
    if (func)
      return func.call(this, schema);
    return schema[key];
  };

  ref.prototype = Object.create(Model.prototype, {
    constructor: {
      value: ref,
    }
  });
  ref.prototype.super_ = Model;
  ref.get = get;

}

function instantiate(_this, args, options) {
  options = extend(true, options, _this.constructor.schema);
  initialize.call(_this, args, options);
}

var accessFunctions = {
  "swagger" : swaggerHelper.getSwagger,
  "db-migrate": dbHelper.getSchema
};

function initialize(args, schema) {
  var data = args || {};
  var schemaValidation = {};
  var ref = this.constructor;

  function access(key) {
    if (key === 'privates') return schema;
    var func = accessFunctions[key];
    if (func)
      return func.call(this, schema);
    return schema[key];
  }
  schema = schema || extend(true, {}, ref.schema);
  for (var attr in schema.properties) {
    propertyHelper.defineGetSet.call(this, schema, attr);
    schemaValidation[attr] = validationHelper.getValidation.call(this, schema, attr);
    this[attr] = data[attr];
  }
  schema.schemaValidation = schemaValidation;
  if (!schema.validators || schema.validators.constructor !== Array) {
    schema.validators = [];
  }
  schema.validators =  schema.validators.concat([ new Validator({validate : schema.schemaValidation}) ]);

  this.constructor.prototype.access = access;
  schema.repository = schema.repository || ref.repository || Model.repository || new Repository();
  return this;
}

function create(callback) {
  callback = callback || function(){};
  var repository = this.access('repository');
  var _this = this;
  var validationPromise = this.isValid();
  var createPromise;
  if (repository.create.length === 3) {
    var deferred = Q.defer();
    repository.create.call(_this, deferred.resolve, deferred.reject, deferred.notify);
    createPromise = deferred.promise;
  } else {
    createPromise = Q.Promise(function(resolve, reject, notify) {
      repository.create.call(_this, function (err, data) {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
     );
    });
  }
 return Q.all([validationPromise, createPromise])
  .fail(function (err) {
    callback(err);
    throw err;
  })
 .then(function (result) {
   if(!result || !result[1]) return;
    if (!_this.constructor.schema.notInstantiate) {
      result[1] = initialize.call(_this,  result[1], _this.access('privates'));
    }
    callback(null, result[1]);
    return result[1];
 });
}

function get() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  var Ref = this;
  var repository = args[0].repository || Ref.repository || Model.repository || new Repository();

  // last argument is the callback function.
  var callback = args.pop();
  repository.get(args.length > 1 ? args[0] : null, function (err, data) {
    if (err) {
      if (typeof callback === 'function') callback(err);
      return;
    }
    if (data && data.constructor === Array) {
      if (!Ref.schema.notInstantiate) {
        for(var i in data) {
          data[i].repository = repository;
          data[i] = new Ref(data[i]);
        }
      }
    } else
    {
        throw new Error("Response should be an Array");
    }
    if (typeof callback === 'function') callback(err, data);
  });
}

function load() {
  var _this = this;
  var repository = this.access('repository');
  var callback = arguments.length > 1 ? arguments[1] : arguments[0] || function() {};
  var ref = (arguments.length > 0 && arguments[0] !== callback) ? arguments[0] : this;
  var _args = arguments.length > 1 ? arguments[0] : _this;

  var deferred = Q.defer();
  var loadPromise = deferred.promise;
  if (repository.load.length === 3) {
    repository.load.call(ref, deferred.resolve, deferred.reject, deferred.notify);
  } else {
    loadPromise = Q.Promise(function(resolve, reject, notify) {
      repository.load.call(_this, _args, function (err, data) {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
  return loadPromise.fail(function(err) {
    callback(err);
    throw err;
  }).then(function (data) {
    if (!_this.constructor.schema.notInstantiate) {
      data = initialize.call(_this,  data, _this.access('privates'));
    }
    callback(null, data);
    return data;
 });
}

function update(callback) {
callback = callback || function(){};
  var repository = this.access('repository');
  var _this = this;
  var validationPromise = this.isValid();
  var updatePromise;
  if (repository.update.length === 3) {
    var deferred = Q.defer();
    repository.update.call(_this, deferred.resolve, deferred.reject, deferred.notify);
    updatePromise = deferred.promise;
  } else {
    updatePromise = Q.Promise(function(resolve, reject, notify) {
      repository.update.call(_this, function (err, data) {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
     );
    });
  }
 return Q.all([validationPromise, updatePromise])
  .fail(function (err) {
    callback(err);
    throw err;
  })
 .then(function (result) {
   if(!result || !result[1]) return;
    if (!_this.constructor.schema.notInstantiate) {
      result[1] = initialize.call(_this,  result[1], _this.access('privates'));
    }
    callback(null, result[1]);
    return result[1];
 });
}

function destroy(callback) {
  callback = callback || function(){};
  var _this = this;
  var repository = this.access('repository');
  var deletePromise;
  if (repository.update.length === 3) {
    var deferred = Q.defer();
    repository.destroy.call(_this, deferred.resolve, deferred.reject, deferred.notify);
    deletePromise = deferred.promise;
  } else {
    deletePromise = Q.Promise(function(resolve, reject, notify) {
      repository.destroy.call(_this, function (err, data) {
        if(err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
     );
    });
  }
  return deletePromise.fail(function(err) {
    callback(err);
    throw err;
  }).then(function (data) {
    if (!_this.constructor.schema.notInstantiate) {
      data = initialize.call(_this,  data, _this.access('privates'));
    }
    callback(null, data);
    return data;
 });
}

function isValid(optionalValidators, callback) {

  // retrieve default validators
  var validators = this.access('validators');

  // use optionalValidators as validators when optionalValidators are passed
  if (arguments.length > 0) {
    if (optionalValidators.constructor === Array) {
      validators = optionalValidators;
    } else if (typeof optionalValidators === 'function') {
      callback = optionalValidators;
    }
    callback = callback || function() {};
  }

  return Validator.validate(this, validators, callback);
}

function setLocale(locale) {
  this.locale = locale;
  Validator.setLocale(this.locale);
}

function addMessages(locale, messages) {
  messages = extend(true, Validator.getMessages(), messages);
  Validator.addMessages(locale, messages);
}

function getMessages(locale) {
  return Validator.getMessages(locale);
}
