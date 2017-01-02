async function runActions(backup, connection) {
  const actions = backup.server.actions;

  return actions.reduce((previousStep, step) => {
    return previousStep.then(updatedBackup => {
      console.log(`Running ${step.name} on remote`);
      return step(updatedBackup, connection);
    });
  }, Promise.resolve(backup));
}

module.exports = runActions;
