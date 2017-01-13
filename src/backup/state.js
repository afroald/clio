const { freeze } = require('updeep');

const state = freeze({
  CONNECTING: 0,
  PENDING: 1,
  FAILED: 2,
  COMPLETED: 3
});

module.exports = state;
