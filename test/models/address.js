var model = require('../../index.js');
var Model = model.Model;

var schema = require('../schemas/address.json');

var Address;

module.exports = Address = (function (_super) {
  function Address(args) {
    _super._init_(this, args);
  }
  Address.schema = schema;
  return Address;
})(Model);
