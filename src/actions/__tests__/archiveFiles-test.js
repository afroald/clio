/* eslint-env node, jest */

const moment = require('moment');
const path = require('path');
const u = require('updeep');

const testStorageDir = '/tmp';
process.env.STORAGE_DIR = testStorageDir;

const archiveFiles = require('../archiveFiles');
const createActionUpdater = require('../../action/createActionUpdater');
const createBackup = require('../../backup/createBackup');
const baseServer = require('../../server');

describe('archiveFiles', () => {
  const server = u({
    hostname: 'test.clio',
    actions: [
      archiveFiles,
    ],
  }, baseServer);

  let backup;
  let connection;
  let updater;

  beforeEach(() => {
    backup = createBackup(server, {
      local: {
        encryptedFiles: [
          'file1.gpg',
          'file2.gpg',
        ],
      },
    });

    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 0 })),
    };

    updater = createActionUpdater(backup, archiveFiles);
  });

  it('should return a promise', () => {
    const promise = archiveFiles.action(backup, connection, updater);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await archiveFiles.action(backup, connection, updater);
    expect(newBackup).not.toBe(backup);
  });

  it('should create a sub-action for each file', async () => {
    const updatedBackup = await archiveFiles.action(backup, connection, updater);
    expect(updatedBackup).toEqual(expect.objectContaining({
      server: expect.objectContaining({
        actions: expect.arrayContaining([
          expect.objectContaining({
            actions: expect.arrayContaining([
              expect.objectContaining({
                title: expect.stringMatching('file1'),
              }),
              expect.objectContaining({
                title: expect.stringMatching('file2'),
              }),
            ]),
          }),
        ]),
      }),
    }));
  });

  describe('sub-actions', async () => {
    let subAction;

    beforeEach(async () => {
      const updatedBackup = await archiveFiles.action(backup, connection, updater);
      subAction = updatedBackup.server.actions[0].actions[0];
    });

    it('should update files on backup', async () => {
      const updatedBackup = await subAction.action(backup, connection);
      expect(updatedBackup).toEqual(expect.objectContaining({
        local: expect.objectContaining({
          encryptedFiles: ['file1.gpg', 'file2.gpg'],
          archivedFiles: [path.join(testStorageDir, updatedBackup.server.hostname, moment().format('YYYY-MM-DD-HHmmss'), 'file1.gpg')],
        }),
      }));
    });
  });
});
