/* eslint-env node, jest */

const backup = require('../backup');

describe('backup', () => {
  it('should be a frozen object', () => {
    expect(Object.isFrozen(backup)).toBe(true);
  });
});
