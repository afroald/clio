const { freeze } = require('updeep');

const states = freeze({
  PENDING: Symbol('pending'),
  RUNNING: Symbol('running'),
  COMPLETED: Symbol('completed'),
  FAILED: Symbol('failed'),
  SKIPPED: Symbol('skipped'),
});

module.exports = states;
