var Validator        = require('./validator');
var Repository       = require('./repository.js');
var swaggerHelper    = require('./helpers/swagger-helper.js');
var validationHelper = require('./helpers/validator-helper.js');
var propertyHelper   = require('./helpers/property-helper.js');
var dbHelper         = require('./helpers/db-helper.js');
var extend           = require('extend');
var util           = require('util');
var Model;

var publicHelpers = {
  swagger  : swaggerHelper.getSwagger,
  dbMigrate: dbHelper.getSchema
};

module.exports = Model = (function () {

  function Model(args) {
    args = args || {};
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
  Model.prototype.get        = get;
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

}

function instantiate(_this, args) {
  initialize.call(_this, args);
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
  schema.validators = [ new Validator({validate : schema.schemaValidation}) ];
  if (schema.validatorSchema)
    schema.validators = schema.validators.concat(new Validator({validate: schema.validatorSchema}));

  if (data.validators && data.validators.constructor === Array)
    schema.validators = schema.validators.concat(data.validators);
  this.constructor.prototype.access = access;
  var DefaultRepository = ref.repository || Model.repository || Repository;
  schema.repository = data.repository || schema.repository ||new DefaultRepository();
}

function create(callback) {
  var repository = this.access('repository');
  var _this = this;
  this.isValid(function (err) {
    if (err) {
      if (typeof callback === 'function') callback(err);
      return;
    }
    repository.create.call(_this, function (err, data) {
      initialize.call(_this, data, _this.access('privates'));
      callback(err, data);
    });
  });
}

function get() {
  var _this = this;
  var repository = this.access('repository');
  var callback = arguments.length > 1 ? arguments[1] : arguments[0];
  repository.get.call(this, arguments.length > 1 ? arguments[0] : null, function (err, data) {
    if (err) {
      if (typeof callback === 'function') callback(err);
      return;
    }
    if (data && data.constructor !== Array) {
      initialize.call(_this, data, _this.access('privates'));
    }
    if (typeof callback === 'function') callback(err, data);
  });
}

function update(callback) {
  var repository = this.access('repository');
  var _this = this;
  this.isValid(function (err) {
    if (err) {
      if (typeof callback === 'function') callback(err);
      return;
    }
    repository.update.call(_this, function (err, data) {
      if (data && data.constructor !== Array) {
        initialize.call(_this, data, _this.access('privates'));
      }
      callback(err, data);
    });
  });
}

function destroy(callback) {
  var _this = this;
  var repository = this.access('repository');
  repository.destroy.call(this, function (err) {
    if (err) throw err;
    delete _this._id;
    callback(err);
  });
}

function isValid(optionalValidators, callback) {

  // retrieve arguments as array
  var args = [];
  for (var i = 0; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  // last argument is the callback function.
  callback = args.pop();

  if (typeof callback !== 'function') {
    throw new Error("Must pass a callback function");
  }

  // retrieve default validators
  var validators = this.access('validators');

  // use optionalValidators as validators when optionalValidators are passed
  if (args.length > 0) {
    validators = args[0];
  }

  Validator.validate(this, validators, callback);
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
