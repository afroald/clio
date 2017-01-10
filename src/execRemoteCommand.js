const CommandFailedError = require('./errors/CommandFailedError');

async function execRemoteCommand(connection, command) {
  const result = await connection.execCommand(command);

  if (result.code !== 0) {
    throw new CommandFailedError(command, result);
  }

  return result;
}

module.exports = execRemoteCommand;
