class CommandFailedError extends Error {
  constructor(commandName = 'unknown', command = { code: 'unknown' }) {
    super(`Command ${commandName} failed with code: ${command.code}`);

    this.command = command;
  }
}

module.exports = CommandFailedError;
