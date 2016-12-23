/* eslint-env node, jest */

const CommandFailedError = require('../CommandFailedError');

describe('CommandFailedError', () => {
  it('should be an instance of `Error`', () => {
    const error = new CommandFailedError();
    expect(error).toBeInstanceOf(Error);
  });

  it('should set a message', () => {
    const error = new CommandFailedError();
    expect(error).toEqual(expect.objectContaining({
      message: expect.stringMatching(/Command .* failed .*/)
    }));
  });

  it('should have `exitCode`, `stdout` and `stderr`', () => {
    const error = new CommandFailedError('commandName', 'exitCode', 'stdout', 'stderr');

    expect(error.exitCode).toBe('exitCode');
    expect(error.stdout).toBe('stdout');
    expect(error.stderr).toBe('stderr');
  });
});
