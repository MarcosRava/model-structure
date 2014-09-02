var model = require('../../index.js');
var Model = model.Model;

var schema = require('../schemas/phone.json');

var Phone;

module.exports = Phone = (function (_super) {
  function Phone(args) {
    _super._init_(this, args);
  }
  Phone.schema = schema;
  return Phone;
})(Model);
