const u = require('updeep');
const downloadRemoteFiles = require('../actions/downloadRemoteFiles');
const runGitlabBackup = require('../actions/runGitlabBackup');
const server = require('./server');

const vps3 = u({
  hostname: 'vps3',
  ssh: {
    host: process.env.VPS3_HOST,
    username: process.env.VPS3_USERNAME,
    privateKey: process.env.VPS3_PRIVATE_KEY
  },
  actions: [
    runGitlabBackup,
    downloadRemoteFiles
  ]
}, server);

module.exports = vps3;
