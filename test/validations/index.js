var expect = require('expect.js');
var model = require('../../index.js');
var Model = model.Model;
var Validator = model.Validator;
var Customer = require('../models/customer.js');

describe('Validation', function(){

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('Method', function() {
    it('should show email error message', function(done) {
      var customer = this.getCustomerFactory({name: 'sanji'});
      var validators = [];
      var validator = new Validator({validate: firstLetterUpperCase});

      function firstLetterUpperCase(done) {
        var error = {message:"Name field must be first letter in uppercase", field: 'name'};
        if (this.name[0].toUpperCase() === this.name[0]) {
          done();
        } else {
          done(error);
        }
      }
      validators.push(validator);
      customer.isValid(validators, function(err) {
        console.log(err)
        expect(err[0].field).to.be('name');
        expect(err[0].message).to.contain('is not a valid email!!');
        done();
      });
    });
  });
});
