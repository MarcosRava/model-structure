var Validator;
var ValidationError          = require('./validation-error.js');
var AsyncValidate            = require('async-validate');
var util                     = require('util');
var async                    = require('async');
var Q                        = require('q');
var defaultValidationOptions = {first : false, single: false};
var _messages                = {'en': AsyncValidate.messages.clone()};
var _locale                  = 'en';

module.exports = Validator = (function () {

  function Validator(args) {
    args          = args || {};
    this.validate = args.validate;
  }

  Validator.validate          = validate;
  Validator.getMessages       = getMessages;
  Validator.addMessages       = addMessages;
  Validator.setLocale         = setLocale;
  Validator.prototype.isValid = isValid;

  return Validator;

})();

function setLocale(locale) {
  _locale = locale;
}

function getLocale() {
  return _locale;
}

function getMessages(locale) {
  locale = locale || getLocale();
  return JSON.parse(JSON.stringify(_messages[locale]));
}

function addMessages(locale, messages) {
  _messages[locale] = messages;
}

function isValid(model, callback) {
  callback = callback || function () {};
  var deferred = Q.defer();
  var promise = deferred.promise;
  if (typeof this.validate === 'function') {
    if (this.validate.length === 1)
      this.validate.call(model, function (err, fields) {
        if (err) {
          err = checkError(err);
          deferred.reject(err, fields);
        } else {
          deferred.resolve(null);
        }
        callback(err, fields);
      });
    else if (this.validate.length === 3) {
      this.validate.call(model, deferred.resolve, reject, deferred.notify);
    }
    else {
      var err = this.validate.call(model, callback);
      err = checkError(err);
      callback(err);
    }
  }
  else {
    var validator = new AsyncValidate(this.validate);
    defaultValidationOptions.messages = getMessages();
    promise = Q.Promise(function (resolve, reject, notify) {
      validator.validate(model, defaultValidationOptions, function (err, fields) {
        if (err) {
          err = getCustomErrorMessages(err, model.constructor.schema.properties);
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }
  function reject(err) {
    err = checkError(err);
    deferred.reject(err);
  }

  function getCustomErrorMessages(errors, properties) {
    var error;
    for (var i = 0, j = errors.length; i < j; i++) {
      error = errors[i];
      if (properties[error.field] && properties[error.field].messages && properties[error.field].messages[error.type]) {
        error.message = properties[error.field].messages[error.type].trim();
      } else if (properties[error.field] && properties[error.field].alias) {
        error.message = error.message.replace(error.field, properties[error.field].alias).trim();
      }
    }
    return errors;
  }

  return promise;
}

function checkError(err) {
  if (!err || !err.message || !err.field) throw new Error('Invalid constructor');
  return [new ValidationError(err.message, err.field)];
}

function validate(model, validators, callback) {
  var arr = [];
  for (var i in validators) {
    var _validator = validators[i];
    if (!_validator instanceof Validator) throw new Error('Validator not valid', _validator);
    arr.push(_validator.isValid(model));

  }
  Q.all(arr)
  .nodeify(callback);
  return Q.all(arr);
}

function arrayModel(rule, value, callback, source, options) {
  var funcs = [];

  for (var i in value) {
    funcs.push(value[i].isValid.bind(value[i]));
  }

  async.series(funcs, function (errors, iterator) {
    var position = funcs.length - (funcs.length - iterator.length) - 1;
    for (var err in errors) {
      errors[err].field = rule.field +  '[' + position + '].' + errors[err].field;
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
      util.format(AsyncValidate.messages.types.object, rule.field, 'object'),
      rule.field)]);
  }
  value.isValid(function (errors) {
    for (var err in errors) {
      errors[err].field = rule.field +  '.' + errors[err].field;
    }
    callback(errors);
  });
}

AsyncValidate.register('arrayModel', arrayModel);
AsyncValidate.register('nested', nested);
