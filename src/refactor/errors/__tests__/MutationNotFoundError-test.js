/* eslint-env node, jest */

const MutationNotFoundError = require('../MutationNotFoundError');

describe('MutationNotFoundError', () => {
  let error;

  beforeEach(() => {
    error = new MutationNotFoundError();
  });

  it('should be an instance of Error', () => {
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    expect(error.name).toEqual('MutationNotFoundError');
  });
});
