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
}

module.exports = Store;
