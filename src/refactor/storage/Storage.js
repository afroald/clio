/* eslint-disable class-methods-use-this */
const NotImplementedError = require('../errors/NotImplementedError');

class Storage {
  /**
   * @param {String} filePath
   * @returns {Promise<Buffer>}
   */
  read() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} filePath
   * @returns {stream.Readable}
   */
  createReadStream() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} filePath
   * @param {Buffer} data
   * @returns {Promise}
   */
  write() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} filePath
   * @returns {stream.Writable}
   */
  createWriteStream() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} filePath
   * @returns {Promise}
   */
  delete() {
    throw new NotImplementedError();
  }
}

module.exports = Storage;
