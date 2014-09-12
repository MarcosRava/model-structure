var model = require('../../../index.js');
var Model = model.Model;

var Phone;

var schema = {
  "messages": {
    "integer": "Integer error message"
  },
  "properties": {
    "id" : {
      "type": "integer",
      "primaryKey": true,
      "autoIncrement": true
    },
    "number" : {
      "type": "integer"
    },
    "areaCode" : {
      "type": "integer"
    }
  }
};

module.exports = Phone = (function () {
  function Phone(args, options) {
    Model.instantiate(this, args, options);
  }
  Model.init(Phone, schema);
  return Phone;
})();

