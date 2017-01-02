async function runActions(backup, connection, reporter) {
  const actions = backup.server.actions;

  return actions.reduce((previousStep, step) => {
    return previousStep.then((updatedBackup) => {
      return step(updatedBackup, connection, reporter);
    });
  }, Promise.resolve(backup));
}

module.exports = runActions;
