const File = require('../File');

function removeLocalFileMutation(state, target, { file }) {
  if (!(file instanceof File)) {
    throw new Error('File should be an instance of File');
  }

  const index = state.local.files.indexOf(file);

  if (index === -1) {
    return;
  }

  state[target].files.splice(index, 1);
}

module.exports = removeLocalFileMutation;
