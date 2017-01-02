const u = require('updeep');
const cleanRemoteFiles = require('../actions/cleanRemoteFiles');
const encryptFiles = require('../actions/encryptFiles');
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
    downloadRemoteFiles,
    cleanRemoteFiles,
    encryptFiles,
    // figure out place to put files
    // clean local tmp files
  ]
}, server);

module.exports = vps3;
