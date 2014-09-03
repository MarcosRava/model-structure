var expect = require('expect.js');
var model = require('../index.js');
var Model = model.Model;
var Customer = require('./models/customer.js');
var modelRepository = require('./repositories/modelRepository.js');
var customerRepository = require('./repositories/customerRepository.js');
var argumentRepository = require('./repositories/argumentRepository.js');

describe('Repository', function(){

  before(function () {
  });

  describe('Check Repository fallback', function() {
    it('should use memory Repository', function() {
      var customer = new Customer();
      expect(customer.access('repository').constructor.name).to.be('Repository');
    });
    it('should use argument Repository', function() {
      var customer = new Customer({repository: new argumentRepository()});
      expect(customer.access('repository').constructor.name).to.be('ArgumentRepository');
    });
    it('should use Customer Repository', function() {
      Customer.repository = customerRepository;
      var customer = new Customer();
      expect(customer.access('repository').constructor.name).to.be('CustomerRepository');
      delete Customer.repository;
    });
    it('should use Model Repository', function() {
      Model.repository = modelRepository;
      var customer = new Customer();
      expect(customer.access('repository').constructor.name).to.be('ModelRepository');
      delete Model.repository;
    });
  });
});
