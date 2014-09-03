(function (exports, module, define, require) {
  var root = this;
  var Model = require('./src/model');
  var Validator = require('./src/validator');
  var ValidationError = require('./src/validation-error.js');

  if (exports) {
    if (module && module.exports) exports = module.exports = {Model: Model, Validator: Validator, ValidationError: ValidationError};
    exports.Model = Model;
    exports.Validator = Validator;
    exports.ValidationError = ValidationError;
  }
  if (this.window && window) {
    window.Model = Model;
    window.Validator = Validator;
    window.ValidationError = ValidationError;
  }
  if (define && define.amd) {
    define("Model", [], function () { return Model; });
    define("Validator", [], function () { return Validator; });
    define("ValidationError", [], function () { return ValidationError; });
  }
})(
    typeof exports !== 'undefined' ? exports : null,
    typeof module !== 'undefined' ? module : null,
    typeof define !== 'undefined' ? define : null,
    typeof require !== 'undefined' ? require : null
);
