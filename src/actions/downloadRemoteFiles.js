const path = require('path');
const u = require('updeep');

const CommandFailedError = require('../errors/CommandFailedError');

async function downloadRemoteFiles(backup, connection) {
  const downloadedFiles = [];

  await Promise.all(backup.remote.files.map((remoteFile) => {
    return (async () => {
      const fileName = path.basename(remoteFile);
      const localPath = path.join(backup.local.tmpDir, fileName);

      await connection.getFile(remoteFile, localPath);

      downloadedFiles.push(localPath);
    })();
  }));

  return u({
    local: {
      files: files => [].concat(files, downloadedFiles)
    }
  }, backup);
}

module.exports = downloadRemoteFiles;
