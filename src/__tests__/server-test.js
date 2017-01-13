/* eslint-env node, jest */

const server = require('../server');

describe('server', () => {
  it('should be a frozen object', () => {
    expect(Object.isFrozen(server)).toBe(true);
  });
});
