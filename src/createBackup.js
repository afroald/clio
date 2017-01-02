const u = require('updeep');

const backup = require('./backup');

function createBackup(server, options = {}) {
  return u(u({ server }, options), backup);
}

module.exports = createBackup;
