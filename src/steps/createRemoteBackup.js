async function createRemoteBackup(backup, connection) {
  return backup.server.actions.reduce((previousStep, step) => {
    return previousStep.then(updatedBackup => step(updatedBackup, connection));
  }, Promise.resolve(backup));
}

module.exports = createRemoteBackup;
