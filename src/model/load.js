var Q = require('q');

module.exports = function (Model, Repository, initialize) {

  function load() {
    var _this = this;
    var repository = this.access('repository');
    var callback = arguments.length > 1 ? arguments[1] : arguments[0] || function() {};
    var ref = (arguments.length > 0 && arguments[0] !== callback) ? arguments[0] : this;
    var _args = arguments.length > 1 ? arguments[0] : _this;

    var deferred = Q.defer();
    var loadPromise = deferred.promise;
    if (repository.load.length === 3) {
      repository.load.call(ref, deferred.resolve, deferred.reject, deferred.notify);
    } else {
      loadPromise = Q.Promise(function(resolve, reject, notify) {
        repository.load.call(_this, _args, function (err, data) {
          if(err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }
    return loadPromise.fail(function(err) {
      callback(err);
      throw err;
    }).then(function (data) {
      if (!_this.constructor.schema.notInstantiate) {
        data = initialize.call(_this,  data, _this.access('privates'));
      }
      callback(null, data);
      return data;
   });
  }
  return load;
};
