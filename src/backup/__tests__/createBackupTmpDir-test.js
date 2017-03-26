/* eslint-env node, jest */

jest.mock('fs');

const testTmpDir = '/tmp/clio-test';
process.env.TMP_DIR = testTmpDir;

const createBackup = require('../createBackup');
const createBackupTmpDir = require('../createBackupTmpDir');
const server = require('../../server');

describe('createBackupTmpDir', () => {
  let backup;

  beforeEach(() => {
    backup = createBackup(server);
  });

  it('sets temp dir on backup', async () => {
    const updatedBackup = await createBackupTmpDir(backup);
    expect(updatedBackup).toEqual(expect.objectContaining({
      local: expect.objectContaining({
        tmpDir: `${testTmpDir}/clio-backup.test`,
      }),
    }));
  });
});
