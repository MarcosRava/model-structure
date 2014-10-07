var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerData = require('../fixtures/data/customer/basic.json');
var Message = require('../test-helpers/message.js');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('datetime', function () {
    describe('when datetime is invalid', function () {
      it('should return error when date is not a date', function (done) {
        var customer = this.getCustomerFactory({createdAt: 'not@email', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('createdAt');
          expect(err[0].message).to.contain(Message.errorExpected('createdAt', 'date', customer.createdAt));
          done();
        });
      });

      it('should return error when date has an additional number', function (done) {
        var customer = this.getCustomerFactory({createdAt: '1991-01-021', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('createdAt');
          expect(err[0].message).to.contain(Message.errorExpected('createdAt', 'date', customer.createdAt));
          done();
        });
      });

      it('should return error when date is a date that not exists', function (done) {
        var customer = this.getCustomerFactory({createdAt: '1991-06-31', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('createdAt');
          expect(err[0].message).to.contain(Message.errorExpected('createdAt', 'date', customer.createdAt));
          done();
        });
      });
    });

    describe('when datetime is valid', function () {
      it('should not return error when date is in a string format', function (done) {
        var customer = this.getCustomerFactory({createdAt: '1991-01-01', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when datetime is in a string format', function (done) {
        var customer = this.getCustomerFactory({createdAt: '1991-01-01T02:00:00.000Z', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when date is in a date object', function (done) {
        var customer = this.getCustomerFactory({createdAt: new Date(), email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });

  });
});
