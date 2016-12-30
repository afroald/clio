const u = require('updeep');

const CommandFailedError = require('../errors/CommandFailedError');
const reducePromises = require('../reducePromises');

async function cleanFile(file, connection) {
  const command = await connection.execCommand(`rm -f ${file}`);

  if (command.code !== 0) {
    throw new CommandFailedError(cleanFile.name, command);
  }

  return file;
}

async function cleanRemoteFiles(backup, connection) {
  const remoteFiles = backup.remote.files;

  const tasks = remoteFiles.map(remoteFile => async () => cleanFile(remoteFile, connection));
  const cleanedFiles = await reducePromises(tasks);

  return u({
    remote: {
      files: (files) => {
        return files.filter((file) => {
          return cleanedFiles.indexOf(file) === -1;
        });
      }
    }
  }, backup);
}

module.exports = cleanRemoteFiles;
