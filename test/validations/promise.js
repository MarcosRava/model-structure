var expect = require('expect.js');
var Model = require('../../index.js');
var Validator = Model.Validator;
var Customer = require('../fixtures/models/customer.js');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args, opts) {
      return new Customer(args, opts);
    };

    this.error = {message: "Name field must be first letter in uppercase", field: 'name'};
  });

  describe('Promise', function () {
    describe('when not error', function () {

      it('should trigger validations parameter form Validator', function (done) {
        var customer = this.getCustomerFactory({name: 'Sanji', email: 'foo@dumb.com'});
        var validators = [new Validator({validate: firstLetterUpperCase})];
        var error = this.error;
        var promise = Validator.validate(customer, validators);

        promise.done(callback);

        function callback() {
          done();
        }

        function firstLetterUpperCase(done) {
          if (this.name[0].toUpperCase() === this.name[0]) {
            done();
          } else {
            done(error);
          }
        }
      });

    });
    describe('when has error', function () {

      it('should trigger validations parameter from Model instance', function (done) {
        var customer = this.getCustomerFactory({name: 'sanji', email: 'foo@dumb.com'});
        var validators = [new Validator({validate: firstLetterUpperCase})];
        var error = this.error;
        var promise = customer.isValid(validators);
        promise.fail(callback);

        function callback(err) {
          expect(err[0].field).to.be(error.field);
          expect(err[0].message).to.contain(error.message);
          done();
        }

        function firstLetterUpperCase(resolve, reject, notify) {
          if (this.name[0].toUpperCase() === this.name[0]) {
            resolve();
          } else {
            reject(error);
          }
        }
      });

      it('should trigger validations parameter from Validator', function (done) {
        var customer = this.getCustomerFactory({name: 'sanji', email: 'foo@dumb.com'});
        var validators = [new Validator({validate: firstLetterUpperCase})];
        var error = this.error;
        var promise = Validator.validate(customer, validators);
        promise.fail(callback);

        function callback(err) {
          expect(err[0].field).to.be(error.field);
          expect(err[0].message).to.contain(error.message);
          done();
        }

        function firstLetterUpperCase(resolve, reject, notify) {
          if (this.name[0].toUpperCase() === this.name[0]) {
            resolve();
          } else {
            reject(error);
          }
        }
      });

      it('should trigger validations parameter from Validator using async-validator sintaxe', function (done) {
        var customer = this.getCustomerFactory({name: 'sanji', age: 2, email: 'foo@dumb.com'});
        var validators = [];

        var asyncSchema = {
          "age" : {
            "type": "integer",
            "min" : 4,
            required: true
          }
        };

        var validator = new Validator({validate: asyncSchema});

        validators.push(validator);
        var promise = Validator.validate(customer, validators);
        promise.fail(callback).then(callback);

        function callback(err) {
          expect(err[0].field).to.be('age');
          expect(err[0].message).to.contain('age cannot be less than 4');
          done();
        }
      });

      it('should trigger validations parameter from Validator using async-validator sintaxe in constructor', function (done) {
        var validators = [];

        var asyncSchema = {
          "age" : {
            "type": "integer",
            "min" : 4,
            required: true
          }
        };

        var validator = new Validator({validate: asyncSchema});
        validators.push(validator);
        var customer = this.getCustomerFactory({name: 'sanji', age: 2}, {validators: validators});
        var promise = customer.isValid();
        promise.fail(callback);

        function callback(err) {
          expect(err[0].field).to.be('age');
          expect(err[0].message).to.contain('age cannot be less than 4');
          done();
        }
      });
    });
  });
});
