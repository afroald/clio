/* eslint-env node, jest */

const fs = jest.genMockFromModule('fs');

let directories = [];

function __setDirectories(newDirectories) {
  directories = newDirectories;
}

function access(path, callback) {
  if (directories.indexOf(path) === -1) {
    callback(new Error('Path not found'));
  } else {
    callback();
  }
}

fs.__setDirectories = __setDirectories;
fs.access = access;

fs.mkdtemp = jest.fn((prefix, callback) => {
  callback(null, `${prefix}test`);
});

module.exports = fs;
