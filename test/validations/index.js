var expect = require('expect.js');
var model = require('../../index.js');
var Model = model.Model;
var Validator = model.Validator;
var Customer = require('../fixtures/models/customer.js');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args, opts) {
      return new Customer(args, opts);
    };

    this.error = {message: "Name field must be first letter in uppercase", field: 'name'};
  });

  describe('Method', function () {
    it('should trigger validations parameter from Model instance', function (done) {
      var customer = this.getCustomerFactory({name: 'sanji'});
      var validators = [];
      var validator = new Validator({validate: firstLetterUpperCase});
      var error = this.error;

      function firstLetterUpperCase(done) {
        if (this.name[0].toUpperCase() === this.name[0]) {
          done();
        } else {
          done(error);
        }
      }
      validators.push(validator);
      customer.isValid(validators, function (err) {
        expect(err[0].field).to.be(error.field);
        expect(err[0].message).to.contain(error.message);
        done();
      });
    });

    it('validations length', function (done) {
      var validators = [];
      var validator = new Validator({validate: firstLetterUpperCase});
      var error = this.error;

      function firstLetterUpperCase(done) {
        if (this.name[0].toUpperCase() === this.name[0]) {
          done();
        } else {
          done(error);
        }
      }
      validators.push(validator);
      var customer = this.getCustomerFactory({name: 'Sanji', email:'foo@dumb.com'}, {validators:validators});
      customer.create()
      .then(function(customer) {
        customer.name = 'sanji';
        return customer.update();
      })
      .fail(function (err) {
        expect(err[0].field).to.be(error.field);
        expect(err[0].message).to.contain(error.message);
        expect(customer.access('validators').length).to.be(2);
        done();
      });
    });

    it('should trigger validations parameter form Validator', function (done) {
      var customer = this.getCustomerFactory({name: 'sanji', email:'foo@dumb.com'});
      var validators = [];
      var validator = new Validator({validate: firstLetterUpperCase});
      var error = this.error;

      function firstLetterUpperCase(done) {
        if (this.name[0].toUpperCase() === this.name[0]) {
          done();
        } else {
          done(error);
        }
      }
      validators.push(validator);
      Validator.validate(customer, validators, function (err) {
        expect(err[0].field).to.be(error.field);
        expect(err[0].message).to.contain(error.message);
        done();
      });
    });
  });
});
