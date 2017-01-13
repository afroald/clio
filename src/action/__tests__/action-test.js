/* eslint-env node, jest */

const action = require('../action');

describe('action', () => {
  it('should be a frozen object', () => {
    expect(Object.isFrozen(action)).toBe(true);
  });
});
