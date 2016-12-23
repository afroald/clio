const u = require('updeep');
const CommandFailedError = require('../errors/CommandFailedError');

async function createTmpDir(backup, connection) {
  const tmpDir = backup.server.config.tmpDir;
  const command = await connection.execCommand(`mkdir -p "${tmpDir}"`);

  if (command.code !== 0) {
    throw new CommandFailedError(createTmpDir.name, command);
  }

  return u({
    remote: {
      tmpDir
    }
  }, backup);
}

module.exports = createTmpDir;
