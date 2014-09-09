exports.getSchema = getSchema;
function getSchema(schema) {
  var dbSchema = {};
  var types = {
    "integer" : "int",
    "email" : "string",
    "float" : "decimal",
    "datetime": "timestamp"
  };
  for (var i in schema.properties) {
    var prop = schema.properties[i];
    if (propertyInNotConvertedProperties(prop)) continue;
    dbSchema[i] = {
      type: types[prop.type.trim()] || prop.type,
    };
    if (prop.type === 'enum')
      dbSchema[i].type = types[prop.values.type] || prop.values.type;
    if (prop.length && prop.length.maximum)
      dbSchema[i].len = parseInt(prop.length.maximum);
    if (prop.unique)
      dbSchema[i].unique = prop.unique;
    if (prop.autoIncrement)
      dbSchema[i].autoIncrement = prop.autoIncrement;
    if (prop.primaryKey)
      dbSchema[i].primaryKey = prop.primaryKey;
    if (prop.required && !prop.primaryKey)
      dbSchema[i].notNull = prop.required;
  }
  return dbSchema;

  function propertyInNotConvertedProperties (prop) {
    return prop.type === 'array' || i.indexOf('_') === 0 || prop.type === 'object';
  }
}
