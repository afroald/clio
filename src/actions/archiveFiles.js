const fs = require('fs');
const exec = require('execa');
const moment = require('moment');
const path = require('path');
const u = require('updeep');

const action = require('../action');

function destinationExists(destination) {
  return new Promise((resolve) => {
    fs.access(destination, (error) => {
      resolve(!error);
    });
  });
}

module.exports = u({
  title: 'Archive files',
  skip: () => backup => !backup.local.encryptedFiles || backup.local.encryptedFiles.length === 0,
  action: () => async function archiveFiles(backup, connection, updater) {
    const serverStorage = path.join(backup.local.storageDir, backup.server.hostname);
    const filesToArchive = backup.local.encryptedFiles;
    const today = moment().format('YYYY-MM-DD');

    let destination = path.join(serverStorage, today);

    if (await destinationExists(destination)) {
      const todayExtended = moment().format('YYYY-MM-DD-HHmmss');
      destination = path.join(serverStorage, todayExtended);
    }

    await exec('mkdir', ['-p', destination]);

    const actions = filesToArchive.map((file) => {
      const filename = path.basename(file);
      const fileDestination = path.join(destination, path.basename(file));

      return u({
        title: `Archiving file ${filename}`,
        action: () => async function archiveFile(backup) {
          await exec('cp', ['-n', file, fileDestination]);

          return u({
            local: {
              archivedFiles: files => [].concat(files || [], [fileDestination])
            }
          }, backup);
        }
      }, action);
    });

    return updater.setSubActions(backup, actions);
  }
}, action);
