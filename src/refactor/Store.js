const { freeze } = require('updeep');
const MutationNotFoundError = require('./errors/MutationNotFoundError');

function Store({ state: initialState = {}, mutations = {} } = {}) {
  const states = [];

  function pushState(state) {
    states.push(freeze(state));
  }

  Object.defineProperties(this, {
    commit: {
      value: function commit(mutationId, payload = {}) {
        const mutation = mutations[mutationId];

        if (!mutation) {
          throw new MutationNotFoundError(`Mutation with id ${mutationId} not found.`);
        }

        const newState = Object.assign({}, this.state);
        mutation(newState, payload);
        pushState(newState);
      },
    },

    state: {
      get() {
        return states[states.length - 1];
      },
    },
  });

  pushState(initialState);

  return new Proxy(this, {
    get(target, property) {
      if (!target[property]) {
        return target.state[property];
      }

      return target[property];
    },
  });
}

module.exports = Store;
