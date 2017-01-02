const fs = require('fs');
const moment = require('moment');
const path = require('path');
const u = require('updeep');

const exec = require('../exec');
const reducePromises = require('../reducePromises');

function destinationExists(destination) {
  return new Promise((resolve) => {
    fs.access(destination, (error) => {
      resolve(!error);
    });
  });
}

async function copyFile(file, destination) {
  await exec(`cp -n "${file}" "${destination}"`);
  return destination;
}

async function archiveFiles(backup, connection, reporter) {
  reporter.onTaskStart('Archiving files');

  const filesToArchive = backup.local.encryptedFiles;
  const today = moment().format('YYYY-MM-DD');
  let destination = path.join(backup.local.storageDir, today);

  if (await destinationExists(destination)) {
    const todayExtended = moment().format('YYYY-MM-DD-HHmmss');
    destination = path.join(backup.local.storageDir, todayExtended);
  }

  await exec(`mkdir -p "${destination}"`);

  const copyOperations = filesToArchive.map((file) => {
    const fileDestination = path.join(destination, path.basename(file));
    return () => copyFile(file, fileDestination);
  });

  const movedFiles = await reducePromises(copyOperations);

  reporter.onTaskEnd();

  return u({
    local: {
      archivedFiles: movedFiles
    }
  }, backup);
}

module.exports = archiveFiles;
