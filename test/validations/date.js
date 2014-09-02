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
        expect(err[0].message).to.contain('birthDate date Inválid date is invalid');
        done();
      });
    });
    it('should  show error, when has aditional characters exists after string date');
    it('should not show error, is a valid date in string format');
    it('should not show error, is a valid date object');
    it('should invalid date, june 31');
  });
});
