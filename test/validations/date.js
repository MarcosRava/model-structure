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

  describe('Validation - date', function(){
    it('should show date error message', function (done) {
      var customer = this.getCustomerFactory({birthDate: 'not@email'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('birthDate');
        console.log(err)
        expect(err[0].message).to.contain('birthDate date ' + customer.birthDate + ' is invalid');
        done();
      });
    });
    it('should show error when has aditional characters exists after string date', function (done) {
      var customer = this.getCustomerFactory({birthDate: '1991-01-021'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('birthDate');
        expect(err[0].message).to.contain('birthDate date ' + customer.birthDate + ' is invalid');
        done();
      });
    });
    it('should not show error, is a valid date in string format', function (done) {
      var customer = this.getCustomerFactory({birthDate: '1991-01-01'});
      customer.isValid(function(err) {
        expect(err).to.be(null);
        done();
      });

    });
    it('should not show error, is a valid date object', function (done) {
      var customer = this.getCustomerFactory({birthDate: new Date()});
      customer.isValid(function(err) {
        expect(err).to.be(null);
        done();
      });

    });
    it('should invalid date, june 31', function (done) {
      var customer = this.getCustomerFactory({birthDate: '1991-06-31'});
      customer.isValid(function(err) {
        expect(err[0].field).to.be('birthDate');
        expect(err[0].message).to.contain('birthDate date ' + customer.birthDate + ' is invalid');
        done();
      });

    });
  });
});
