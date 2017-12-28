const { ReadableStreamBuffer } = require('stream-buffers');
const streamToArray = require('stream-to-array');

const Connection = require('../connection/Connection');
const Storage = require('./Storage');

function RemoteStorage(connection) {
  if (!(connection instanceof Connection)) {
    throw new Error('Please pass an instance of Connection');
  }

  /**
   * @param {String} filePath
   * @returns {Promise<Buffer>}
   */
  this.read = async function read(filePath) {
    const readStream = await connection.createReadStream(filePath);
    return Buffer.concat(await streamToArray(readStream));
  };

  /**
   * @param {String} filePath
   * @returns {Promise<stream.Readable>}
   */
  this.createReadStream = function createReadStream(filePath) {
    return connection.createReadStream(filePath);
  };

  /**
   * @param {String} filePath
   * @param {Buffer} data
   * @returns {Promise}
   */
  this.write = async function write(filePath, data) {
    const writeStream = await connection.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      writeStream.on('error', reject);

      const readStream = new ReadableStreamBuffer();
      readStream.pipe(writeStream);
      readStream.put(data);
      readStream.stop();
      readStream.on('end', resolve);
    });
  };

  /**
   * @param {String} filePath
   * @returns {Promise<stream.Writable>}
   */
  this.createWriteStream = function createWriteStream(filePath) {
    return connection.createWriteStream(filePath);
  };

  /**
   * @param {String} filePath
   * @returns {Promise}
   */
  this.delete = function deleteFile(filePath) {
    return connection.deleteFile(filePath);
  };
}

RemoteStorage.prototype = Object.create(Storage.prototype);

module.exports = RemoteStorage;
