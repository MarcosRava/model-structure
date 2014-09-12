(function (exports, module, define, require) {
  var root = this;
  var Model = require('./src/model');
  var Validator = require('./src/validator');
  var ValidationError = require('./src/validation-error.js');
  //Model.Model = Model;
  Model.Validator = Validator;
  Model.ValidationError = ValidationError;

  if (exports) {
    if (module && module.exports) exports = module.exports = Model;
  }
  if (this.window && window) {
    window.Model = Model;
  }
  if (define && define.amd) {
    define("Model", [], function () { return Model; });
  }
})(
    typeof exports !== 'undefined' ? exports : null,
    typeof module !== 'undefined' ? module : null,
    typeof define !== 'undefined' ? define : null,
    typeof require !== 'undefined' ? require : null
);
