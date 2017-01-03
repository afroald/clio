function runActions(backup, connection, reporter) {
  const actions = backup.server.actions;

  return actions.reduce(async (backup, action) => {
    let updatedBackup = await backup;

    try {
      updatedBackup = await action(updatedBackup, connection, reporter);
    } catch (error) {
      reporter.taskFailed(error.message);
    }

    return updatedBackup;
  }, Promise.resolve(backup));
}

module.exports = runActions;
