async function createTmpDir(backup, connection) {
  return connection.execCommand(`mkdir -p "${backup.server.config.tmpDir}"`);
}

module.exports = createTmpDir;
