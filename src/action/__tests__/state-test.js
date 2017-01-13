/* eslint-env node, jest */

const state = require('../state');

describe('state', () => {
  it('should be a frozen object', () => {
    expect(Object.isFrozen(state)).toBe(true);
  });
});
