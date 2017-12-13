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

  this.read = function read(filePath) {
    return readFile(path.resolve(root, filePath));
  };

  this.readStream = function readStream(filePath) {
    return fs.createReadStream(path.resolve(root, filePath));
  };

  this.write = function write(filePath, data) {
    return writeFile(path.resolve(root, filePath), data, { flag: 'wx' });
  };

  this.writeStream = function writeStream(filePath) {
    return fs.createWriteStream(filePath, { flags: 'wx' });
  };

  this.delete = function deleteFile(filePath) {
    return unlink(path.resolve(root, filePath));
  };
}

FileStorage.prototype = Object.create(Storage.prototype);

module.exports = FileStorage;
