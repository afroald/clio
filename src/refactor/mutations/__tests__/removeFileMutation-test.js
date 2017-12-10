/* eslint-env node, jest */

const clone = require('clone');

const removeFileMutation = require('../removeFileMutation');
const File = require('../../File');

describe('removeFileMutation', () => {
  const testFile1 = new File('test-path-1');
  const testFile2 = new File('test-path-2');
  const testFile3 = new File('test-path-3');
  let backup = null;

  beforeEach(() => {
    backup = {
      local: {
        files: [testFile1, testFile2, testFile3],
      },
    };
  });

  it('removes a local file from backup state', () => {
    removeFileMutation(backup, 'local', { file: testFile2 });
    expect(backup.local.files).not.toEqual(expect.arrayContaining([testFile2]));
    expect(backup.local.files).toEqual(expect.arrayContaining([testFile1, testFile3]));
  });

  it('does nothing when given file is no in backup state', () => {
    const initialState = clone(backup);
    removeFileMutation(backup, 'local', { file: new File('test-path-4') });
    expect(backup).toEqual(initialState);
  });

  it('throws an error when file is not an instance of File', () => {
    expect(() => {
      removeFileMutation(backup, { file: 'test' });
    }).toThrow(Error);
  });
});
