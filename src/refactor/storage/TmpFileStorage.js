const fs = require('fs');
const os = require('os');
const path = require('path');
const rimraf = require('../lib/rimraf');
const FileStorage = require('./FileStorage');

function TmpFileStorage(prefix = `${os.tmpdir()}${path.sep}clio-backup.`) {
  FileStorage.call(this, fs.mkdtempSync(prefix));

  let destroyed = false;

  Object.defineProperty(this, 'destroyed', {
    get() {
      return destroyed;
    },
  });

  /**
   * Remove the temporary storage from the filesystem
   * @returns {Promise}
   */
  this.destroy = async function destroy() {
    await rimraf(this.root);
    destroyed = true;
  };
}

TmpFileStorage.prototype = Object.create(FileStorage.prototype);

module.exports = TmpFileStorage;
