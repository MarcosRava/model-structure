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
      it('should have only schema properties in nested array', function () {
        var phone = {number: 995952478, areaCode: 11, q :1};
        var customer = this.getCustomerFactory({phones:[phone]});
        expect(customer.phones[0].q).to.not.be(1);
      });
      it('should have only schema properties in nested array', function () {
        var address = {addressName: 'Street X', number: 'X100', zipCode: '010400', q:1};
        var customer = this.getCustomerFactory({address: address});
        expect(customer.address.q).to.not.be(1);
      });
    });

    describe('when nested object is valid', function () {
      it('should validate fields in nested object', function (done) {
        var address = {addressName: 'Street X', number: 'X100', zipCode: '010400'};
        var customer = this.getCustomerFactory({address: address});
        customer.isValid(function (err) {
          expect(err).to.not.be(null);
          expect(err[0].field).to.be('address.number');
          done();
        });
      });
      it('should validate fields in nested objects in array', function (done) {
        var phone1 = {number: 'X100', areaCode: 11};
        var phone2 = {number: 995952478, areaCode: 11};
        var customer = this.getCustomerFactory({phones:[phone2, phone1]});
        customer.isValid(function (err) {
          expect(err).to.not.be(null);
          expect(err[0].field).to.be('phones[1].number');
          done();
        });
      });
    });
  });
});
