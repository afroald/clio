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
    tmpDir: process.env.TMP_DIR,
    storageDir: process.env.STORAGE_DIR,
    files: []
  }
});

module.exports = backup;
