async function createRemoteBackup(backup, connection) {
  const actions = backup.server.actions;

  return actions.reduce((previousStep, step) => {
    return previousStep.then(updatedBackup => step(updatedBackup, connection));
  }, Promise.resolve(backup));
}

module.exports = createRemoteBackup;
