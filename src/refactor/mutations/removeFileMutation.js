const File = require('../File');

function removeLocalFileMutation(backup, target, { file }) {
  if (!(file instanceof File)) {
    throw new Error('File should be an instance of File');
  }

  const index = backup.local.files.indexOf(file);

  if (index === -1) {
    return;
  }

  backup[target].files.splice(index, 1);
}

module.exports = removeLocalFileMutation;
