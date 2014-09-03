var Validator;
var ValidationError = require('./validation-error.js');
var schema = require('async-validate');
var validateOptions = {first : true, single: true};

module.exports = Validator = (function () {

  function Validator(args) {
    args = args || {};
    this.validate = args.validate;
    Validator.prototype.isValid = isValid;
  }

  return Validator;

})();

function isValid(model, callback) {
  if (typeof this.validate === 'function') {
    if (this.validate.length === 1)
      this.validate.call(model, function (err) {
        err = checkError(err);
        callback(err);
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
  if (!err || !err.message || !err.field) throw new Error("Missing ValidationError properties");
  return [new ValidationError(err.message, err.field)];
}
