const EventEmitter = require('events');

const actionStates = require('./action/actionStates');
const initializeState = require('./initializeState');
const mutations = require('./mutations');
const Store = require('./Store');

function Backup({ server = {}, config = {} } = {}) {
  EventEmitter.call(this);

  const store = new Store({
    state: initializeState({ config, server }),
    mutations,
  });

  store.on('commit', (...args) => this.emit('commit', ...args));

  this.run = async function run() {
    store.commit('start');

    await Promise.all(store.state.actions.map(async (action) => {
      store.commit('updateActionState', { action, state: actionStates.RUNNING });

      if (await action.skip(store.state)) {
        store.commit('updateActionState', { action, state: actionStates.SKIPPED });
        return;
      }

      try {
        await action.action(store);
        store.commit('updateActionState', { action, state: actionStates.COMPLETED });
      } catch (error) {
        store.commit('updateActionState', { action, state: actionStates.FAILED, error });
      }
    }));

    store.commit('end');
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

Object.assign(Backup.prototype, EventEmitter.prototype);

module.exports = Backup;
