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
      message: expect.stringMatching(/Command .* failed .*/),
    }));
  });

  it('should include the command', () => {
    const error = new CommandFailedError('commandName', 'command');

    expect(error.command).toBe('command');
  });
});
