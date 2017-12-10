/* eslint-disable no-param-reassign */

const states = require('../backupStates');

function startMutation(state) {
  state.start = new Date();
  state.state = states.RUNNING;
}

module.exports = startMutation;
