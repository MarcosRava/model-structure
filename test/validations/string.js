var expect = require('expect.js');
var Customer = require('../models/customer.js');
var customerData = require('../data/customer/basic.json');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('string', function () {
    it('should show string error message');
    it('should show string minimum length error message');
    it('should show string maximum length error message');
    it('should test string with minmum and maximum');
    it('should not show error, is a valid string');
  });
});
