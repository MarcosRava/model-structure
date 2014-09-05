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
      "required": true,
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

module.exports = Phone = (function (_super) {
  function Phone(args) {
    _super._init_(this, args);
  }
  Phone.schema = schema;
  return Phone;
})(Model);

