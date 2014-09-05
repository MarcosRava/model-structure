var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerSchema = Customer.schema;
var customerData = require('../fixtures/data/customer/basic.json');

describe('Validation', function () {

  var errorExpectedMessage = customerSchema.messages.float;

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('float', function () {
    describe('when float is invalid', function () {
      it('should return error when float is not an float', function (done) {
        var customer = this.getCustomerFactory({income: 'not Income'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('income');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
      it('should return error when float is a float in a string', function (done) {
        var customer = this.getCustomerFactory({income: '10.5'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('income');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
    });

    describe('when float is valid', function () {
      it('should not return error when float is an float', function (done) {
        var customer = this.getCustomerFactory({income: 10.5});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when float is an integer', function (done) {
        var customer = this.getCustomerFactory({income: 10});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });
  });
});
