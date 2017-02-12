const { freeze } = require('updeep');

const backup = freeze({
  start: null,
  end: null,
  duration: null,
  server: null,
  remote: {
    files: []
  },
  local: {
    storageDir: process.env.STORAGE_DIR,
    files: []
  }
});

module.exports = backup;
