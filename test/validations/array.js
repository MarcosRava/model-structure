var expect = require('expect.js');
var Customer = require('../fixtures/models/customer.js');
var customerData = require('../fixtures/data/customer/basic.json');
var Message = require('../test-helpers/message.js');

describe('Validation', function () {

  var errorExpectedMessage = 'tags is not an array';

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args) {
      return new Customer(args);
    };
  });

  describe('array', function () {
    describe('when array is invalid', function () {
      it('should return error when array is not a array', function (done) {
        var customer = this.getCustomerFactory({tags: 'not array', email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err[0].field).to.be('tags');
          expect(err[0].message).to.be(errorExpectedMessage);
          done();
        });
      });
    });

    describe('when array is valid', function () {
      it('should not return error when array is an array with string', function (done) {
        var customer = this.getCustomerFactory({tags: ['rico', 'com', 'vc'], email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should not return error when array is an array with integers', function (done) {
        var customer = this.getCustomerFactory({tags: [1, 2, 3], email:'foo@dumb.com'});
        customer.isValid(function (err) {
          expect(err).to.be(null);
          done();
        });
      });

      it('should return Model instances', function (done) {
        var customer = this.getCustomerFactory({name:"Marcos", hdhd:56756, email:'foo@dumb.com'});
        customer.create(function (err) {
          Customer.get(function(err, customers) {
            expect(err).to.be(null);
            expect(customers).to.be.an(Array);
            expect(customers[0]).to.be.a(Customer);
            done();
          });
        });
      });

    });

  });
});
