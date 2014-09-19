var PromiseRepository;
var Q = require('q');
module.exports = PromiseRepository = (function () {
  function PromiseRepository(args) {
    args = args || {};

    PromiseRepository.prototype.create = create;
    PromiseRepository.prototype.get = get;
    PromiseRepository.prototype.load = load;
    PromiseRepository.prototype.update = update;
    PromiseRepository.prototype.destroy = destroy;
  }

  return PromiseRepository;

})();
var datas = {};
/**
* Initialize
* @param {object} args Description
*/

function create(resolve, reject, notify) {
  this.id = new Date().getTime();
  datas[this.id] = this;
  resolve(this);
}

function load(resolve, reject, notify) {
  var args = this || {};
  var data = args.data || {};
  if (args.id) {
    data = datas[args.id];
  }
  resolve(data);
}

function get(args, resolve, reject, notify) {
  var data = [];
  for (var i in datas) data.push(JSON.parse(JSON.stringify(datas[i])));
  resolve(data);
}

function update(resolve, reject, notify) {
  datas[this.id] = this;
  resolve(this);
}

function destroy(resolve, reject, notify) {
  delete datas[this.id];
  resolve(this);
}
