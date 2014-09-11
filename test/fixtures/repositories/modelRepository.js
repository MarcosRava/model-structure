var ModelRepository;
module.exports = ModelRepository = (function () {
  function ModelRepository(args) {
    args = args || {};

    ModelRepository.prototype.create = create;
    ModelRepository.prototype.get = get;
    ModelRepository.prototype.load = load;
    ModelRepository.prototype.update = update;
    ModelRepository.prototype.destroy = destroy;
  }

  return ModelRepository;

})();
var datas = {};
/**
* Initialize
* @param {object} args Description
*/

function create(callback) {
  this.id = new Date().getTime();
  datas[this.id] = this;
  if (typeof callback === 'function') callback(null, this);
}

function load(args, callback) {
  args = args || {};
  var data = args.data || {};
  if (args.id) {
    data = datas[args.id];
  }
  callback(null, data);
}

function get(args, callback) {
  var data = [];
  for (var i in datas) data.push(JSON.parse(JSON.stringify(datas[i])));
  callback(null, data);
}

function update(callback) {
  datas[this.id] = this;
  if (typeof callback === 'function') callback(null, this);
}

function destroy(callback) {
  delete datas[this.id];
  if (typeof callback === 'function') callback(null, this);
}
