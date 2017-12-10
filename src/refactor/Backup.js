const { freeze } = require('updeep');
const states = require('./backupStates');
const mutations = require('./mutations');
const Store = require('./Store');

const defaultState = freeze({
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
});

function Backup({ server, config }) {
  const state = new Store({
    state: {
      ...defaultState,
      ...config,
      server,
    },
    mutations,
  });

  this.run = async function run() {
    state.commit('start');
    // console.log(state);
  };

  Object.defineProperties(this, {
    start: {
      get() {
        return state.start;
      },
    },
    state: {
      get() {
        return state.state;
      },
    },
  });
}

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
