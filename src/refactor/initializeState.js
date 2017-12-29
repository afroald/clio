const { freeze } = require('updeep');
const merge = require('deepmerge');
const path = require('path');
const os = require('os');

const initializeAction = require('./action/initializeAction');
const states = require('./backupStates');
const testAction = require('./actions/testAction');

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
  server: null,
  state: states.NEW,
  start: null,
  end: null,
  duration: null,
  actions: [],
  remote: {
    files: [],
  },
  local: {
    files: [],
  },
});

const preActions = [testAction];
const postActions = [];

module.exports = function initializeState({ config, server }) {
  return merge.all([
    defaultState,
    { config },
    { server },
    { actions: [].concat(preActions, server.actions, postActions).map(initializeAction) },
  ]);
};
