var Q = require('q');

module.exports = function (Model, Repository, initialize) {

  function create(callback) {
    callback = callback || function(){};
    var repository = this.access('repository');
    var _this = this;
    var validationPromise = this.isValid();
    var createPromise;
    return validationPromise
    .fail(function (err) {
      callback(err);
      throw err;
    })
    .then(function () {
      if (repository.create.length === 3) {
        var deferred = Q.defer();
        repository.create.call(_this, deferred.resolve, deferred.reject, deferred.notify);
        createPromise = deferred.promise;
      } else {
        createPromise = Q.Promise(function(resolve, reject, notify) {
          repository.create.call(_this, function (err, data) {
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
      return createPromise;
    });
  }
  return create;
};
