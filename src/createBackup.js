const u = require('updeep');

const backup = u.freeze({
  server: null,
  remote: {
    files: []
  },
  local: {
    tmpDir: process.env.TMP_DIR,
    files: []
  }
});

function createBackup(server, options = {}) {
  return u(Object.assign({ server }, options), backup);
}

module.exports = createBackup;
