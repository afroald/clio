const { freeze } = require('updeep');
const MutationNotFoundError = require('./errors/MutationNotFoundError');

function Store({ state = {}, mutations = {} } = {}) {
  this.state = freeze(state);

  this.commit = function commit(mutationId, payload) {
    const mutation = mutations[mutationId];

    if (!mutation) {
      throw new MutationNotFoundError(`Mutation with id ${mutationId} not found.`);
    }

    const newState = Object.assign({}, this.state);
    mutation(newState, payload);
    this.state = freeze(newState);
  };
}

module.exports = Store;
