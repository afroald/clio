const removeFileMutation = require('./removeFileMutation');

function removeLocalFileMutation(state, payload) {
  return removeFileMutation(state, 'remote', payload);
}

module.exports = removeLocalFileMutation;
