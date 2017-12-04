/* eslint-env node, jest */

const addLocalFileMutation = require('../addLocalFileMutation');
const File = require('../../File');

describe('addLocalFileMutation', () => {
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
    addLocalFileMutation(backup, { file });
    expect(backup.local.files).toEqual(expect.arrayContaining([file]));
  });

  it('should throw an error when file is not an instance of File', () => {
    const file = 'test';
    expect(() => {
      addLocalFileMutation(backup, { file });
    }).toThrow(Error);
  });
});
