var Validator        = require('../validator');
var Repository       = require('../repository.js');
var swaggerHelper    = require('../helpers/swagger-helper.js');
var validationHelper = require('../helpers/validator-helper.js');
var propertyHelper   = require('../helpers/property-helper.js');
var dbHelper         = require('../helpers/db-helper.js');
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

  Model.prototype.create     = require('./create.js')(Model, Repository, initialize);
  Model.prototype.load       = require('./load.js')(Model, Repository, initialize);
  Model.prototype.update     = require('./update.js')(Model, Repository, initialize);
  Model.prototype.destroy    = require('./destroy.js')(Model, Repository, initialize);
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
  ref.get = require('./get.js')(Model, Repository, initialize);

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
  if (!schema.validators || schema.validators.constructor !== Array) {
    schema.validators = [];
  }
  if (!schema.schemaValidation) {
    schema.schemaValidation = schemaValidation;
    schema.validators =  schema.validators.concat([ new Validator({validate : schema.schemaValidation}) ]);
  }

  this.constructor.prototype.access = access;
  schema.repository = schema.repository || ref.repository || Model.repository || new Repository();
  return this;
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
