const path = require('path');
const u = require('updeep');

const exec = require('execa');
const action = require('../action');

module.exports = u({
  title: 'Encrypt files',
  skip: () => backup => !backup.local.files || backup.local.files.length === 0,
  action: () => async function encryptFiles(backup, connection, updater) {
    const filesToEncrypt = backup.local.files;
    const recipient = process.env.GPG_RECIPIENT;

    const actions = filesToEncrypt.map((file) => {
      const filename = path.basename(file);

      return u({
        title: `Encrypting ${filename}`,
        action: () => async function encryptFile(backup) {
          const encryptedFile = `${file}.gpg`;
          await exec.shell(`gpg --encrypt --batch --yes --recipient "${recipient}" "${file}"`);

          return u({
            local: {
              encryptedFiles: files => [].concat(files || [], [encryptedFile])
            }
          }, backup);
        }
      }, action);
    });

    return updater.setSubActions(backup, actions);
  }
}, action);
