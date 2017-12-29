const { diff } = require('deep-object-diff');
const { freeze } = require('updeep');
const merge = require('deepmerge');
const EventEmitter = require('events');
const MutationNotFoundError = require('./errors/MutationNotFoundError');

function Store({ state: initialState = {}, mutations = {} } = {}) {
  const emitter = this;
  EventEmitter.call(this);

  const states = [];

  function pushState(state, { silent = false } = {}) {
    states.push(freeze(state));

    if (!silent) {
      emitter.emit('commit', state, diff(states[states.length - 2], state));
    }
  }

  Object.defineProperties(this, {
    commit: {
      value: function commit(mutationId, payload = {}) {
        const mutation = mutations[mutationId];

        if (!mutation) {
          throw new MutationNotFoundError(`Mutation with id ${mutationId} not found.`);
        }

        const newState = merge({}, this.state);
        mutation(newState, payload);

        pushState(newState);
      },
    },

    state: {
      get() {
        if (states.length === 0) {
          return null;
        }

        return states[states.length - 1];
      },
    },
  });

  pushState(initialState, { silent: true });

  return new Proxy(this, {
    get(target, property) {
      if (!target[property]) {
        return target.state[property];
      }

      return target[property];
    },
  });
}

Object.assign(Store.prototype, EventEmitter.prototype);

module.exports = Store;
