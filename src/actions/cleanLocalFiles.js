const u = require('updeep');

const exec = require('../exec');
const reducePromises = require('../reducePromises');

const possibleFileLists = ['files', 'encryptedFiles'];

async function cleanFile(path) {
  await exec(`rm -f "${path}"`);
  return path;
}

async function cleanLocalFiles(backup, connection, reporter) {
  reporter.onTaskStart('Cleaning local temporary files');

  const filesToClean = possibleFileLists.reduce((files, property) => {
    if (backup.local[property] && backup.local[property] instanceof Array) {
      return [].concat(files, backup.local[property]);
    }

    return files;
  }, []);

  const cleanOperations = filesToClean.map(file => () => cleanFile(file));
  const cleanedFiles = await reducePromises(cleanOperations);

  const updates = { cleanedFiles };
  possibleFileLists.forEach((property) => {
    if (!backup.local[property]) {
      return;
    }

    updates[property] = (files) => {
      return files.filter((file) => {
        return cleanedFiles.indexOf(file) === -1;
      });
    };
  });

  reporter.onTaskEnd();

  return u({ local: updates }, backup);
}

module.exports = cleanLocalFiles;
