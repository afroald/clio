/* eslint-env node, jest */

const createBackup = require('../../backup/createBackup');
const createGitlabBackup = require('../createGitlabBackup');
const CommandFailedError = require('../../errors/CommandFailedError');
const server = require('../../server');

const actionStructure = expect.objectContaining({
  title: expect.any(String),
  action: expect.any(Function),
  skip: expect.any(Function),
  state: null
});

describe('createGitlabBackup', () => {
  const backup = createBackup(server);
  let connection;

  beforeEach(() => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 0,
        stdout: 'Creating backup archive: test.tar ... done'
      }))
    };
  });

  it('should be an action', () => {
    expect(createGitlabBackup).toEqual(actionStructure);
  });

  it('should return a promise', () => {
    const promise = createGitlabBackup.action(backup, connection);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await createGitlabBackup.action(backup, connection);

    expect(newBackup).not.toBe(backup);
  });

  it('should reject when ssh connection fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.reject(new Error()))
    };

    let thrownError = null;

    try {
      await createGitlabBackup.action(backup, connection);
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
      await createGitlabBackup.action(backup, connection);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(CommandFailedError);
  });

  it('should execute sudo gitlab-rake gitlab:backup:create on the remote server', async () => {
    await createGitlabBackup.action(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching('sudo gitlab-rake gitlab:backup:create'));
  });

  it('should set the backup filename on the backup', async () => {
    const newBackup = await createGitlabBackup.action(backup, connection);

    expect(newBackup).toEqual(expect.objectContaining({
      remote: expect.objectContaining({
        files: expect.arrayContaining(['/var/opt/gitlab/backups/test.tar'])
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
      await createGitlabBackup.action(backup, connection);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(Error);
    }

    expect(errorThrown).toBe(true);
  });
});
