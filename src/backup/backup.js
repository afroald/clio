const { freeze } = require('updeep');

const backup = freeze({
  start: null,
  end: null,
  duration: null,
  server: null,
  remote: {
    files: [],
  },
  local: {
    storageDir: null,
    files: [],
  },
});

module.exports = backup;
