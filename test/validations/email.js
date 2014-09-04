var expect = require('expect.js');
var Customer = require('../models/customer.js');
var customerSchema = require('../schemas/customer.json');
var customerData = require('../data/customer/basic.json');

describe('Validation', function () {

  var errorExpectedMessage = 'is not a valid email!!';

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
    this.customerData = JSON.parse(JSON.stringify(customerData));
  });

  describe('email', function () {
    describe('when email is invalid', function () {
      it('should return error when email is not an email', function (done) {
        var customer = this.getCustomerFactory({email: 'not@email'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('email');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });

      it('should return error when email is in uppercase', function (done) {
        customerData.email = this.customerData.email.toUpperCase();
        var customer = this.getCustomerFactory(customerData);
        customer.isValid(function (err) {
          expect(err[0].field).to.be('email');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
    });

    describe('when email is valid', function () {
      it('should not return error', function (done) {
        var customer = this.getCustomerFactory(this.customerData);
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });

  });
});
