var expect = require('expect.js');
var Customer = require('../models/customer.js');
var customerSchema = require('../schemas/customer.json');
var customerData = require('../data/customer/basic.json');

describe('Validation', function(){

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('Validation - datetime', function(){
    it('should show date error message', function (done) {
      var customer = this.getCustomerFactory({createdAt: 'not@email'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('createdAt');
        expect(err[0].message).to.contain('createdAt date ' + customer.createdAt + ' is invalid');
        done();
      });
    });
    it('should show error when has aditional characters exists after string date', function (done) {
      var customer = this.getCustomerFactory({createdAt: '1991-01-021'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('createdAt');
        expect(err[0].message).to.contain('createdAt date ' + customer.createdAt + ' is invalid');
        done();
      });
    });
    it('should not show error, is a valid date in string format', function (done) {
      var customer = this.getCustomerFactory({createdAt: '1991-01-01'});
      customer.isValid(function(err) {
        expect(err).to.be(null);
        done();
      });

    });
    it('should not show error, is a valid date in string format', function (done) {
      var customer = this.getCustomerFactory({createdAt: '1991-01-01T02:00:00.000Z'});
      customer.isValid(function(err) {
        expect(err).to.be(null);
        done();
      });

    });
    it('should not show error, is a valid date object', function (done) {
      var customer = this.getCustomerFactory({createdAt: new Date()});
      customer.isValid(function(err) {
        expect(err).to.be(null);
        done();
      });

    });
    it('should invalid date, june 31', function (done) {
      var customer = this.getCustomerFactory({createdAt: '1991-06-31'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('createdAt');
        expect(err[0].message).to.contain('createdAt date ' + customer.createdAt + ' is invalid');
        done();
      });

    });
  });
});
