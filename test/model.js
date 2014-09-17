var expect = require('expect.js');
var Customer = require('./fixtures/models/customer.js');
var model = require('../index.js');
var Model = model.Model;
var Validator = model.Validator;

describe('Model', function () {


  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('.isValid', function () {
//
//    it('should throw exception when the callback function is not passed', function (done) {
//      var customer = this.getCustomerFactory();
//      expect(customer.isValid).to.throwException(function (e) {
//        expect(e).to.be.a(Error);
//        expect(e.message).to.be('Must pass a callback function');
//        done();
//      });
//    });

    it('should use optional validations and ignore default validations', function (done) {
      // default validations has a minimum validation setted as 3 for the name attribute
      var customer = this.getCustomerFactory({name: 'a'});
      var customValidations = {name: {type: 'string'}};
      var validators = [];
      var validator = new Validator({validate: customValidations});
      validators.push(validator);
      customer.isValid(validators, function (err) {
        expect(err).to.be(null);
        done();
      });
    });

    it('should use default validations when optional validations are not passed', function (done) {
      var customer = this.getCustomerFactory({name: 'aa'});
      customer.isValid(function (err) {
        expect(err[0].field).to.be('name');
        expect(err[0].message).to.contain('name must be between 3 and 30 characters');
        done();
      });
    });

  });
});
