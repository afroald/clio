async function createRemoteBackup(backup, connection) {
  return backup.server.actions.reduce((previousStep, step) => {
    return previousStep.then(() => step(backup, connection));
  }, Promise.resolve(backup));
}

module.exports = createRemoteBackup;
