class NotImplementedError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'NotImplementedError';
  }
}

module.exports = NotImplementedError;
