var model = require('../../../index.js');
var Model = model.Model;
var Phone = require('./address.js');
var Address = require('./address.js');

var Customer;

var schema = {
  "messages": {
    "integer": "Integer error message",
    "float": "Float error message",
  },
  "properties": {
    "id" : {
      "type": "integer",
      "required": true,
      "primaryKey": true,
      "autoIncrement": true
    },
    "name" : {
      "type": "string",
      "length": {
        "minimum": 3,
        "maximum": 30
      }
    },
    "email" : {
      "type": "email",
      "message": "is not a valid email!!",
      "length": {
        "minimum": 7,
        "tooShort": "Short email (custom attribute message)"
      }
    },
    "age" : {
      "type": "integer"
    },
    "hands" : {
      "type": "integer"
    },
    "income" : {
      "type": "float"
    },
    "birthDate" : {
      "type": "date"
    },
    "createdAt" : {
      "type": "datetime"
    },
    "tags" : {
      "type": "array"
    },
    "gender": {
      "type": "enum",
      "values" : {
        "ref": ["M", "F"]
      }
    }
  }
};

module.exports = Customer = (function (_super) {
  function Customer(args) {
    _super._init_(this, args);
  }

  Customer.STATUS = {
    LEAD: 0,
    CUSTOMER: 1
  };

  schema.properties.phones = { "type": "array", "model": { "ref": Phone } };
  schema.properties.address = { "type": "object", "model": { "ref": Address } };
  schema.properties.statusId = { "type": "enum", "values": {"ref": Customer.STATUS, "type": "integer"} };
  Customer.schema = schema;
  return Customer;
})(Model);
