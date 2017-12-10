/* eslint-env node, jest */

const NotImplementedError = require('../NotImplementedError');

describe('NotImplementedError', () => {
  let error;

  beforeEach(() => {
    error = new NotImplementedError();
  });

  it('should be an instance of NotImplementedError', () => {
    expect(error).toBeInstanceOf(NotImplementedError);
  });

  it('should be an instance of Error', () => {
    expect(error).toBeInstanceOf(Error);
  });

  it('should have the correct name', () => {
    expect(error.name).toEqual('NotImplementedError');
  });
});
