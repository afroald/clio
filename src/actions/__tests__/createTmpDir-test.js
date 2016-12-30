/* eslint-env node, jest */

const CommandFailedError = require('../../errors/CommandFailedError');
const createBackup = require('../../createBackup');
const createTmpDir = require('./../createTmpDir');
const server = require('../../servers/server');

const backup = createBackup(server);

describe('createTmpDir', () => {
  let connection;

  beforeEach(() => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 0 }))
    };
  });

  it('should return a promise', () => {
    const promise = createTmpDir(backup, connection);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await createTmpDir(backup, connection);

    expect(newBackup).not.toBe(backup);
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
      await createTmpDir(backup, connection);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(CommandFailedError);
      expect(error).toEqual(expect.stringMatching('createTmpDir'));
      expect(error.command).toEqual(expect.objectContaining({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }));
    }

    expect(errorThrown).toBe(true);
  });

  it('should execute mkdir -p on the remote server', async () => {
    await createTmpDir(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching('mkdir -p'));
  });

  it('should create the correct dir', async () => {
    await createTmpDir(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching(server.config.tmpDir));
  });

  it('should set the created tmpDir on the backup', async () => {
    const newBackup = await createTmpDir(backup, connection);

    expect(newBackup).toEqual(expect.objectContaining({
      remote: expect.objectContaining({
        tmpDir: backup.server.config.tmpDir
      })
    }));
  });
});
