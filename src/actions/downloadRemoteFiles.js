const path = require('path');
const u = require('updeep');

const action = require('../action');

module.exports = u({
  title: 'Download remote files',
  skip: () => backup => !backup.remote.files || backup.remote.files.length === 0,
  action: () => async function downloadRemoteFiles(backup, connection, updater) {
    const filesToDownload = backup.remote.files;

    const actions = filesToDownload.map((remoteFile) => {
      const fileName = path.basename(remoteFile);
      const destinationFile = path.join(backup.local.tmpDir, fileName);

      return u({
        title: `Downloading ${fileName}`,
        action: () => async function downloadFile(backup, connection) {
          await connection.getFile(remoteFile, destinationFile);

          return u({
            local: {
              files: files => [].concat(files, [destinationFile])
            }
          }, backup);
        }
      }, action);
    });

    return updater.setSubActions(backup, actions);
  }
}, action);
