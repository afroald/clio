/* eslint-env node, jest */

const createBackup = require('../../createBackup');
const createTmpDir = require('./../createTmpDir');
const server = require('../../servers/server');

const backup = createBackup(server);

describe('createTmpDir', () => {
  let connection;

  beforeEach(() => {
    connection = {
      execCommand: jest.fn()
    };
  });

  it('should execute mkdir -p on the remote server', () => {
    createTmpDir(backup, connection);
    expect(connection.execCommand).toHaveBeenCalledWith(expect.stringMatching('mkdir -p'));
  });

  it('should create the correct dir', () => {
    createTmpDir(backup, connection);
    expect(connection.execCommand).toHaveBeenCalledWith(expect.stringMatching(server.config.tmpDir));
  });
});
