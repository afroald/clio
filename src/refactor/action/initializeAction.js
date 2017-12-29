const states = require('./actionStates');

module.exports = function initializeAction(action) {
  return {
    ...action,
    state: states.PENDING,
  };
};
