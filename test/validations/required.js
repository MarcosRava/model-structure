var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerSchema = Customer.schema;
var customerData = require('../fixtures/data/customer/basic.json');
var model = require('../../index.js');
var Model = model.Model;
var Validator = model.Validator;

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args, opts) {
      return new Customer(args, opts);
    };
  });

  describe('required', function () {
    describe('when required is invalid', function () {
      it('should return error when name is not passed', function (done) {
        var validators = [];
        var schema = {
          name: {type: "string", required: true}
        };
        var validator = new Validator({validate: schema});
        validators.push(validator);
        var customer = this.getCustomerFactory({name:undefined});
        customer.isValid(validators, function (err) {
          expect(err[0].field).to.be('name');
          done();
        });
      });
    });

    describe('when required is valid', function () {
      it('should not return error when name is passed', function (done) {
        var validators = [];
        var schema = {
          name: {type: "string", required: true}
        };
        var validator = new Validator({validate: schema});
        validators.push(validator);
        var customer = this.getCustomerFactory({name:"Marcos"}, {validators:validators});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });
    });
  });
});
