const fs = require('fs');
const path = require('path');
const u = require('updeep');

function createTmpDir(prefix) {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(prefix, (error, dir) => {
      if (error) {
        reject(error);
      }

      resolve(dir);
    });
  });
}

async function createBackupTmpDir(backup) {
  const tmpDir = process.env.TMP_DIR || '/tmp';
  const backupTmpDir = await createTmpDir(path.join(tmpDir, 'clio-backup.'));

  return u({
    local: {
      tmpDir: backupTmpDir,
    },
  }, backup);
}

module.exports = createBackupTmpDir;
