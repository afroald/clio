const File = require('../File');

function addLocalFileMutation(backup, { file }) {
  if (!(file instanceof File)) {
    throw new Error('File should be an instance of File');
  }

  backup.local.files.push(file);
}

module.exports = addLocalFileMutation;
