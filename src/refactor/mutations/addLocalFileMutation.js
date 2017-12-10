const addFileMutation = require('./addFileMutation');

function addLocalFileMutation(state, payload) {
  return addFileMutation(state, 'local', payload);
}

module.exports = addLocalFileMutation;
