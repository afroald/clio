/* eslint-disable no-param-reassign */

const { states: backupStates } = require('../Backup');

function endMutation(backup) {
  backup.end = new Date();
  backup.state = backupStates.FINISHED;
}

module.exports = endMutation;
