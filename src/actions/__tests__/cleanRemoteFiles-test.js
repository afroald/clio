/* eslint-env node, jest */

const u = require('updeep');

const cleanRemoteFiles = require('../cleanRemoteFiles');
const createActionUpdater = require('../../action/createActionUpdater');
const createBackup = require('../../backup/createBackup');
const baseServer = require('../../server');

describe('cleanRemoteFiles', () => {
  const server = u({
    actions: [
      cleanRemoteFiles,
    ],
  }, baseServer);

  let backup;
  let connection;
  let updater;

  beforeEach(() => {
    backup = createBackup(server, {
      remote: {
        files: [
          'file1',
          'file2',
        ],
      },
    });

    connection = {
      execCommand: jest.fn(() => Promise.resolve({ code: 0 })),
    };

    updater = createActionUpdater(backup, cleanRemoteFiles);
  });

  it('should return a promise', () => {
    const promise = cleanRemoteFiles.action(backup, connection, updater);
    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await cleanRemoteFiles.action(backup, connection, updater);
    expect(newBackup).not.toBe(backup);
  });

  it('should create a sub-action for each file', async () => {
    const updatedBackup = await cleanRemoteFiles.action(backup, connection, updater);
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
      const updatedBackup = await cleanRemoteFiles.action(backup, connection, updater);
      subAction = updatedBackup.server.actions[0].actions[0];
    });

    it('should execute command', async () => {
      await subAction.action(backup, connection);
      expect(connection.execCommand).toHaveBeenCalledWith(expect.stringMatching('file1'));
    });

    it('should update files on backup', async () => {
      const updatedBackup = await subAction.action(backup, connection);
      expect(updatedBackup).toEqual(expect.objectContaining({
        remote: expect.objectContaining({
          cleanedFiles: ['file1'],
          files: ['file2'],
        }),
      }));
    });

    it('should reject when ssh connection fails', async () => {
      connection = {
        execCommand: jest.fn(() => Promise.reject(new Error())),
      };

      let thrownError = null;

      try {
        await subAction.action(backup, connection, updater);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).not.toBe(null);
      expect(thrownError).toBeInstanceOf(Error);
    });

    it('should reject when command fails', async () => {
      connection = {
        execCommand: jest.fn(() => Promise.resolve({ code: 1 })),
      };

      let thrownError = null;

      try {
        await subAction.action(backup, connection, updater);
      } catch (error) {
        thrownError = error;
      }

      expect(thrownError).not.toBe(null);
      expect(thrownError).toBeInstanceOf(Error);
    });
  });
});
