/* eslint-env node, jest */

const CommandFailedError = require('../../errors/CommandFailedError');
const createBackup = require('../../createBackup');
const cleanTmpDir = require('./../cleanTmpDir');
const server = require('../../server');

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

  it('should reject when ssh connection fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.reject(new Error()))
    };

    let thrownError = null;

    try {
      await cleanTmpDir(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });

  it('should reject when command fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }))
    };

    let thrownError = null;

    try {
      await cleanTmpDir(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(CommandFailedError);
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
