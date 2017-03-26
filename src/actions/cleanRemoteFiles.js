const path = require('path');
const u = require('updeep');

const action = require('../action');
const execRemoteCommand = require('../execRemoteCommand');

module.exports = u({
  title: 'Clean remote files',
  skip: () => backup => !backup.remote.files || backup.remote.files.length === 0,
  action: () => async function cleanRemoteFiles(backup, connection, updater) {
    const filesToClean = backup.remote.files;

    const actions = filesToClean.map((remoteFile) => {
      const filename = path.basename(remoteFile);

      return u({
        title: `Cleaning ${filename}`,
        action: () => async function cleanFile(backup, connection) {
          await execRemoteCommand(connection, `rm -f "${remoteFile}"`);

          return u({
            remote: {
              cleanedFiles: files => [].concat(files || [], remoteFile),
              files: files => files.filter(file => file !== remoteFile),
            },
          }, backup);
        },
      }, action);
    });

    return updater.setSubActions(backup, actions);
  },
}, action);
