const path = require('path');
const u = require('updeep');

const reducePromises = require('../reducePromises');

async function downloadRemoteFiles(backup, connection, reporter) {
  reporter.taskStart('Downloading files');

  const filesToDownload = backup.remote.files;

  if (!filesToDownload || filesToDownload.length === 0) {
    reporter.taskSkipped('No files to download');
    return backup;
  }

  const downloadOperations = filesToDownload.map(remoteFile => async () => {
    const fileName = path.basename(remoteFile);
    const destinationFile = path.join(backup.local.tmpDir, fileName);

    await connection.getFile(remoteFile, destinationFile);

    return destinationFile;
  });

  const downloadedFiles = await reducePromises(downloadOperations);

  reporter.taskSucceeded();

  return u({
    local: {
      files: files => [].concat(files, downloadedFiles)
    }
  }, backup);
}

module.exports = downloadRemoteFiles;
