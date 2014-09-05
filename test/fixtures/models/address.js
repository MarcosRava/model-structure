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
      "required": true,
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
    _super._init_(this, args);
  }
  Address.schema = schema;
  return Address;
})(Model);
