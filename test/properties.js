var expect = require('expect.js');
var Customer = require('./fixtures/models/customer.js');
var customerSchema = Customer.schema;
var customerData = require('./fixtures/data/customer/basic.json');

describe('Properties', function(){

  before(function () {
    this.getCustomerFactory = function getCustomerFactory() {
      return new Customer(customerData);
    };
  });

  describe('The object properties must be a mirror of the schema', function(){
    it('the object properties must be a mirror of the schema', function(){
      var customer = this.getCustomerFactory();
      var keys = Object.keys(customer);
      var attr;
      for (attr in customerSchema.properties) {
        expect(keys.indexOf(attr)).to.not.be(-1);
      }
      for (attr in  keys) {
        expect(customerSchema.properties[keys[attr]]).to.not.be(undefined);
      }
    });
  });
});
