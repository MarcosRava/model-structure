var expect = require('expect.js');
var Model = require('../index.js');
var Customer = require('./fixtures/models/customer.js');
var modelRepository = require('./fixtures/repositories/modelRepository.js');
var customerRepository = require('./fixtures/repositories/customerRepository.js');
var argumentRepository = require('./fixtures/repositories/argumentRepository.js');

describe('Repository', function(){

  before(function () {
  });

  describe('Check Repository fallback', function() {
    it('should use memory Repository', function() {
      var customer = new Customer();
      expect(customer.access('repository').constructor.name).to.be('Repository');
    });
    it('should use argument Repository', function() {
      var customer = new Customer({}, {repository: new argumentRepository()});
      expect(customer.access('repository').constructor.name).to.be('ArgumentRepository');
    });
    it('should use Customer Repository', function() {
      Customer.repository = new customerRepository();
      var customer = new Customer();
      expect(customer.access('repository').constructor.name).to.be('CustomerRepository');
      delete Customer.repository;
    });
    it('should use Model Repository', function() {
      Model.repository = new modelRepository();
      var customer = new Customer();
      expect(customer.access('repository').constructor.name).to.be('ModelRepository');
      delete Model.repository;
    });
  });
});
