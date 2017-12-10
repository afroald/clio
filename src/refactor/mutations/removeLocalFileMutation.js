const removeFileMutation = require('./removeFileMutation');

function removeLocalFileMutation(state, payload) {
  return removeFileMutation(state, 'local', payload);
}

module.exports = removeLocalFileMutation;
