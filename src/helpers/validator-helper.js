var Validator = require('../validator');
var patterns = {
  EMAIL : /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/,
};
exports.getValidation = getValidation;

function getValidation(schema, attr) {
  var messages = schema.messages || {};
  var prop = schema.properties[attr];
  var obj = {type: prop.type};
  obj.messages = schema.properties[attr].messages || {};
  obj.message =  obj.messages.type || messages[obj.type];
  if (prop.length) {
    obj.len = prop.length;
  }
  if (prop.minimum || prop.maximum) {
      obj.min = prop.minimum;
      obj.max = prop.maximum;
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
