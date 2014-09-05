var expect = require('expect.js');
var Customer = require('../models/customer.js');
var customerData = require('../data/customer/basic.json');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('enumerable', function () {
    it('should return enumerable error message', function (done) {
      var customer = this.getCustomerFactory({gender: 'R'});
      customer.isValid(function (err) {
        expect(err[0].field).to.be('gender');
        expect(err[0].message).to.contain('gender must be one of M, F');
        done();
      });
    });
    it('should return enumerable error message', function (done) {
      var customer = this.getCustomerFactory({statusId: 4});
      customer.isValid(function (err) {
        expect(err[0].field).to.be('statusId');
        expect(err[0].message).to.contain('statusId must be one of 0, 1');
        done();
      });
    });
  });
});
