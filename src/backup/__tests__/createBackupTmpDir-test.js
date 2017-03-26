/* eslint-env node, jest */

jest.mock('fs');

const config = require('../../defaultConfig');
const createBackup = require('../createBackup');
const createBackupTmpDir = require('../createBackupTmpDir');
const server = require('../../server');

describe('createBackupTmpDir', () => {
  let backup;

  beforeEach(() => {
    backup = createBackup(server, { config });
  });

  it('sets temp dir on backup', async () => {
    const updatedBackup = await createBackupTmpDir(backup);
    expect(updatedBackup).toEqual(expect.objectContaining({
      local: expect.objectContaining({
        tmpDir: `${config.paths.tmp}/clio-backup.test`,
      }),
    }));
  });
});
