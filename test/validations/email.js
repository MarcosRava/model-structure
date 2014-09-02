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

  describe('Validation - email', function() {
    it('should show email error message', function(done) {
      var customer = this.getCustomerFactory({email: 'not@email'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('email');
        expect(err[0].message).to.contain('is not a valid email!!');
        done();
      });
    });
    it('should not show error, is a valid email');
    it('should invalid uppercase email');
  });
});
