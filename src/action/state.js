const { freeze } = require('updeep');

const state = freeze({
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  SKIPPED: 3
});

module.exports = state;
