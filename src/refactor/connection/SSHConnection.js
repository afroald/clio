const SSH = require('node-ssh');
const Connection = require('./Connection');

function SSHConnection(config = {}) {
  const connection = new SSH();
  const ready = connection.connect(config);

  this.exec = async function exec(...args) {
    await ready;
    return connection.exec(...args);
  };

  this.getFile = async function getFile(...args) {
    await ready;
    return connection.getFile(...args);
  };

  this.putFile = async function putFile(...args) {
    await ready;
    return connection.putFile(...args);
  };

  this.deleteFile = async function deleteFile(path) {
    await ready;
    const sftp = await connection.requestSFTP();
    return new Promise((resolve, reject) => {
      sftp.unlink(path, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve();
      });
    });
  };

  this.createReadStream = async function createReadStream(path) {
    await ready;
    const sftp = await connection.requestSFTP();
    return sftp.createReadStream(path);
  };

  this.createWriteStream = async function createWriteStream(path) {
    await ready;
    const sftp = await connection.requestSFTP();
    return sftp.createWriteStream(path);
  };

  this.close = async function close() {
    await ready;
    connection.dispose();
  };
}

SSHConnection.prototype = Object.create(Connection.prototype);

module.exports = SSHConnection;
