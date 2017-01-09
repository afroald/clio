const u = require('updeep');

const server = u.freeze({
  hostname: '',
  config: {
    tmpDir: '/tmp/running-backup'
  },
  actions: []
});

module.exports = server;
