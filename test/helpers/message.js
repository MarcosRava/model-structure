var Message = (function () {
  return {
    errorExpected: function errorExpected(attribute, dataType, value) {
      return attribute + ' ' + dataType + ' ' + value + ' is invalid';
    }
  };
})();

module.exports = Message;