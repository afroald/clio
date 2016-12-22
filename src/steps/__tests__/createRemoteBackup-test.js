/* eslint-env node, jest */

const createBackup = require('../../createBackup');
const createRemoteBackup = require('./../createRemoteBackup');
const serverPrototype = require('../../servers/server');

const connection = {};

function actionImplementation(backup) {
  return Promise.resolve(backup);
}

describe('createRemoteBackup', () => {
  it('should return new backup object', async () => {
    const server = Object.assign({}, serverPrototype, {
      actions: [
        jest.fn(backup => Object.assign({}, backup))
      ]
    });
    const backup = createBackup(server);

    const returnedBackup = await createRemoteBackup(backup, connection);

    expect(returnedBackup).toEqual(backup);
    expect(returnedBackup).not.toBe(backup);
  });

  it('should call all actions', async () => {
    const server = Object.assign({}, serverPrototype, {
      actions: [
        jest.fn(actionImplementation),
        jest.fn(actionImplementation)
      ]
    });
    const backup = createBackup(server);

    await createRemoteBackup(backup, connection);

    server.actions.forEach(action => expect(action).toBeCalledWith(backup, connection));
  });

  it('should set backup path', async () => {
    const server = Object.assign({}, serverPrototype, {
      actions: [
        backup => Object.assign({}, backup, { remote: { path: 'remotePath' } })
      ]
    });
    const backup = createBackup(server);

    const returnedBackup = await createRemoteBackup(backup, connection);

    expect(returnedBackup).toEqual(expect.objectContaining({
      remote: {
        path: 'remotePath'
      }
    }));
  });
});
