/* eslint-disable no-param-reassign */

const { states: backupStates } = require('../Backup');

function startMutation(backup) {
  backup.start = new Date();
  backup.state = backupStates.RUNNING;
}

module.exports = startMutation;
