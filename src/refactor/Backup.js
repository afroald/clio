const { freeze } = require('updeep');
const merge = require('deepmerge');
const path = require('path');
const os = require('os');

const mutations = require('./mutations');
const states = require('./backupStates');
const Store = require('./Store');

const defaultState = freeze({
  config: {
    gpg: {
      recipient: null,
    },
    paths: {
      config: path.resolve('/etc/clio'),
      tmp: os.tmpdir(),
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

function Backup({ server = {}, config = {} } = {}) {
  const store = new Store({
    state: merge.all([
      defaultState,
      { config },
      { server },
    ]),
    mutations,
  });

  this.run = async function run() {
    store.commit('start');
    console.log(this.state);
  };

  Object.defineProperties(this, {
    start: {
      get() {
        return store.start;
      },
    },
    state: {
      get() {
        return store.state;
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
