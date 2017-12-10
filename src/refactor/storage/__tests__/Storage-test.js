/* eslint-env node, jest */

const NotImplementedError = require('../../errors/NotImplementedError');
const Storage = require('../Storage');

describe('Storage', () => {
  ['read', 'write', 'readStream', 'writeStream', 'delete'].forEach((method) => {
    it(`should have method ${method}`, () => {
      const storage = new Storage();
      expect(() => { storage[method](); }).toThrow(NotImplementedError);
    });
  });
});
