const u = require('updeep');

const backup = u.freeze({
  server: null,
  remote: {},
  local: {}
});

function createBackup(server, options = {}) {
  return u(Object.assign({ server }, options), backup);
}

module.exports = createBackup;
