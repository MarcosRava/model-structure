exports.getSwaggerProperties = getSwaggerProperties;
exports.getSwagger = getSwagger;

function getSwaggerProperties(schema, attr, model) {
  var swagger = {};
  var prop = schema.properties[attr];
  switch (prop.type) {
    case "array":
      swagger = {type: "array"};
      if (prop.model) {
        swagger.items = {
          $ref : prop.model.ref.name
        };
        model[prop.model.ref.name] = getSwagger(prop.model.ref.schema)[prop.model.ref.name];
      }
      break;
    case "object":
      swagger = {$ref: prop.model.ref.name};
      model[prop.model.ref.name] = getSwagger(prop.model.ref.schema)[prop.model.ref.name];
      break;
    case "decimal":
    case "float":
      swagger.type = 'number';
      swagger.format = 'float';
      break;
    case "date":
    case "datetime":
      swagger.type = 'string';
      swagger.format = prop.type;
      break;
    case "char":
      swagger.type = 'string';
      swagger.format = 'byte';
      break;
    case "email":
      swagger.type = 'string';
      break;
    case "enum":
      swagger.type = prop.values.type;
      swagger.enum = [];
      for (var i in prop.values.ref) swagger.enum.push( i + ": " + prop.values.ref[i]);
      break;
    default:
      swagger.type = prop.type;
      break;
  }
  if (prop.length) {
    swagger.length = {
      minimum: String(prop.length.minimum),
      maximum: String(prop.length.maximum)
    };
  }
  return swagger;
}

function getSwagger(schema) {
  var swagger = {};
  var model = {};
  var properties = {};
  swagger.id = schema.name;
  for (var i in schema.properties) {
    var prop = schema.properties[i];
    properties[i] = getSwaggerProperties(schema, i, model);
    if (!properties[i]) delete properties[i];
    if (prop.required) {
      swagger.required  = swagger.required || [];
      swagger.required.push(i);
    }
  }

  swagger.properties = properties;
  model[schema.name] = swagger;
  return model;
}
