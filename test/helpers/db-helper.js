var expect = require('expect.js');
var Model = require('../../index.js').Model;
var Customer = require('../fixtures/models/customer.js');
var customerData = require('../fixtures/data/customer/basic.json');

describe('DB Helper', function () {

  before(function () {
    this.nodeDbMigrateSchema = Model.getSchema('dbMigrate', Customer.schema);
    console.log(new Array(100).join('.'));
    console.log(this.nodeDbMigrateSchema);
  });

  describe('attribute is primary key', function () {
    it('should return primaryKey equals true', function (done) {
      var primaryKey = this.nodeDbMigrateSchema.id.primaryKey;
      expect(primaryKey).to.be(true);
      done();
    });
  });
  describe('attribute is not primary key', function () {
    it('should return primaryKey equals undefined', function (done) {
      var primaryKey = this.nodeDbMigrateSchema.name.primaryKey;
      expect(primaryKey).to.be(undefined);
      done();
    });
  });

  describe('attribute is auto-increment', function () {
    it('should return autoIncrement equals true', function (done) {
      var autoIncrement = this.nodeDbMigrateSchema.id.autoIncrement;
      expect(autoIncrement).to.be(true);
      done();
    });
  });
  describe('attribute is not auto-increment', function () {
    it('should return autoIncrement equals undefined', function (done) {
      var autoIncrement = this.nodeDbMigrateSchema.name.autoIncrement;
      expect(autoIncrement).to.be(undefined);
      done();
    });
  });

  describe('attribute is unique', function () {
    it('should return unique equals true', function (done) {
      var unique = this.nodeDbMigrateSchema.email.unique;
      expect(unique).to.be(true);
      done();
    });
  });

  describe('attribute is not unique', function () {
    it('should return unique equals undefined', function (done) {
      var unique = this.nodeDbMigrateSchema.name.unique;
      expect(unique).to.be(undefined);
      done();
    });
  });

  describe('attribute is required', function () {
    it('should return notNull equals true', function (done) {
      var notNull = this.nodeDbMigrateSchema.email.notNull;
      expect(notNull).to.be(true);
      done();
    });
  });

  describe('attribute is not required', function () {
    it('should return notNull equals undefined', function (done) {
      var notNull = this.nodeDbMigrateSchema.name.notNull;
      expect(notNull).to.be(undefined);
      done();
    });
  });

  describe('attribute is required and primary key', function () {
    it('should return notNull equals undefined', function (done) {
      var notNull = this.nodeDbMigrateSchema.id.notNull;
      expect(notNull).to.be(undefined);
      done();
    });
  });

  describe('attribute has a maximum length', function () {
    it('should return len equals the maximum length', function (done) {
      var len = this.nodeDbMigrateSchema.name.len;
      expect(len).to.be(30);
      done();
    });
  });

  describe('attribute is enum', function () {
    it('should return type based on the type setted in values when is char', function (done) {
      var type = this.nodeDbMigrateSchema.gender.type;
      expect(type).to.be('char');
      done();
    });

    it('should return type based on the type setted in values when is integer', function (done) {
      var type = this.nodeDbMigrateSchema.statusId.type;
      expect(type).to.be('int');
      done();
    });
  });

  describe('attribute is integer', function () {
    it('should return type equals int', function (done) {
      var type = this.nodeDbMigrateSchema.age.type;
      expect(type).to.be('int');
      done();
    });
  });

  describe('attribute is email', function () {
    it('should return type equals string', function (done) {
      var type = this.nodeDbMigrateSchema.email.type;
      expect(type).to.be('string');
      done();
    });
  });

  describe('attribute is float', function () {
    it('should return type equals decimal', function (done) {
      var type = this.nodeDbMigrateSchema.income.type;
      expect(type).to.be('decimal');
      done();
    });
  });

  describe('attribute is date', function () {
    it('should return type equals date', function (done) {
      var type = this.nodeDbMigrateSchema.birthDate.type;
      expect(type).to.be('date');
      done();
    });
  });

  describe('attribute is date-time', function () {
    it('should return type equals timestamp', function (done) {
      var type = this.nodeDbMigrateSchema.createdAt.type;
      expect(type).to.be('timestamp');
      done();
    });
  });

  describe('attribute is boolean', function () {
    it('should return type equals boolean', function (done) {
      var type = this.nodeDbMigrateSchema.active.type;
      expect(type).to.be('boolean');
      done();
    });
  });

  describe('attribute is object', function () {
    it('should return not return the attribute in schema', function (done) {
      var attribute = this.nodeDbMigrateSchema.address;
      expect(attribute).to.be(undefined);
      done();
    });
  });

  describe('attribute is array', function () {
    it('should return not return the attribute in schema', function (done) {
      var attribute = this.nodeDbMigrateSchema.tags;
      expect(attribute).to.be(undefined);
      done();
    });
  });

});