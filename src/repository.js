var Repository;
module.exports = Repository = (function () {
  function Repository(args) {
    args = args || {};

    Repository.prototype.create = create;
    Repository.prototype.get = get;
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

function get(args, callback) {
  args = args || {};
  var data = args.data || {};
  if (args.id) {
    data = datas[args.id];
  } else {
    data = [];
    for (var i in datas) data.push(datas[i]);
  }
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
