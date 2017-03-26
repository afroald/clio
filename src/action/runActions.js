const createActionUpdater = require('./createActionUpdater');
const state = require('./state');

async function runActions({ actions, backup, connection, renderer }) {
  return actions.reduce(async (previousAction, action, index) => {
    let backup = await previousAction;

    const skipReason = action.skip(backup);
    const updater = createActionUpdater(backup, action);

    if (skipReason !== false) {
      // set state to skipped
      backup = updater.skipped(backup, skipReason);
    } else {
      // set state to pending
      backup = updater.pending(backup);
      renderer.render(backup);

      try {
        backup = await action.action(backup, connection, updater);

        const subActions = backup.server.actions[index].actions;
        if (subActions) {
          backup = await subActions.reduce(async (previousSubAction, subAction) => {
            let backup = await previousSubAction;
            const updater = createActionUpdater(backup, action, subAction);

            backup = updater.pending(backup);
            renderer.render(backup);

            try {
              backup = await subAction.action(backup, connection);
              backup = updater.completed(backup);
            } catch (error) {
              backup = updater.failed(backup, error);
            }

            renderer.render(backup);

            return backup;
          }, Promise.resolve(backup));

          const failedSubActions = backup.server.actions[index].actions.filter(
            subAction => subAction.state === state.FAILED,
          );

          if (failedSubActions.length > 0) {
            backup = updater.failed(backup, new Error('One or more sub actions failed'));
          } else {
            backup = updater.completed(backup);
          }
        } else {
          // set state to completed
          backup = updater.completed(backup);
        }
      } catch (error) {
        // set state to failed
        backup = updater.failed(backup, error);
      }
    }

    return backup;
  }, Promise.resolve(backup));
}

module.exports = runActions;
