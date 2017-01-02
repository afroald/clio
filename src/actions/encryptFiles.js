const u = require('updeep');

const exec = require('../exec');
const reducePromises = require('../reducePromises');

async function encryptFile(file, recipient) {
  await exec(`gpg --encrypt --batch --yes --recipient "${recipient}" "${file}"`);

  return `${file}.gpg`;
}

async function encryptFiles(backup) {
  const recipient = process.env.GPG_RECIPIENT;
  const files = backup.local.files;

  if (!recipient) {
    throw new Error('No gpg recipient known. Unable to encrypt files!');
  }

  const encryptedFiles = await reducePromises(files.map(file => async () => encryptFile(file, recipient)));

  return u({
    local: {
      encryptedFiles
    }
  }, backup);
}

module.exports = encryptFiles;
