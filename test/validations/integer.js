var expect = require('expect.js');
var Customer = require('../models/customer.js');
var customerSchema = require('../schemas/customer.json');
var customerData = require('../data/customer/basic.json');

describe('Validation', function(){

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('Validation - integer', function() {
    it('should show integer error message', function(done) {
      var customer = this.getCustomerFactory({age: 'not Age'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('age');
        expect(err[0].message).to.contain('Integer error message');
        done();
      });
    });
    it('should not show error, is a integer');
    it('should not show error, is a integer in a string');
    it('should show error, decimal is invalid integer');
  });
});
