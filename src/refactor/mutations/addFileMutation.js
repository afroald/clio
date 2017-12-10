const File = require('../File');

function addFileMutation(backup, target, { file }) {
  if (!(file instanceof File)) {
    throw new Error('File should be an instance of File');
  }

  backup[target].files.push(file);
}

module.exports = addFileMutation;
