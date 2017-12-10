const { freeze } = require('updeep');

const states = freeze({
  NEW: Symbol('new'),
  RUNNING: Symbol('running'),
  FINISHED: Symbol('finished'),
});

module.exports = states;
