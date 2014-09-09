var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var Phone = require('../fixtures/models/phone.js');
var Address = require('../fixtures/models/address.js');
var customerData = require('../fixtures/data/customer/basic.json');
var _ = require('underscore');


var swaggerCustomer = {
  "Customer": {
    "id": "Customer",
    "required": [
      "id", "email"
    ],
    "properties": {
      "id": {
        "type": "integer"
      },
      "name": {
        "type": "string",
        "length": {
          "minimum": "3",
          "maximum": "30"
        }
      },
      "email": {
        "type": "string",
        "length": {
          "minimum": "7",
          "maximum": "undefined"
        }
      },
      "age": {
        "type": "integer"
      },
      "hands": {
        "type": "integer"
      },
      "income": {
        "type": "number",
        "format": "float"
      },
      "birthDate": {
        "type": "string",
        "format": "date"
      },
      "createdAt": {
        "type": "string",
        "format": "datetime"
      },
      "tags": {
        "type": "array"
      },
      "gender": {
        "type": "char",
        "enum": [
          "0: M",
          "1: F"
        ]
      },
      "phones": {
        "type": "array",
        "items": {
          "$ref": "Phone"
        }
      },
      "address": {
        "$ref": "Address"
      },
      "statusId": {
        "type": "integer",
        "enum": [
          "LEAD: 0",
          "CUSTOMER: 1"
        ]
      },
      "active": { "type": 'boolean' }
    }
  },
  "Phone": {
    "id": "Phone",
    "properties": {
      "id": {
        "type": "integer"
      },
      "number": {
        "type": "integer"
      },
      "areaCode": {
        "type": "integer"
      }
    }
  },
  "Address": {
    "id": "Address",
    "properties": {
      "id": {
        "type": "integer"
      },
      "addressName": {
        "type": "string",
        "length": {
          "minimum": "3",
          "maximum": "30"
        }
      },
      "number": {
        "type": "integer"
      },
      "zipCode": {
        "type": "string"
      }
    }
  }
};

describe('Swagger', function () {
  describe('Customer', function () {
    it('should import the same struct to swagger models', function () {
      expect(_.isEqual(swaggerCustomer, Customer.access('swagger'))).to.be(true);
    });
  });
  describe('Address', function () {
    it('should import the same struct to swagger models', function () {
      expect(_.isEqual(swaggerCustomer.Address, Address.access('swagger').Address)).to.be(true);
    });
  });
  describe('Phone', function () {
    it('should import the same struct to swagger models', function () {
      expect(_.isEqual(swaggerCustomer.Phone, Phone.access('swagger').Phone)).to.be(true);
    });
  });
});
