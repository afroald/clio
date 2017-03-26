const { freeze } = require('updeep');

const backup = freeze({
  config: {
    gpg: {
      recipient: null,
    },
    paths: {
      storage: null,
      tmp: null,
    },
  },
  start: null,
  end: null,
  duration: null,
  server: null,
  remote: {
    files: [],
  },
  local: {
    files: [],
  },
});

module.exports = backup;
