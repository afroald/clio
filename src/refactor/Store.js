const { freeze } = require('updeep');
const MutationNotFoundError = require('./errors/MutationNotFoundError');

class Store {
  constructor({ state = {}, mutations = {} } = {}) {
    this.state = freeze(state);
    this.mutations = mutations;
  }

  commit(mutationId, payload) {
    const mutation = this.mutations[mutationId];

    if (!mutation) {
      throw new MutationNotFoundError(`Mutation with id ${mutationId} not found.`);
    }

    const newState = Object.assign({}, this.state);
    mutation(newState, payload);
    this.state = freeze(newState);
  }

  get state() {
    return this.state;
  }

  set state(value) {
    throw new Error('Writing to state directly is not allowed.');
  }
}

module.exports = Store;
