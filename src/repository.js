var Repository;
module.exports = Repository = (function () {
  function Repository(args) {
    args = args || {};

    Repository.prototype.create = create;
    Repository.prototype.get = get;
    Repository.prototype.load = load;
    Repository.prototype.update = update;
    Repository.prototype.destroy = destroy;
  }

  return Repository;

})();

var datas = {};

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
