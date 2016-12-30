/* eslint-env node, jest */

const CommandFailedError = require('../../errors/CommandFailedError');
const createBackup = require('../../createBackup');
const runGitlabBackup = require('./../runGitlabBackup');
const server = require('../../servers/server');

const backup = createBackup(server);

describe('runGitlabBackup', () => {
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
    const promise = runGitlabBackup(backup, connection);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should not modify the original backup', async () => {
    const newBackup = await runGitlabBackup(backup, connection);

    expect(newBackup).not.toBe(backup);
  });

  it('should throw CommandFailedError when command fails', async () => {
    connection = {
      execCommand: jest.fn(() => Promise.resolve({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }))
    };

    try {
      await runGitlabBackup(backup, connection);
    } catch (error) {
      expect(error).toBeInstanceOf(CommandFailedError);
      expect(error).toEqual(expect.stringMatching('runGitlabBackup'));
      expect(error.command).toEqual(expect.objectContaining({
        code: 1,
        stdout: 'stdout',
        stderr: 'stderr'
      }));
    }
  });

  it('should execute sudo gitlab-rake gitlab:backup:create on the remote server', async () => {
    await runGitlabBackup(backup, connection);

    expect(connection.execCommand)
      .toHaveBeenCalledWith(expect.stringMatching('sudo gitlab-rake gitlab:backup:create'));
  });

  it('should set the backup filename on the backup', async () => {
    const newBackup = await runGitlabBackup(backup, connection);

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
      await runGitlabBackup(backup, connection);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(Error);
    }

    expect(errorThrown).toBe(true);
  });
});
