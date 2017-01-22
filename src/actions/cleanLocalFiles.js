const exec = require('execa');
const path = require('path');
const u = require('updeep');

const action = require('../action');

module.exports = u({
  title: 'Clean local files',
  skip: () => backup => ['files', 'encryptedFiles'].every(list => !backup.local[list] || backup.local[list].length === 0),
  action: () => async function cleanLocalFiles(backup, connection, updater) {
    const filesToClean = [].concat(backup.local.files || [], backup.local.encryptedFiles || []);

    const actions = filesToClean.map((file) => {
      const filename = path.basename(file);

      return u({
        title: `Cleaning ${filename}`,
        action: () => async function cleanFile(backup) {
          await exec('rm', ['-f', file]);

          return u({
            local: {
              files: files => files.filter(listedFile => listedFile !== file),
              encryptedFiles: files => files.filter(listedFile => listedFile !== file)
            }
          }, backup);
        }
      }, action);
    });

    return updater.setSubActions(backup, actions);
  }
}, action);
