var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerSchema = Customer.schema;
var customerData = require('../fixtures/data/customer/basic.json');

describe('Validation', function () {

  var errorExpectedMessage = customerSchema.messages.integer;

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('integer', function () {
    describe('when integer is invalid', function () {
      it('should return error when integer is not an integer', function (done) {
        var customer = this.getCustomerFactory({age: 'not Age', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('age');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
      it('should return error when integer is an integer in a string', function (done) {
        var customer = this.getCustomerFactory({age: '10', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('age');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
    });

    describe('when integer is valid', function () {
      it('should not return error when integer is an integer', function (done) {
        var customer = this.getCustomerFactory({age: 100, email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });
  });
});
