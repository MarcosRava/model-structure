var Q = require('q');

module.exports = function (Model, Repository, initialize) {

  function get() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    var _this = this;
    var Ref = this;
    var repArgs = args.length === 0 ? undefined : args[0].repository;
    var repository = repArgs || Ref.repository || Model.repository || new Repository();

    // last argument is the callback function.
    var callback = args.pop() || function(){};
    var getPromise;

    if (repository.get.length === 3) {
      var deferred = Q.defer();
      repository.get.call(_this, deferred.resolve, deferred.reject, deferred.notify);
      getPromise = deferred.promise;
    } else {
      getPromise = Q.Promise(function(resolve, reject, notify) {
        repository.get.call(_this, (args.length > 1 ? args[0] : null), function (err, data) {
          if(err) {
            reject(err);
          } else {
            resolve(data);
          }
        }
       );
      });
    }
    return getPromise.fail(function(err) {
      callback(err);
      throw err;
    }).then(function (data) {
      if (data && data.constructor === Array) {
        if (!Ref.schema.notInstantiate) {
          for(var i in data) {
            data[i].repository = repository;
            data[i] = new Ref(data[i]);
          }
        }
      } else
      {
          throw new Error("Response should be an Array");
      }
      callback(null, data);
      return data;
   });
  }
  return get;
};
