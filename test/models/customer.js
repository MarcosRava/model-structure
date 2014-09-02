var model = require('../../index.js');
var Model = model.Model;
var Phone = require('./address.js');
var Address = require('./address.js');
var schema = require('../schemas/customer.json');

var Customer;

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
