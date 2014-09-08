var model = require('../../../index.js');
var Model = model.Model;
var Address;

var schema = {
  "messages": {
    "integer": "Integer error message"
  },
  "properties": {
    "id" : {
      "type": "integer",
      "primaryKey": true,
      "autoIncrement": true
    },
    "addressName" : {
      "type": "string",
      "length": {
        "minimum": 3,
        "maximum": 30
      }
    },
    "number" : {
      "type": "integer"
    },
    "zipCode" : {
      "type": "string"
    }
  }
};

module.exports = Address = (function (_super) {
  function Address(args) {
    _super.instantiate(this, args);
  }
  _super.init(Address, schema);
  return Address;
})(Model);
