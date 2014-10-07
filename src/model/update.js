var Q = require('q');

module.exports = function (Model, Repository, initialize) {

  function update(callback) {
  callback = callback || function(){};
    var repository = this.access('repository');
    var _this = this;
    var validationPromise = this.isValid();
    var updatePromise;
    return validationPromise
    .fail(function (err) {
      callback(err);
      throw err;
    })
    .then(function () {
      if (repository.update.length === 3) {
        var deferred = Q.defer();
        repository.update.call(_this, deferred.resolve, deferred.reject, deferred.notify);
        updatePromise = deferred.promise;
      } else {
        updatePromise = Q.Promise(function(resolve, reject, notify) {
          repository.update.call(_this, function (err, data) {
            if(err) {
              reject(err);
            } else {
              resolve(data);
            }
            callback(err, data);
          }
         );
        });
      }
      return updatePromise;
    });
  }
  return update;
};
