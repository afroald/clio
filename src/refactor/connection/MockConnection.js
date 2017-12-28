const Connection = require('./Connection');

function MockConnection(implementation = {}) {
  const methods = ['exec', 'getFile', 'putFile', 'createReadStream', 'createWriteStream'];

  methods.forEach((method) => {
    this[method] = function (...args) {
      return implementation[method](...args);
    };
  });

  this.close = function close() {};
}

MockConnection.prototype = Object.create(Connection.prototype);

module.exports = MockConnection;
