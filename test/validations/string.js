var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerData = require('../fixtures/data/customer/basic.json');

describe('Validation', function () {

  var errorExpectedMessage = 'name is not a string';
  var rangeErrorExpectedMessage = 'name must be between 3 and 30 characters';

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('string', function () {
    describe('when string is invalid', function () {
      it('should return error when string is a number', function (done) {
        var customer = this.getCustomerFactory({name: 1111});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('name');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });

      it('should return error when string is an array', function (done) {
        var customer = this.getCustomerFactory({name: []});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('name');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });

      it('should return error when string is a boolean', function (done) {
        var customer = this.getCustomerFactory({name: true});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('name');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });

      it('should return error when string is an object', function (done) {
        var customer = this.getCustomerFactory({name: {} });
        customer.isValid(function (err) {
          expect(err[0].field).to.be('name');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });

      it('should return string minimum length error message', function (done) {
        var customer = this.getCustomerFactory({name: 'aa'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('name');
          expect(err[0].message).to.contain(rangeErrorExpectedMessage);
          done();
        });
      });

      it('should return string maximum length error message', function (done) {
        var customer = this.getCustomerFactory({name: (new Array(32).join('a')) });
        customer.isValid(function (err) {
          expect(err[0].field).to.be('name');
          expect(err[0].message).to.contain(rangeErrorExpectedMessage);
          done();
        });
      });

    });
    describe('when string is valid', function () {
      it('should not return error when string is valid', function (done) {
        var customer = this.getCustomerFactory({name: 'Valid string'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when string has the minimum length', function (done) {
        var customer = this.getCustomerFactory({name: '123'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when string has the maximum length', function (done) {
        var customer = this.getCustomerFactory({name: (new Array(31).join('a')) });
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });
  });
});
