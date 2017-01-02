/* eslint-env node, jest */

let result;
let error;

const mockExec = jest.fn(() => {
  if (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(result);
});

mockExec.resolve = function resolve(resultToReturn = { stdout: 'stdout', stderr: 'stderr' }) {
  error = null;
  result = resultToReturn;
};

mockExec.reject = function reject(errorToThrow = new Error('mock error')) {
  result = null;
  error = errorToThrow;
};

module.exports = mockExec;
