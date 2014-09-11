var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerSchema = Customer.schema;

describe('Validation', function () {

  var errorExpectedMessage = customerSchema.properties.email.messages.type;

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
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
        var customer = this.getCustomerFactory({email: 'test@rico.com.vc'.toUpperCase()});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('email');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
    });

    describe('when email is valid', function () {
      it('should not return error', function (done) {
        var customer = this.getCustomerFactory({email: 'test@rico.com.vc'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });

  });
});
