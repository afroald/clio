/* eslint-env node, jest */

jest.mock('execa');

const exec = require('execa');

const cleanBackupTmpDir = require('../cleanBackupTmpDir');
const createBackup = require('../createBackup');
const server = require('../../server');

describe('cleanBackupTmpDir', () => {
  let backup;

  beforeEach(() => {
    backup = createBackup(server, {
      local: {
        tmpDir: '/tmp/clio-test/clio-backup.test',
      },
    });
  });

  it('does nothing when there is no tmp dir', async () => {
    backup = createBackup(server);

    const updatedBackup = await cleanBackupTmpDir(backup);

    expect(exec).not.toHaveBeenCalled();
    expect(updatedBackup).toEqual(backup);
  });

  it('calls rm -r', async () => {
    await cleanBackupTmpDir(backup);
    expect(exec).toHaveBeenCalledWith('rm', ['-r', '/tmp/clio-test/clio-backup.test']);
  });

  it('removes tmp dir from backup', async () => {
    const updatedBackup = await cleanBackupTmpDir(backup);
    expect(updatedBackup).not.toEqual(expect.objectContaining({
      local: expect.objectContaining({
        tmpDir: expect.any(String),
      }),
    }));
  });
});
