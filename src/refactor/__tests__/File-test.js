/* eslint-env node, jest */

const File = require('../File');

describe('File', () => {
  it('should set a path', () => {
    const file = new File('test/path');
    expect(file.path).toBe('test/path');
  });

  it('throws an error when no path is given', () => {
    expect(() => {
      new File(); // eslint-disable-line no-new
    }).toThrow(Error);
  });

  it('should set attributes', () => {
    const file = new File('test/path', { test: true });
    expect(file.attributes).toEqual({ test: true });
  });

  it('should be immutable', () => {
    const file = new File('test/path', { test: true });

    expect(Object.isFrozen(file)).toBe(true);
    expect(Object.isFrozen(file.attributes)).toBe(true);
  });
});
