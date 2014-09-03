#Model structure based on schema

`model-structure` are structure to create your models using a simple JSON schema to:

 * Set a custom repository to create, update, get and delete.
 * Get swagger models
 * Get db-migrate JSON
 * Nested objects support (validations too!)
 * Call validations before create and update or standalone
 * Custom validations async based on schema
 * Customize validation messages, by validation or attribute

***
##Installation
    $ npm install model-structure

##Usage
    var modelStructure = require('model-structure');
    var Model = modelStructure.Model;
    var Lead = (function (ref){

      function Lead(args) {
        ref._init_(this, args);
      }

      Lead.schema = {
        properties: {
          "id" : {
            "type": "integer",
            "primaryKey": true,
            "autoIncrement": true
          },
          "name" : {
            "type": "string",
            "length": {
              "maximum": 30
            }
          },
          "email" : {
            "type": "email",
            "message": "is not a valid email!!",
          },
        }
      }

      return Lead;

    })(Model);

    var data = {name: 'Kurosaki Ichigo', email: 'ichi@soulsociety.com'};
    var lead = new Lead(data);
    lead.create(function(err, leadResponse) {
      // return created lead
    });

###Using Repositories
Model call repository functions passing object in context (this).

    var datas = {};
    // Simple repository to use memory to save data
    var Repository = (function () {
      function Repository() {
        Repository.prototype.create = create;
        Repository.prototype.get = get;
        Repository.prototype.update = update;
        Repository.prototype.destroy = destroy;
      }

      function create(callback) {
        this.id = new Date().getTime();
        datas[this.id] = this;
        if (typeof callback === 'function') callback(null, this);
      }

      function get(args, callback) {
        args = args || {};
        var data = args.data || {};
        if (args.id) {
          data = datas[args.id];
        } else {
          data = [];
          for (var i in datas) data.push(datas[i]);
        }
        callback(null, data);
      }

      function update(callback) {
        datas[this.id] = this;
        if (typeof callback === 'function') callback(null, this);
      }

      function destroy(callback) {
        delete datas[this.id];
        if (typeof callback === 'function') callback(null, this);
      }

      return Repository;

    })();

    var data = {name: 'Kurosaki Ichigo', email: 'ichi@soulsociety.com'};
    data.repository = new Repository();
    var lead = new Lead(data);
    lead.create(function(err, leadResponse) {
      lead.get({id:lead.id}, function (err, secondResponse) {
        // get saved lead;
      });
    });


###Validating models
The validations method is fired before `create` or `update` methods. But you may trigger it directly:

    var data = {name: 'Kurosaki Ichigo', email: 'ichi@soulsociety.com'};
    data.repository = new Repository();
    var lead = new Lead(data);
    lead.isValid(function(err, fields) {

    });

#####Datatypes
Model supports the following datatypes:

 * string
 * char
 * decimal
 * float
 * integer
 * boolean
 * date
 * datetime
 * enum
 * array
 * email
 * nested objects
