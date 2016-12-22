/* eslint-env node, jest */

const createBackup = require('../../createBackup');
const cleanTmpDir = require('./../cleanTmpDir');
const server = require('../../servers/server');

const backup = createBackup(server);

describe('cleanTmpDir', () => {
  let connection;

  beforeEach(() => {
    connection = {
      execCommand: jest.fn()
    };
  });

  it('should execute rm -rf on the remote server', () => {
    cleanTmpDir(backup, connection);
    expect(connection.execCommand).toHaveBeenCalledWith(expect.stringMatching('rm -rf'));
  });

  it('should remove the correct dir', () => {
    cleanTmpDir(backup, connection);
    expect(connection.execCommand).toHaveBeenCalledWith(expect.stringMatching(server.config.tmpDir));
  });
});
