/* eslint-env node, jest */

const u = require('updeep');

const encryptFiles = require('../encryptFiles');
const createActionUpdater = require('../../action/createActionUpdater');
const createBackup = require('../../backup/createBackup');
const baseServer = require('../../server');

describe('encryptFiles', () => {
  const server = u({
    actions: [
      encryptFiles
    ]
  }, baseServer);

  let backup;
  let connection;
  let updater;

  beforeEach(() => {
    backup = createBackup(server, {
      local: {
        files: [
          'file1',
          'file2'
        ]
      }
    });

    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 0 }))
    };

    updater = createActionUpdater(backup, encryptFiles);
  });

  it('should return a promise', () => {
    const promise = encryptFiles.action(backup, connection, updater);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await encryptFiles.action(backup, connection, updater);
    expect(newBackup).not.toBe(backup);
  });

  it('should create a sub-action for each file', async () => {
    const updatedBackup = await encryptFiles.action(backup, connection, updater);
    expect(updatedBackup).toEqual(expect.objectContaining({
      server: expect.objectContaining({
        actions: expect.arrayContaining([
          expect.objectContaining({
            actions: expect.arrayContaining([
              expect.objectContaining({
                title: expect.stringMatching('file1')
              }),
              expect.objectContaining({
                title: expect.stringMatching('file2')
              })
            ])
          })
        ])
      })
    }));
  });

  describe('sub-actions', async () => {
    let subAction;

    beforeEach(async () => {
      const updatedBackup = await encryptFiles.action(backup, connection, updater);
      subAction = updatedBackup.server.actions[0].actions[0];
    });

    it('should update files on backup', async () => {
      const updatedBackup = await subAction.action(backup, connection);
      expect(updatedBackup).toEqual(expect.objectContaining({
        local: expect.objectContaining({
          files: ['file1', 'file2'],
          encryptedFiles: ['file1.gpg']
        })
      }));
    });
  });
});
