var expect = require('expect.js');
var Model = require('../index.js');
var Validator = Model.Validator;
var Customer = require('./fixtures/models/customer.js');
var PromiseRepository = require('./fixtures/repositories/promiseRepository.js');
var customerData = require('./fixtures/data/customer/basic.json');

describe('Validation', function () {

  before(function () {
    this.getCustomerFactory = function getCustomerFactory(args, options) {
      return new Customer(args || customerData, options);
    };

    this.asyncId = null;
    this.promiseId = null;
  });

  describe('Crud', function () {
    describe('Async', function () {

      it('should create Customer', function (done) {
        var customer = this.getCustomerFactory();
        var _this = this;
        customer.create(function(err, data) {
          expect(data).to.be.a(Customer);
          _this.asyncId = data.id;
          for(var a in data) {
            if (!customerData[a] || a === 'id') continue;
            expect(data[a]).to.be(customerData[a]);
          }
          done();
        });
      });

      it('should load a Customer', function (done) {
        var customer = this.getCustomerFactory({id:this.asyncId});
        var _this = this;
        customer.load(function(err, data) {
          expect(data).to.be.a(Customer);
          expect(data.id).to.be(_this.asyncId);
          for(var a in data) {
            if (!customerData[a] || a === 'id') continue;
            expect(data[a]).to.be(customerData[a]);
          }
          done();
        });
      });

      it('should update a Customer', function (done) {
        var customer = this.getCustomerFactory();
        customer.id = this.asyncId;
        var name = "Marcos";
        customer.name = name;
        var _this = this;
        customer.update(function(err, data) {
          expect(data).to.be.a(Customer);
          expect(data.id).to.be(_this.asyncId);
          expect(data.name).to.be(name);
          for(var a in data) {
            if (!customerData[a] || a === 'id' || a === 'name') continue;
            expect(data[a]).to.be(customerData[a]);
          }
          done();
        });
      });

      it('should delete a Customer', function (done) {
        var customer = this.getCustomerFactory();
        customer.id = this.asyncId;
        var _this = this;
        customer.destroy(function(err, data) {
          expect(data).to.be.a(Customer);
          expect(data.id).to.be(_this.asyncId);
          done();
        });
      });
    });
    describe('Promise', function () {

      it('should create Customer', function (done) {
        var customer = this.getCustomerFactory(null, {repository: new PromiseRepository()});
        var promise = customer.create();
        var _this = this;
        promise.done(callback);
        function callback(data) {
          expect(data).to.be.a(Customer);
          _this.promiseId = data.id;
          for(var a in data) {
            if (!customerData[a] || a === 'id') continue;
            expect(data[a]).to.be(customerData[a]);
          }
          done();
        }
      });

      it('should create Customer', function (done) {
        var customer = this.getCustomerFactory({email: "marco"}, {repository: new PromiseRepository()});
        var promise = customer.create();
        promise.fail(callback);
        function callback(err) {
          expect(err).to.be.an(Array);
          expect(err[0].field).to.be('email');
          done();
        }
      });

      it('should load a Customer', function (done) {
        var customer = this.getCustomerFactory({id:this.promiseId}, {repository: new PromiseRepository()});
        var _this = this;
        var promise = customer.load();
        promise.done(callback);
        function callback(data) {
          expect(data).to.be.a(Customer);
          expect(data.id).to.be(_this.promiseId);
          for(var a in data) {
            if (!customerData[a] || a === 'id') continue;
            expect(data[a]).to.be(customerData[a]);
          }
          done();
        }
      });

      it('should update a Customer', function (done) {
        var customer = this.getCustomerFactory(null, {repository: new PromiseRepository()});
        var _this = this;
        customer.id = this.promiseId;
        var name = "Marcos";
        customer.name = name;
        var promise = customer.update();
        promise.done(callback);
        function callback(data) {
          expect(data).to.be.a(Customer);
          expect(data.id).to.be(_this.promiseId);
          expect(data.name).to.be(name);
          for(var a in data) {
            if (!customerData[a] || a === 'id' || a === 'name') continue;
            expect(data[a]).to.be(customerData[a]);
          }
          done();
        }
      });

      it('should delete a Customer', function (done) {
        var customer = this.getCustomerFactory(null, {repository: new PromiseRepository()});
        var _this = this;
        customer.id = this.promiseId;
        var promise = customer.destroy();
        promise.done(callback);
        function callback(data) {
          expect(data).to.be.a(Customer);
          expect(data.id).to.be(_this.promiseId);
          done();
        }
      });
    });
  });
});
