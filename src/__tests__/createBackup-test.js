/* eslint-env node, jest */

const createBackup = require('./../createBackup');
const server = require('./../servers/server');

describe('createBackup', () => {
  it('should return an object with a server property', () => {
    const backup = createBackup(server);

    expect(backup).toEqual(expect.objectContaining({
      server: expect.any(Object)
    }));
  });

  it('should include options', () => {
    const backup = createBackup(server, { foo: 'bar' });

    expect(backup).toEqual(expect.objectContaining({
      foo: 'bar'
    }));
  });
});
