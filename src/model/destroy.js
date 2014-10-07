var Q = require('q');

module.exports = function (Model, Repository, initialize) {

  function destroy(callback) {
    callback = callback || function(){};
    var _this = this;
    var repository = this.access('repository');
    var deletePromise;
    if (repository.update.length === 3) {
      var deferred = Q.defer();
      repository.destroy.call(_this, deferred.resolve, deferred.reject, deferred.notify);
      deletePromise = deferred.promise;
    } else {
      deletePromise = Q.Promise(function(resolve, reject, notify) {
        repository.destroy.call(_this, function (err, data) {
          if(err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
       );
      });
    }
    return deletePromise.fail(function(err) {
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
  return destroy;
};
