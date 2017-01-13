const logUpdate = require('log-update');
const util = require('util');

class DebugRenderer {
  render(updatedBackup) {
    logUpdate(util.inspect(updatedBackup, { depth: 7 }));
  }

  end() {
    logUpdate.done();
  }
}

module.exports = DebugRenderer;
