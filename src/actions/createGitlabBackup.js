const path = require('path');
const u = require('updeep');

const execRemoteCommand = require('../execRemoteCommand');
const action = require('../action');

const gitlabBackupPath = '/var/opt/gitlab/backups';

module.exports = u({
  title: 'Create Gitlab Backup',
  action: () => async function createGitlabBackup(backup, connection) {
    const command = await execRemoteCommand(connection, 'sudo gitlab-rake gitlab:backup:create');

    const matches = command.stdout.match(/^Creating backup archive: (.*\.tar) \.\.\. done$/m);
    if (!matches[1]) {
      throw new Error('Could not find backup name in output');
    }
    const backupFileName = matches[1];

    return u({
      remote: {
        files: files => [].concat(files, [
          path.join(gitlabBackupPath, backupFileName)
        ])
      }
    }, backup);
  }
}, action);
