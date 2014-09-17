var Validator;
var ValidationError = require('./validation-error.js');
var schema = require('async-validate');
var validateOptions = {first : true, single: true};
var util = require ('util');
var async = require('async');
var Q = require('q');

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
  callback = callback || function() {};
  var deferred = Q.defer();
  var promise = deferred.promise;
  if (typeof this.validate === 'function') {
    if (this.validate.length === 1)
      this.validate.call(model, function (err, fields) {
        if(err) {
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
      var err = this.validate.call(model);
      err = checkError(err);
      callback(err);
    }
  }
  else {
    var validator = new schema(this.validate);
    validateOptions.messages = getMessages();
    promise = Q.Promise(function(resolve, reject, notify) {
      validator.validate(model, validateOptions, function(err, fields) {
        if(err) {
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }
  function reject(err) {
    err = checkError(err);
    deferred.reject (err);
  }
  return promise;
}

function checkError(err) {
  if (!err || !err.message || !err.field) throw new Error("Invalid constructor");
  return [new ValidationError(err.message, err.field)];
}

function validate(model, validators, callback) {
  callback = callback || function() {};
  var arr =[];
  for(var i in validators) {
    var _validator = validators[i];
    if (!_validator instanceof Validator) throw new Error("Validator not valid", _validator);
    arr.push( _validator.isValid(model));

  }
  Q.all(arr)
  .nodeify(callback);
  return Q.all(arr);
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
