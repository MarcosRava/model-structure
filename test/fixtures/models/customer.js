var Model = require('../../../index.js');
var Phone = require('./phone.js');
var Address = require('./address.js');

var Customer;



module.exports = Customer = (function () {
  function Customer(args, options) {
    Model.instantiate(this, args, options);
  }

  Customer.STATUS = {
    LEAD: 0,
    CUSTOMER: 1
  };

  var schema = {
    "messages": {
      "integer": "Integer error message",
      "float": "Float error message",
    },
    "properties": {
      "id" : {
        "type": "integer",
        "primaryKey": true,
        "autoIncrement": true
      },
      "name" : {
        "type": "string",
        "minimum": 3,
        "maximum": 30
      },
      "email" : {
        "type": "email",
        "required": true,
        "unique": true,
        "minimum": 7,
        "messages": {
          "type": "is not a valid email!!",
          "minimum": "Short email (custom attribute message)"
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
      "active" : {
        "type": "boolean"
      },
      "gender": {
        "type": "enum",
        "values" : {
          "ref": ["M", "F"],
          "type": "char"
        }
      },
      "phones" :{
        "type": "array",
        "model": {
          "ref": Phone
        }
      },
      "address": {
        "type": "object",
        "model": {
          "ref": Address
        }
      },
      "statusId" : {
        "type": "enum",
        "values": {
          "ref": Customer.STATUS,
          "type": "integer"
        }
      }
    }
  };

  Model.init(Customer, schema);

  return Customer;
})();
