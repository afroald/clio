/* eslint-env node, jest */

jest.mock('../../exec');

const testRecipient = 'testRecipient';
const createBackup = require('../../createBackup');
const encryptFiles = require('../encryptFiles');
const exec = require('../../exec');
const server = require('../../servers/server');

process.env.GPG_RECIPIENT = testRecipient;

describe('encryptFiles', () => {
  let backup;

  beforeEach(() => {
    exec.mockClear();

    backup = createBackup(server, {
      local: {
        files: [
          'file1',
          'file2'
        ]
      }
    });
  });

  it('should return a promise', () => {
    const promise = encryptFiles(backup);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await encryptFiles(backup);
    expect(newBackup).not.toBe(backup);
  });

  it('should call gpg with the correct recipient', async () => {
    await encryptFiles(backup);

    expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${testRecipient}"`));
  });

  it('should call gpg with the correct files', async () => {
    await encryptFiles(backup);

    backup.local.files.forEach((file) => {
      expect(exec).toHaveBeenCalledWith(expect.stringMatching(`"${file}"`));
    });
  });

  it('should set encrypted files on the backup', async () => {
    const newBackup = await encryptFiles(backup);
    expect(newBackup).toEqual(expect.objectContaining({
      local: expect.objectContaining({
        encryptedFiles: [
          'file1.gpg',
          'file2.gpg'
        ]
      })
    }));
  });

  it('should reject when command fails', async () => {
    exec.reject();

    let thrownError = null;

    try {
      await encryptFiles(backup);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });
});
