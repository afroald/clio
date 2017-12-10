const removeFileMutation = require('./removeFileMutation');

function removeLocalFileMutation(backup, payload) {
  return removeFileMutation(backup, 'remote', payload);
}

module.exports = removeLocalFileMutation;
