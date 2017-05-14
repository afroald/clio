class MutationNotFoundError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'MutationNotFoundError';
  }
}

module.exports = MutationNotFoundError;
