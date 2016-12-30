/* eslint-env node, jest */

const CommandFailedError = require('../../errors/CommandFailedError');
const createBackup = require('../../createBackup');
const cleanTmpDir = require('./../cleanTmpDir');
const server = require('../../servers/server');

describe('cleanTmpDir', () => {
  let backup;
  let connection;

  beforeEach(() => {
    backup = createBackup(server, {
      remote: {
        tmpDir: server.config.tmpDir
      }
    });

    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 0 }))
    };
  });

  it('should return a promise', () => {
    const promise = cleanTmpDir(backup, connection);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should throw CommandFailedError when command fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }))
    };

    let errorThrown = false;

    try {
      await cleanTmpDir(backup, connection);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(CommandFailedError);
      expect(error).toEqual(expect.stringMatching('cleanTmpDir'));
      expect(error.command).toEqual(expect.objectContaining({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }));
    }

    expect(errorThrown).toBe(true);
  });

  it('should do nothing if no tmpDir is known', async () => {
    backup = createBackup(server);

    await cleanTmpDir(backup, connection);

    expect(connection.execCommand).not.toHaveBeenCalled();
  });

  it('should execute rm -rf on the remote server', async () => {
    await cleanTmpDir(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching('rm -rf'));
  });

  it('should remove the correct dir', async () => {
    await cleanTmpDir(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching(backup.remote.tmpDir));
  });
});
