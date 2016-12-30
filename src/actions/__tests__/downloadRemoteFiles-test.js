/* eslint-env node, jest */

process.env.TMP_DIR = '/tmp';

const path = require('path');

const CommandFailedError = require('../../errors/CommandFailedError');
const createBackup = require('../../createBackup');
const downloadRemoteFiles = require('../downloadRemoteFiles');
const server = require('../../servers/server');


const backup = createBackup(server, {
  remote: {
    files: [
      'file1',
      'file2'
    ]
  }
});

describe('downloadRemoteFiles', () => {
  let connection;

  beforeEach(() => {
    connection = {
      getFile: jest.fn(() => Promise.resolve())
    };
  });

  it('should return a promise', () => {
    const promise = downloadRemoteFiles(backup, connection);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await downloadRemoteFiles(backup, connection);

    expect(newBackup).not.toBe(backup);
  });

  it('should throw error when command fails', async () => {
    connection = {
      getFile: jest.fn(() => Promise.reject())
    };

    let errorThrown = false;

    try {
      await downloadRemoteFiles(backup, connection);
    } catch (error) {
      errorThrown = true;
    }

    expect(errorThrown).toBe(true);
  });

  it('should call getFile for each remote file', async () => {
    await downloadRemoteFiles(backup, connection);

    expect(connection.getFile).toHaveBeenCalledTimes(2);
  });

  it('should set local paths on backup', async () => {
    const newBackup = await downloadRemoteFiles(backup, connection);

    expect(newBackup).toEqual(expect.objectContaining({
      local: expect.objectContaining({
        files: expect.arrayContaining([
          path.join('/tmp', 'file1'),
          path.join('/tmp', 'file2')
        ])
      })
    }));
  });
});
