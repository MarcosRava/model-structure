var Validator = require('../validator');

exports.getValidation = getValidation;

function getValidation(schema, attr) {
  var messages = schema.messages || {};
  var prop = schema.properties[attr];
  var obj = {};
  //var messages = validatorMessages[schema.name] ? validatorMessages[schema.name][attr] : {};
  if (prop.length) {
    obj.length = prop.length;
    obj.length.tooShort = obj.length.tooShort || (messages.length ? messages.length.tooShort : "");
    obj.length.tooLong = obj.length.tooLong || (messages.length ? messages.length.tooLong : "");

  }
  var msg;
  switch (prop.type) {
    case "string":
      break;
    case "email":
      msg = (prop.message || messages.email);
      obj.email = msg ? {message: msg} : true;
      break;
    case "integer":
      obj.numericality = {
        onlyInteger: true,
        message: prop.message || messages.integer
      };
      break;
    case "decimal":
    case "float":
      msg = (prop.message || messages.numericality);
      obj.numericality = msg ? {message: msg} : true;
      break;
    case "array":
      if (prop.model)
        obj.modelList = true;
      break;
    default:
      break;
  }
  return obj;
}
