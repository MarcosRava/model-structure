exports.defineGetSet = defineGetSet;

var moment = require('moment');

function defineGetSet(schema, attr) {
  var prop = schema.properties[attr];
  switch (prop.type) {
    case "array":
      if (prop.model) {
        defineList.call(this, prop.model.ref, attr);
      }
      break;
    case "date":
      defineDate.call(this, prop, attr);
      break;
    case "enum":
      defineEnum.call(this, prop.values, attr);
      break;
    default:
      break;
  }
}

function defineDate(prop, attr) {
  var matchDate = /^[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/;
  var value;
  var getSet = {
    get: function () {
      return value;
    },
    set: function (val) {
      if (!val) {
        value = null;
        return;
      }
      if (typeof val === 'object' && val.constructor === Date)
        value = moment(val).utc().format('YYYY-MM-DD');
      else if (String(val).match(matchDate))
        value = String(val);
      else value = 'Inválid date';
        //throw new Error("Should be a Date object or string in format yyyy-MM-dd");
    },
    enumerable: true
  };
  if (this.__lookupSetter__(attr)) delete getSet.set;
  if (this.__lookupGetter__(attr)) delete getSet.get;
  Object.defineProperty(this, attr, getSet);
}

function defineEnum(prop, attr) {
  var values = prop.ref;
  var acceptedValues = [];
  var value;
  for (var v in values) acceptedValues.push(values[v]);
  var getSet = {
    get: function () {
      return value;
    },
    set: function (val) {
      if (val && acceptedValues.indexOf(val) === -1) {
        var err = [];
        for (var v in values) err.push(v + ': ' + values[v]);
        throw new Error("Should be " + err.join(', '));
      }
      value = val;
    },
    enumerable: true
  };
  if (this.__lookupSetter__(attr)) delete getSet.set;
  if (this.__lookupGetter__(attr)) delete getSet.get;
  Object.defineProperty(this, attr, getSet);
}

function defineList(ListModel, attr) {
  var value = [];
  var getSet = {
    get: function () {
      return value;
    },
    set: function (val) {
      if (val && !(val instanceof Array)) throw new Error("Should be " + ListModel.name + " array!");

      value = [];
      for (var i in val) {
        value.push(new ListModel(val[i], this));
      }
    },
    enumerable: true
  };
  if (this.__lookupGetter__(attr)) delete getSet.get;
  if (this.__lookupSetter__(attr)) delete getSet.set;
  Object.defineProperty(this, attr, getSet);
}
