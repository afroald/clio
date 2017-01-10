const u = require('updeep');

const execRemoteCommand = require('../execRemoteCommand');
const reducePromises = require('../reducePromises');

async function cleanFile(file, connection) {
  await execRemoteCommand(connection, `rm -f "${file}"`);

  return file;
}

async function cleanRemoteFiles(backup, connection, reporter) {
  reporter.taskStart('Cleaning remote files');

  const remoteFiles = backup.remote.files;

  if (!remoteFiles || remoteFiles.length === 0) {
    reporter.taskSkipped('No remote files to clean');
    return backup;
  }

  const tasks = remoteFiles.map(remoteFile => () => cleanFile(remoteFile, connection));
  const cleanedFiles = await reducePromises(tasks);

  reporter.taskSucceeded();

  return u({
    remote: {
      cleanedFiles,
      files: (files) => {
        return files.filter((file) => {
          return cleanedFiles.indexOf(file) === -1;
        });
      }
    }
  }, backup);
}

module.exports = cleanRemoteFiles;
