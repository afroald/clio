const addFileMutation = require('./addFileMutation');

function addLocalFileMutation(backup, payload) {
  return addFileMutation(backup, 'remote', payload);
}

module.exports = addLocalFileMutation;
