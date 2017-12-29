const EventEmitter = require('events');

const initializeState = require('./initializeState');
const mutations = require('./mutations');
const pSeries = require('p-series');
const runAction = require('./action/runAction');
const Store = require('./Store');

function Backup({ server = {}, config = {} } = {}) {
  EventEmitter.call(this);

  const store = new Store({
    state: initializeState({ config, server }),
    mutations,
  });

  store.on('commit', (...args) => this.emit('update', ...args));

  this.run = async function run() {
    store.commit('start');

    const actions = store.state.actions;
    await pSeries(actions.map(action => () => runAction(store, action)));

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
