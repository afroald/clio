const { freeze } = require('updeep');

const server = freeze({
  hostname: '',
  config: {
    tmpDir: '/tmp/running-backup',
  },
  actions: [],
});

module.exports = server;
