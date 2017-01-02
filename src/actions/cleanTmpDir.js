const CommandFailedError = require('../errors/CommandFailedError');

async function cleanTmpDir(backup, connection) {
  const tmpDir = backup.remote.tmpDir;

  if (!tmpDir) {
    return backup;
  }

  const command = await connection.execCommand(`rm -rf "${tmpDir}"`);

  if (command.code !== 0) {
    throw new CommandFailedError(cleanTmpDir.name, command);
  }

  return backup;
}

module.exports = cleanTmpDir;
