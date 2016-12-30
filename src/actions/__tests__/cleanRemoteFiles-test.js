/* eslint-env node, jest */

const cleanRemoteFiles = require('../cleanRemoteFiles');
const createBackup = require('../../createBackup');
const server = require('../../servers/server');

describe('cleanRemoteFiles', () => {
  let backup;
  let connection;

  beforeEach(() => {
    backup = createBackup(server, {
      remote: {
        files: [
          'file1',
          'file2'
        ]
      }
    });

    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 0 }))
    };
  });

  it('should return a promise', () => {
    const promise = cleanRemoteFiles(backup, connection);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await cleanRemoteFiles(backup, connection);
    expect(newBackup).not.toBe(backup);
  });

  it('should execute command for each file', async () => {
    await cleanRemoteFiles(backup, connection);
    expect(connection.execCommand).toHaveBeenCalledTimes(2);

    backup.remote.files.forEach((file) => {
      expect(connection.execCommand).toHaveBeenCalledWith(`rm -f ${file}`);
    });
  });

  it('should update files on backup', async () => {
    const newBackup = await cleanRemoteFiles(backup, connection);
    expect(newBackup).toEqual(expect.objectContaining({
      remote: expect.objectContaining({
        cleanedFiles: ['file1', 'file2'],
        files: []
      })
    }));
  });

  it('should reject when a delete command fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 1 }))
    };

    let thrownError = null;

    try {
      await cleanRemoteFiles(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });

  it('should reject when ssh connection fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.reject(new Error()))
    };

    let thrownError = null;

    try {
      await cleanRemoteFiles(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });
});
