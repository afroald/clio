/* eslint-env node, jest */

const addFileMutation = require('../addFileMutation');
const File = require('../../File');

describe('addFileMutation', () => {
  let backup = null;

  beforeEach(() => {
    backup = {
      local: {
        files: [],
      },
    };
  });

  it('should add a file', () => {
    const file = new File('test-path');
    addFileMutation(backup, 'local', { file });
    expect(backup.local.files).toEqual(expect.arrayContaining([file]));
  });

  it('should throw an error when file is not an instance of File', () => {
    const file = 'test';
    expect(() => {
      addFileMutation(backup, 'local', { file });
    }).toThrow(Error);
  });
});
