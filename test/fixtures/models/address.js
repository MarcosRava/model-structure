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
      "minimum": 3,
      "maximum": 30
    },
    "number" : {
      "type": "integer"
    },
    "zipCode" : {
      "type": "string"
    }
  }
};

module.exports = Address = (function () {
  function Address(args, options) {
    Model.instantiate(this, args, options);
  }
  Model.init(Address, schema);
  return Address;
})();
