var Validator;
var validate = require('validate.js');
var validateOptions = {fullMessages : false};

module.exports = Validator = (function () {

  function Validator(args) {
    args = args || {};
    validate.validators.model = modelValidator;
    validate.validators.modelList = modelListValidator;
    this.validate = args.validate;
    Validator.prototype.isValid = isValid;
  }

  return Validator;

})();

function isValid(model, callback) {
  if (typeof this.validate === 'function') {
    if (this.validate.length === 1)
      this.validate.call(model, function (err) {
        callback(err);
      });
    else
      callback(this.validate.call(model));
  }
  else {
    var err = validate(model, this.validate, validateOptions);
    callback(err);
  }
}

function modelValidator(value, options, key, attributes) {
  if (!value.access('schema'))  return;
  var errors = validate(value, value.access('schema'), validateOptions);
  var strErr;
  for (var attr in errors) {
    strErr = attr + ' -> ' +  errors[attr].join(', ');
  }
  return strErr;
}

function modelListValidator(values, options, key, attributes) {
  if (!values || values.length === 0) return;
  var errors = [];
  var index = [];
  var j = 0;
  var otherSchema;
  if (typeof options === 'object') {
    otherSchema = options;
  }
  for (var v in values) {
    var value = values[v];
    var err = validate(value, value.access('schema'), validateOptions);
    if (err) {
      errors.unshift(err);
    }
    if (!otherSchema) continue;
    err = validate(value, otherSchema, validateOptions);
    index.unshift(j++);
    if (err) {
      errors.unshift(err);
    }
  }
  var resp;
  for (var i = errors.length - 1 ; i >= 0; i--) {
    resp = resp || '';
    var strErr;
    for (var attr in errors[i]) {
      strErr = errors[i][attr].join(', ');
    }
    var end = ((errors.length > 0  && i !== 0) ? '||' : '');
    resp += key + '[' + index[i] + '].' + attr + '||' + strErr + end;
  }
  return resp;
}
