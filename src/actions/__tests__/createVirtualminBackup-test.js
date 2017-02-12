/* eslint-env node, jest */

const createBackup = require('../../backup/createBackup');
const createVirtualminBackup = require('../createVirtualminBackup');
const CommandFailedError = require('../../errors/CommandFailedError');
const server = require('../../server');

const actionStructure = expect.objectContaining({
  title: expect.any(String),
  action: expect.any(Function),
  skip: expect.any(Function),
  state: null
});

describe('createVirtualminBackup', () => {
  const backup = createBackup(server);
  let connection;

  beforeEach(() => {
    connection = {
      execCommand: jest.fn()
    };

    connection.execCommand.mockImplementationOnce(() => Promise.resolve({
      code: 0,
      stdout: '\nBackup location: "/tmp/clio-backup"'
    }));

    connection.execCommand.mockImplementationOnce(() => Promise.resolve({
      code: 0,
      stdout: 'file1\nfile2\n'
    }));
  });

  it('should be an action', () => {
    expect(createVirtualminBackup).toEqual(actionStructure);
  });

  it('should return a promise', () => {
    const promise = createVirtualminBackup.action(backup, connection);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await createVirtualminBackup.action(backup, connection);

    expect(newBackup).not.toBe(backup);
  });

  it('should reject when ssh connection fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.reject(new Error()))
    };

    let thrownError = null;

    try {
      await createVirtualminBackup.action(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(Error);
  });

  it('should reject when command fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }))
    };

    let thrownError = null;

    try {
      await createVirtualminBackup.action(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(CommandFailedError);
  });

  it('should execute sudo backup-virtualmin on the remote server', async () => {
    await createVirtualminBackup.action(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching('sudo backup-virtualmin'));
  });

  it('should set remote files on the backup', async () => {
    const newBackup = await createVirtualminBackup.action(backup, connection);

    expect(newBackup).toEqual(expect.objectContaining({
      remote: expect.objectContaining({
        files: expect.arrayContaining(['/tmp/clio-backup/file1', '/tmp/clio-backup/file2'])
      })
    }));
  });

  it('should throw an error when it can not find the backup filename', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 0,
        stdout: ''
      }))
    };

    let errorThrown = false;

    try {
      await createVirtualminBackup.action(backup, connection);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(Error);
    }

    expect(errorThrown).toBe(true);
  });
});
