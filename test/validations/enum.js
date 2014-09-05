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
    describe('when enumerable is invalid', function () {
      it('should return error when value is a string and is not in the options accept', function (done) {
        var customer = this.getCustomerFactory({gender: 'R'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('gender');
          expect(err[0].message).to.contain('gender must be one of M, F');
          done();
        });
      });

      it('should return error when value is an integer and is not in the options accept', function (done) {
        var customer = this.getCustomerFactory({statusId: 4});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('statusId');
          expect(err[0].message).to.contain('statusId must be one of 0, 1');
          done();
        });
      });
    });

    describe('when enumerable is valid', function () {
      it('should not return error when value is an integer and is in the options accept', function (done) {
        var customer = this.getCustomerFactory({statusId: 0});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when value is a string and is in the options accept', function (done) {
        var customer = this.getCustomerFactory({gender: 'F'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });
  });
});
