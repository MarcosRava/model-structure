var model = require('../index.js');
var Model = model.Model;

var Customer = (function (_super) {
  function Customer(args) {
    _super._init_(this, args);
  }
  Customer.schema = {
    messages: {
      integer: "Generic validation message"
    },
    properties: {
      id : {
        type: 'integer',
        required: true,
        primaryKey: true,
        autoIncrement: true
      },
      name : {
        type: 'string',
        length: {
          minimum: 3,
          maximum: 30
        }
      },
      email : {
        type: 'email',
        message: 'is not a valid email!!',
        length: {
          minimum: 7,
          tooShort: "Short email (custom attribute message)"
        }
      },
      age : {
        type: 'integer'
      },
      hands : {
        type: 'integer'
      }
    }
  };
  return Customer;
})(Model);
var customer = new Customer({name: "Marcos"});
customer.create(function (err, data) {
  console.log(data);
  data.name = "Marcos Rava";
  data.update(function (err, data2) {
    console.log(data2);
    data2.name = "M";
    data2.email = "md.br";
    data2.age = "m@d.br";
    data2.hands = "m@d.br";
    data2.update(function (err, data) {
      console.log(err);
    });
  });

});
//console.log(JSON.stringify(customer.access('swagger'), null, 1));
//console.log(JSON.stringify(customer.access('db-migrate'), null, 1));

