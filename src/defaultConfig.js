const { freeze } = require('updeep');
const path = require('path');

const config = freeze({
  paths: {
    config: path.resolve('/etc/clio'),
    tmp: path.resolve('/tmp'),
    storage: path.resolve('/var/backups'),
  },
  gpg: {
    recipient: null,
  },
});

module.exports = config;
