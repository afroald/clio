/* eslint-disable class-methods-use-this */
const NotImplementedError = require('../errors/NotImplementedError');

class Connection {
  /**
   * @param {String} command
   * @param {Array<String>} parameters
   * @returns {Promise}
   */
  exec() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} localPath
   * @param {String} remotePath
   * @returns {Promise}
   */
  getFile() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} localPath
   * @param {String} remotePath
   * @returns {Promise}
   */
  putFile() {
    throw new NotImplementedError();
  }

  /**
   * @param remotePath
   * @returns {Promise}
   */
  deleteFile() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} path
   * @returns {stream.Readable}
   */
  createReadStream() {
    throw new NotImplementedError();
  }

  /**
   * @param {String} path
   * @returns {stream.Writable}
   */
  createWriteStream() {
    throw new NotImplementedError();
  }

  /**
   * @returns {Promise}
   */
  close() {
    throw new NotImplementedError();
  }
}

module.exports = Connection;
