const exec = require('execa');
const u = require('updeep');

async function cleanBackupTmpDir(backup) {
  if (!backup.local.tmpDir) {
    return backup;
  }

  await exec('rm', ['-r', backup.local.tmpDir]);

  return u({
    local: u.omit('tmpDir'),
  }, backup);
}

module.exports = cleanBackupTmpDir;
