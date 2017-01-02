const moment = require('moment');
const path = require('path');
const u = require('updeep');

const exec = require('../exec');
const reducePromises = require('../reducePromises');

async function copyFile(file, destination) {
  await exec(`cp "${file}" "${destination}"`);
  return destination;
}

async function archiveFiles(backup) {
  const filesToArchive = backup.local.encryptedFiles;
  const today = moment().format('YYYY-MM-DD');
  const destination = path.join(backup.local.storageDir, today);

  await exec(`mkdir -p "${destination}"`);

  const copyOperations = filesToArchive.map((file) => {
    const fileDestination = path.join(destination, path.basename(file));
    return async () => copyFile(file, fileDestination);
  });

  const movedFiles = await reducePromises(copyOperations);

  return u({
    local: {
      archivedFiles: movedFiles
    }
  }, backup);
}

module.exports = archiveFiles;
