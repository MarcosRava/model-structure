var expect = require('expect.js');
var Model = require('../../index.js');
var Validator = Model.Validator;
var Customer = require('../fixtures/models/customer.js');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };

    this.error = {message: "Name field must be first letter in uppercase", field: 'name'};
  });

  describe('Promise', function () {
    describe('when not error', function () {

      it('should trigger validations parameter form Validator', function (done) {
        var customer = this.getCustomerFactory({name: 'Sanji'});
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
        var promise = Validator.validate(customer, validators);

        promise.done(callback);

        function callback() {
          done();
        }
      });

    });
    describe('when has error', function () {

      it('should trigger validations parameter from Model instance', function (done) {
        var customer = this.getCustomerFactory({name: 'sanji'});
        var validators = [];
        var validator = new Validator({validate: firstLetterUpperCase});
        var error = this.error;

        function firstLetterUpperCase(resolve, reject, notify) {
          if (this.name[0].toUpperCase() === this.name[0]) {
            resolve();
          } else {
            reject(error);
          }
        }

        validators.push(validator);
        var promise = customer.isValid(validators);
        promise.fail(callback);

        function callback(err) {
          expect(err[0].field).to.be(error.field);
          expect(err[0].message).to.contain(error.message);
          done();
        }
      });

      it('should trigger validations parameter form Validator', function (done) {
        var customer = this.getCustomerFactory({name: 'sanji'});
        var validators = [];
        var validator = new Validator({validate: firstLetterUpperCase});
        var error = this.error;

        function firstLetterUpperCase(resolve, reject, notify) {
          if (this.name[0].toUpperCase() === this.name[0]) {
            resolve();
          } else {
            reject(error);
          }
        }

        validators.push(validator);
        var promise = Validator.validate(customer, validators);
        promise.fail(callback);

        function callback(err) {
          expect(err[0].field).to.be(error.field);
          expect(err[0].message).to.contain(error.message);
          done();
        }
      });
    });
  });
});
