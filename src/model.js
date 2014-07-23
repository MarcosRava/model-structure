var Validator        = require('./validator');
var Repository       = require('./repository.js');
var swaggerHelper    = require('./helpers/swagger-helper.js');
var validationHelper = require('./helpers/validator-helper.js');
var propertyHelper   = require('./helpers/property-helper.js');
var dbHelper         = require('./helpers/db-helper.js');
var extend           = require('extend');
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

  Model._init_    = _init_;
  Model.getSchema = getSchema;

  Model.prototype.initialize = initialize;
  Model.prototype.create     = create;
  Model.prototype.get        = get;
  Model.prototype.update     = update;
  Model.prototype.destroy    = destroy;
  Model.prototype.isValid    = isValid;

  this.validators = [];

  return Model;

})();

function _init_(_this, args) {
  extend(true, _this.constructor.prototype, Model.prototype);
  _this.constructor.prototype._super = Model;
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
  schema = schema || extend(true, {}, ref.schema);
  for (var attr in schema.properties) {
    propertyHelper.defineGetSet.call(this, schema, attr);
    schemaValidation[attr] = validationHelper.getValidation.call(this, schema, attr);
    this[attr] = data[attr];
  }
  schema.schema = schemaValidation;
  schema.validators = [ new Validator({validate : schema.schema}) ];
  if (schema.validatorSchema)
    schema.validators = schema.validators.concat(new Validator({validate: schema.validatorSchema}));

  if (data.validators && data.validators.constructor === Array)
    schema.validators = schema.validators.concat(data.validators);
  this.access = access;

  schema.repository = data.repository || schema.repository || new Repository();
  schema.ref = ref;
  schema.name = ref.name;
  function access(key) {
    if (key === 'privates') return schema;
    var func = accessFunctions[key];
    if (func)
      return func.call(this, schema);
    return schema[key];
  }
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
      _this.initialize(data, _this.access('privates'));
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
    if (data && data.constructor !== Array)
      _this.initialize(data, _this.access('privates'));
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
      if (data && data.constructor !== Array)
        _this.initialize(data, _this.access('privates'));
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

function isValid(callback) {
  callback = callback || function () {};

  var validators = this.access('validators');

  if (validators && validators.length > 0) {
    var length = validators.length;
    _isValid(this, 0);
  } else {
    callback(null);
  }

  function _isValid(data, i) {
    var validator = validators[i];

    if (!validator instanceof Validator) throw new Error("Validator not valid", validator);

    if (i >= length) {
      callback(null);
      return;
    }

    validator.isValid(data, function (err) {
      if (err) {
        callback(err);
      } else {
        _isValid(data, i + 1);
      }
    });
  }
}
