const addFileMutation = require('./addFileMutation');

function addLocalFileMutation(state, payload) {
  return addFileMutation(state, 'remote', payload);
}

module.exports = addLocalFileMutation;
