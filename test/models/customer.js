var model = require('../../index.js');
var Model = model.Model;

var schema = require('../schemas/customer.json');

var Customer;

module.exports = Customer = (function (_super) {
  function Customer(args) {
    _super._init_(this, args);
  }
  Customer.schema = schema;
  return Customer;
})(Model);
