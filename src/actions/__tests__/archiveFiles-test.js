/* eslint-env node, jest */

jest.mock('fs');
jest.mock('../../exec');

const fs = require('fs');
const moment = require('moment');
const path = require('path');

const testStorageDir = '/tmp';
const expectedDestination = path.join(testStorageDir, moment().format('YYYY-MM-DD'));
process.env.STORAGE_DIR = testStorageDir;

const archiveFiles = require('../archiveFiles');
const BaseReporter = require('../../reporters/BaseReporter');
const createBackup = require('../../createBackup');
const exec = require('../../exec');
const server = require('../../server');


describe('archiveFiles', () => {
  const connection = null;
  const reporter = new BaseReporter();
  let backup;

  beforeEach(() => {
    exec.mockClear();

    fs.__setDirectories([testStorageDir]);

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
    const promise = archiveFiles(backup, connection, reporter);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await archiveFiles(backup, connection, reporter);
    expect(newBackup).not.toBe(backup);
  });

  it('should create the destination dir', async () => {
    await archiveFiles(backup, connection, reporter);
    expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${expectedDestination}"`));
  });

  it('should create a different destination dir if it already exists', async () => {
    fs.__setDirectories([expectedDestination]);
    await archiveFiles(backup, connection, reporter);
    expect(exec).toHaveBeenCalledWith(expect.stringMatching(new RegExp(`"${expectedDestination}-.*"`)));
  });

  it('should copy all files', async () => {
    await archiveFiles(backup, connection, reporter);

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
      await archiveFiles(backup, connection, reporter);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });
});
