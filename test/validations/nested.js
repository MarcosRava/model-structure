var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerData = require('../fixtures/data/customer/basic.json');

describe('Validation', function () {

  var errorExpectedMessage = 'address is not an object';

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('nested objects', function () {
    describe('when nested object is invalid', function () {
      it('should return error when address is not an object', function (done) {
        var address = 'not an object';
        var customer = this.getCustomerFactory({address: address});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('address');
          expect(err[0].message).to.contain(errorExpectedMessage);
          done();
        });
      });
    });

    describe('when nested object is valid', function () {
      it('should validate fields in nested object', function (done) {
        var address = {addressName: 'Street X', number: 'X100', zipCode: '010400'};
        var customer = this.getCustomerFactory({address: address});
        customer.isValid(function (err) {
          expect(err).to.not.be(null);
          expect(err[0].field).to.be('address');
          done();
        });
      });
    });
  });
});
