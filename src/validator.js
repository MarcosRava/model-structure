var Validator;
var ValidationError = require('./validation-error.js');
var schema = require('async-validate');
var validateOptions = {first : true, single: true};

module.exports = Validator = (function () {

  function Validator(args) {
    args = args || {};
    this.validate = args.validate;
  }
  Validator.validate = validate;
  Validator.prototype.isValid = isValid;

  return Validator;

})();

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
