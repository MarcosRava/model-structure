(function (exports, module, define, require) {
  var root = this;
  var Model = require('./src/model');
  var Validator = require('./src/validator');

  if (exports) {
    if (module && module.exports) exports = module.exports = {Model: Model, Validator: Validator};
    exports.Model = Model;
    exports.Validator = Validator;
  }
  if (window) {
    window.Model = Model;
    window.Validator = Validator;
  }
  if (define && define.amd) {
    define("Model", [], function () { return Model; });
    define("Validator", [], function () { return Validator; });
  }
}).call(this,
        typeof exports !== 'undefined' ? exports : null,
        typeof module !== 'undefined' ? module : null,
        typeof define !== 'undefined' ? define : null,
        typeof require !== 'undefined' ? require : null);
