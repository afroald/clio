/* eslint-disable global-require */

const { freeze } = require('updeep');

const startMutation = require('./startMutation');

module.exports = freeze({
  start: startMutation,
  end: require('./endMutation'),
  addLocalFile: require('./addLocalFileMutation'),
  removeLocalFile: require('./removeLocalFileMutation'),
  addRemoteFile: require('./addRemoteFileMutation'),
  removeRemoteFile: require('./removeRemoteFileMutation'),
  updateActionState: require('./updateActionStateMutation'),
});
