var expect = require('expect.js');
var Customer = require('../models/customer.js');
var customerData = require('../data/customer/basic.json');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('nested objects', function () {
    describe('when nested object is invalid', function () {
      it('should show nested error message');
    });
    describe('when nested object is valid', function () {
      it('should validate fields in nested object');
    });
  });
});
