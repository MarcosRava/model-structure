var Validator;
var ValidationError = require('./validation-error.js');
var schema = require('async-validate');
var validateOptions = {first : true, single: true};
var util = require ('util');
var async = require('async');

var _messages = {
  'en': schema.messages.clone()
};
var _locale = 'en';

module.exports = Validator = (function () {




  function Validator(args) {
    args = args || {};
    this.validate = args.validate;
  }

  Validator.validate = validate;
  Validator.prototype.isValid = isValid;
  Validator.getMessages = getMessages;
  Validator.addMessages = addMessages;
  Validator.setLocale = setLocale;

  return Validator;

})();

function setLocale(locale) {
  _locale = locale;
}

function getLocale() {
  return _locale;
}

function getMessages(locale) {
  var cloned = JSON.parse(JSON.stringify(_messages[locale || getLocale()]));
  return cloned;
}

function addMessages(locale, messages) {
  _messages[locale] = messages;
}

function isValid(model, callback) {
  if (typeof this.validate === 'function') {
    if (this.validate.length === 1)
      this.validate.call(model, function (err, fields) {
        err = checkError(err);
        callback(err, fields);
      });
    else {
      var err = this.validate.call(model);
      err = checkError(err);
      callback(err);
    }
  }
  else {
    var validator = new schema(this.validate);
    validateOptions.messages = getMessages();
    validator.validate(model, validateOptions, callback);
  }
}

function checkError(err) {
  if (!err || !err.message || !err.field) throw new Error("Invalid constructor");
  return [new ValidationError(err.message, err.field)];
}

function validate(model, validators, callback) {

  if (validators && validators.length > 0) {
    var length = validators.length;
    _isValid(model, 0);
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

    validator.isValid(data, function (err, fields) {
      if (err) {
        callback(err, fields);
      } else {
        _isValid(data, i + 1);
      }
    });
  }
}

function arrayModel(rule, value, callback, source, options) {
  var funcs = [];

  for(var i in value) {
    funcs.push(value[i].isValid.bind(value[i]));
  }

  async.series(funcs, function (errors, iterator) {
    var position = funcs.length - (funcs.length - iterator.length) - 1;
    for (var err in errors) {
      errors[err].field = rule.field +  "[" + position + "]." + errors[err].field;
    }
    callback(errors);
  });
}

function nested(rule, value, callback, source, options) {
  if (!value) {
    return callback();
  }

  if (!(value instanceof source.super_)) {
    return callback([ new ValidationError(
      util.format(schema.messages.types.object, rule.field, 'object'),
      rule.field)]);
  }
  value.isValid(function (errors) {
    for (var err in errors) {
      errors[err].field = rule.field +  "." + errors[err].field;
    }
    callback(errors);
  });
}

schema.register('arrayModel', arrayModel);
schema.register('nested', nested);
