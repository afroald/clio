const File = require('../File');

function addFileMutation(state, target, { file }) {
  if (!(file instanceof File)) {
    throw new Error('File should be an instance of File');
  }

  state[target].files.push(file);
}

module.exports = addFileMutation;
