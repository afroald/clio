/* eslint-env node, jest */

const BaseReporter = require('../../reporters/BaseReporter');
const CommandFailedError = require('../../errors/CommandFailedError');
const createBackup = require('../../createBackup');
const createGitlabBackup = require('./../createGitlabBackup');
const server = require('../../server');

const backup = createBackup(server);

describe('createGitlabBackup', () => {
  const reporter = new BaseReporter();
  let connection;

  beforeEach(() => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 0,
        stdout: 'Creating backup archive: test.tar ... done'
      }))
    };
  });

  it('should return a promise', () => {
    const promise = createGitlabBackup(backup, connection, reporter);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await createGitlabBackup(backup, connection, reporter);

    expect(newBackup).not.toBe(backup);
  });

  it('should reject when ssh connection fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.reject(new Error()))
    };

    let thrownError = null;

    try {
      await createGitlabBackup(backup, connection, reporter);
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
      await createGitlabBackup(backup, connection, reporter);
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).not.toBe(null);
    expect(thrownError).toBeInstanceOf(CommandFailedError);
  });

  it('should execute sudo gitlab-rake gitlab:backup:create on the remote server', async () => {
    await createGitlabBackup(backup, connection, reporter);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching('sudo gitlab-rake gitlab:backup:create'));
  });

  it('should set the backup filename on the backup', async () => {
    const newBackup = await createGitlabBackup(backup, connection, reporter);

    expect(newBackup).toEqual(expect.objectContaining({
      remote: expect.objectContaining({
        files: expect.arrayContaining(['/var/opt/gitlab/backups/test.tar'])
      })
    }));
  });

  it('should throw an Error when it can not find the backup filename', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 0,
        stdout: ''
      }))
    };

    let errorThrown = false;

    try {
      await createGitlabBackup(backup, connection, reporter);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(Error);
    }

    expect(errorThrown).toBe(true);
  });
});