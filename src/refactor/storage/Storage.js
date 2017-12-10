/* eslint-disable class-methods-use-this */
const NotImplementedError = require('../errors/NotImplementedError');

class Storage {
  read() {
    throw new NotImplementedError();
  }

  write() {
    throw new NotImplementedError();
  }

  readStream() {
    throw new NotImplementedError();
  }

  writeStream() {
    throw new NotImplementedError();
  }

  delete() {
    throw new NotImplementedError();
  }
}

module.exports = Storage;
