const backup = {
  server: null,
  remote: {},
  local: {}
};

function createBackup(server, options = {}) {
  return Object.assign({}, backup, { server }, options);
}

module.exports = createBackup;
