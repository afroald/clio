/**
 * This is an example server config that will backup a Gitlab instance
 */
const u = require('updeep');

const archiveFiles = require('../src/actions/archiveFiles');
const cleanLocalFiles = require('../src/actions/cleanLocalFiles');
const cleanRemoteFiles = require('../src/actions/cleanRemoteFiles');
const encryptFiles = require('../src/actions/encryptFiles');
const downloadRemoteFiles = require('../src/actions/downloadRemoteFiles');
const runGitlabBackup = require('../src/actions/runGitlabBackup');
const server = require('../src/server');

const exampleServer = u({
  hostname: 'example',
  ssh: {
    host: process.env.EXAMPLE_HOST,
    username: process.env.EXAMPLE_USERNAME,
    privateKey: process.env.EXAMPLE_PRIVATE_KEY
  },
  actions: [
    runGitlabBackup,
    downloadRemoteFiles,
    cleanRemoteFiles,
    encryptFiles,
    archiveFiles,
    cleanLocalFiles
  ]
}, server);

module.exports = exampleServer;
