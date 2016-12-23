class CommandFailedError extends Error {
  constructor(commandName, exitCode, stdout, stderr) {
    super(`Command ${commandName} failed with code: ${exitCode}`);

    this.exitCode = exitCode;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

module.exports = CommandFailedError;
