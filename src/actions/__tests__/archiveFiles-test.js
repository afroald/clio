/* eslint-env node, jest */

const path = require('path');
const moment = require('moment');

jest.mock('../../exec');

const testStorageDir = '/tmp';
const expectedDestination = path.join(testStorageDir, moment().format('YYYY-MM-DD'));
process.env.STORAGE_DIR = testStorageDir;

const archiveFiles = require('../archiveFiles');
const createBackup = require('../../createBackup');
const exec = require('../../exec');
const server = require('../../servers/server');


describe('archiveFiles', () => {
  let backup;

  beforeEach(() => {
    exec.mockClear();

    backup = createBackup(server, {
      local: {
        encryptedFiles: [
          'file1.gpg',
          'file2.gpg'
        ]
      }
    });
  });

  it('should return a promise', () => {
    const promise = archiveFiles(backup);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await archiveFiles(backup);
    expect(newBackup).not.toBe(backup);
  });

  it('should create the destination dir', async () => {
    await archiveFiles(backup);
    expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${expectedDestination}"`));
  });

  it('should copy all files', async () => {
    await archiveFiles(backup);

    backup.local.encryptedFiles.forEach((file) => {
      const expectedFileDestination = path.join(expectedDestination, path.basename(file));
      expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${file}"`));
      expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${expectedFileDestination}"`));
    });
  });

  it('should reject when command fails', async () => {
    exec.reject();

    let thrownError = null;

    try {
      await archiveFiles(backup);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });
});
