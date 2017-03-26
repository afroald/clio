const u = require('updeep');

const backup = require('./backup');

function createBackup(server, options = {}) {
  return u(u({
    start: new Date(),
    server,
  }, options), backup);
}

module.exports = createBackup;
