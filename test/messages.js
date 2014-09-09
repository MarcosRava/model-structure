var expect = require('expect.js');
var Customer = require('./fixtures/models/customer.js');
var customerSchema = Customer.schema;
var customerData = require('./fixtures/data/customer/basic.json');
var Model = Customer.prototype.super_;
describe('Messages', function(){

  before(function () {
    this.getCustomerFactory = function getCustomerFactory() {
      return new Customer(customerData);
    };
  });

  describe('Using Model locale', function(){
    it('should change to pt-BR and change again to en', function(done){
      var _this = this;
      var customer = this.getCustomerFactory();
      Model.addMessages('pt-BR', {types: {boolean: "%s não é um %s"}});
      Model.setLocale('pt-BR');
      customer.active = 'oi';
      customer.isValid(function (err) {
        expect(err[0].field).to.be('active');
        expect(err[0].message).to.contain('active não é um boolean');
        Model.setLocale('en');
        customer.isValid(function (err2) {
          expect(err2[0].field).to.be('active');
          expect(err2[0].message).to.contain('active is not a boolean');
          done();
        });
      });
    });
  });
});
