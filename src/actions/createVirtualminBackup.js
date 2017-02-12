const path = require('path');
const u = require('updeep');

const action = require('../action');
const execRemoteCommand = require('../execRemoteCommand');

module.exports = u({
  title: 'Create Virtualmin backup',
  action: () => async function createVirtualminBackup(backup, connection) {
    const virtualminBackup = await execRemoteCommand(connection, 'sudo backup-virtualmin');

    const matches = virtualminBackup.stdout.match(/Backup location: "(.*)"/);
    if (!matches || !matches[1]) {
      throw new Error('Could not find backup location');
    }

    const backupPath = matches[1];

    const list = await execRemoteCommand(connection, `ls -1 ${backupPath}`);
    const remoteFiles = list.stdout
      .split('\n')
      .filter(file => file !== '')
      .map(file => path.join(backupPath, file));

    if (remoteFiles.length < 1) {
      throw new Error('No backup files found on remote');
    }

    return u({
      remote: {
        files: files => [].concat(files || [], remoteFiles)
      }
    }, backup);
  }
}, action);
