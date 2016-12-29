const path = require('path');
const u = require('updeep');

const CommandFailedError = require('../errors/CommandFailedError');
const createTmpDir = require('../actions/createTmpDir');
const cleanTmpDir = require('../actions/cleanTmpDir');
const server = require('./server');

const gitlabBackupPath = '/var/opt/gitlab/backups';

async function runGitlabBackup(backup, connection) {
  const command = await connection.execCommand('sudo gitlab-rake gitlab:backup:create');

  if (command.code !== 0) {
    throw new CommandFailedError(runGitlabBackup.name, command);
  }

  const backupFileName = command.stdout.match(/^Creating backup archive: (.*\.tar) \.\.\. done$/m)[1];

  return u({
    remote: {
      actions: {
        [runGitlabBackup.name]: command
      },
      files: [
        path.join(gitlabBackupPath, backupFileName)
      ]
    }
  }, backup);
}

const vps3 = Object.assign(server, {
  hostname: 'vps3',
  ssh: {
    host: process.env.VPS3_HOST,
    username: process.env.VPS3_USERNAME,
    privateKey: process.env.VPS3_PRIVATE_KEY
  },
  actions: [
    createTmpDir,
    runGitlabBackup,
    cleanTmpDir
  ]
});

module.exports = vps3;
