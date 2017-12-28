const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const Storage = require('./Storage');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

function FileStorage(root) {
  Object.defineProperty(this, 'root', {
    writable: false,
    value: root,
  });

  /**
   * @param {String} filePath
   * @returns {Promise<Buffer>}
   */
  this.read = function read(filePath) {
    return readFile(path.resolve(root, filePath));
  };

  /**
   * @param {String} filePath
   * @returns {stream.Readable}
   */
  this.createReadStream = function createReadStream(filePath) {
    return fs.createReadStream(path.resolve(root, filePath));
  };

  /**
   * @param {String} filePath
   * @param {Buffer} data
   * @returns {Promise}
   */
  this.write = function write(filePath, data) {
    return writeFile(path.resolve(root, filePath), data, { flag: 'wx' });
  };

  /**
   * @param {String} filePath
   * @returns {stream.Writable}
   */
  this.createWriteStream = function createWriteStream(filePath) {
    return fs.createWriteStream(filePath, { flags: 'wx' });
  };

  /**
   * @param {String} filePath
   * @returns {Promise}
   */
  this.delete = function deleteFile(filePath) {
    return unlink(path.resolve(root, filePath));
  };
}

FileStorage.prototype = Object.create(Storage.prototype);

module.exports = FileStorage;
