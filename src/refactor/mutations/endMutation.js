/* eslint-disable no-param-reassign */

const states = require('../backupStates');

function endMutation(state) {
  state.end = new Date();
  state.state = states.FINISHED;
}

module.exports = endMutation;
