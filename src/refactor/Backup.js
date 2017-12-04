const { freeze } = require('updeep');
const Store = require('./Store');

const states = freeze({
  NEW: Symbol('new'),
  RUNNING: Symbol('running'),
  FINISHED: Symbol('finished'),
});

const defaultState = {
  config: {
    gpg: {
      recipient: null,
    },
    paths: {
      storage: null,
      tmp: null,
    },
  },
  state: states.NEW,
  start: null,
  end: null,
  duration: null,
  server: null,
  remote: {
    files: [],
  },
  local: {
    files: [],
  },
};

class Backup extends Store {
  constructor(config = {}) {
    super(Object.assign({}, config, { state: defaultState }));
  }
}

Backup.states = states;

module.exports = Backup;

/*
  const backup = freeze({
    config: {
      gpg: {
        recipient: null,
      },
      paths: {
        storage: null,
        tmp: null,
      },
    },
    start: null,
    end: null,
    duration: null,
    server: null,
    remote: {
      files: [],
    },
    local: {
      files: [],
    },
  });

  Create backup:
  - Add default state
  - Add base config
  - Add server config

  Mutations:
  - start: set start time, update state
  - end: set end time, update state
  - add/remove remote file
  - add/remove local file

  Computed values:
  - duration
 */
