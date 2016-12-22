async function cleanTmpDir(backup, connection) {
  return connection.execCommand(`rm -rf ${backup.server.config.tmpDir}`);
}

module.exports = cleanTmpDir;
