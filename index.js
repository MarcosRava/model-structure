(function (exports, module, define, require) {
  var Model = require('./src/model');
  Model.Validator = require('./src/validator');
  Model.ValidationError = require('./src/validation-error.js');

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
    typeof module  !== 'undefined' ? module  : null,
    typeof define  !== 'undefined' ? define  : null,
    typeof require !== 'undefined' ? require : null
);
