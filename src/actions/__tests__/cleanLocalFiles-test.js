/* eslint-env node, jest */

jest.mock('../../exec');

const BaseReporter = require('../../reporters/BaseReporter');
const cleanLocalFiles = require('../cleanLocalFiles');
const createBackup = require('../../createBackup');
const exec = require('../../exec');
const server = require('../../server');

describe('cleanLocalFiles', () => {
  const connection = null;
  const reporter = new BaseReporter();
  let backup;

  beforeEach(() => {
    backup = createBackup(server, {
      local: {
        files: [
          'file1',
          'file2'
        ],
        encryptedFiles: [
          'file1.gpg',
          'file2.gpg'
        ]
      }
    });
  });

  it('should return a promise', () => {
    const promise = cleanLocalFiles(backup, connection, reporter);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await cleanLocalFiles(backup, connection, reporter);
    expect(newBackup).not.toBe(backup);
  });

  it('should execute rm command for each file', async () => {
    await cleanLocalFiles(backup, connection, reporter);

    [].concat(backup.local.files, backup.local.encryptedFiles).forEach((file) => {
      expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${file}"`));
    });
  });

  it('should set cleaned files on backup', async () => {
    const newBackup = await cleanLocalFiles(backup, connection, reporter);
    expect(newBackup).toEqual(expect.objectContaining({
      local: expect.objectContaining({
        cleanedFiles: ['file1', 'file2', 'file1.gpg', 'file2.gpg'],
        files: [],
        encryptedFiles: []
      })
    }));
  });

  it('should reject when command fails', async () => {
    exec.reject();

    let thrownError = null;

    try {
      await cleanLocalFiles(backup, connection, reporter);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });
});
