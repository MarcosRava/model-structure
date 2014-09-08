var Validator = require('../validator');
var patterns = {
  EMAIL : /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/,
};
exports.getValidation = getValidation;

function getValidation(schema, attr) {
  var messages = schema.messages || {};
  var prop = schema.properties[attr];
  var obj = {type: prop.type};
  obj.message = schema.properties[attr].message || messages[obj.type];
  if (prop.length) {
    if (typeof prop.length === 'object') {
      //obj.min = obj.length.tooShort || (messages.length ? messages.length.tooShort : "");
      //obj.max = obj.length.tooLong || (messages.length ? messages.length.tooLong : "");
      obj.min = prop.length.minimum;
      obj.max = prop.length.maximum;
    }
    else {
      obj.len = prop.length;
    }

  }
  var msg;
  switch (prop.type) {
    case "enum":
      if (prop.values.ref.constructor === Array) {
        obj.enum = prop.values.ref;
      }
      else {
        var refs = [];
        for(var e in  prop.values.ref) {
          refs.push(prop.values.ref[e]);
        }
        obj.enum = refs;
      }
      break;
    case "string":
      break;
    case "char":
      obj.type = "string";
      obj.len = 1;
      break;
    case "email":
      obj.type = "string";
      obj.pattern = patterns.EMAIL;
      break;
    case "integer":
      obj.required = false;
      break;
    case "datetime":
      obj.type = 'date';
      //obj.format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
      break;
    case "decimal":
    case "float":
      obj.type = "number";
      break;
    case "object":
      obj.type = "nested";
      break;
    case "array":
      if (prop.model) {
        obj.modelList =true;
        obj.type = "arrayModel";
      }
      break;
    default:
      break;
  }
  return obj;
}
