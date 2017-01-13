async function runAction(input) {
  const { connection, action, updater, renderer } = input;
  let { backup } = input;

  const skipReason = action.skip(backup);

  if (skipReason !== false) {
    // set state to skipped
    backup = updater.skipped(backup, skipReason);
  } else {
    // set state to pending
    backup = updater.pending(backup);
    renderer.render(backup);

    try {
      backup = await action.action(backup, connection);

      // set state to completed
      backup = updater.completed(backup);
    } catch (error) {
      // set state to failed
      backup = updater.failed(backup, error);
    }
  }

  renderer.render(backup);

  return backup;
}

module.exports = runAction;
