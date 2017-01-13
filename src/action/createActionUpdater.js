const u = require('updeep');

const state = require('./state');

function findActionIndex(actions, actionToFind) {
  const index = actions.findIndex(action => action.action === actionToFind.action);

  if (index === -1) {
    const error = new Error('Action not found in backup');
    error.actions = actions;
    error.action = actionToFind;
    throw error;
  }

  return index;
}

function createUpdater(backup, action, subAction) {
  const index = findActionIndex(backup.server.actions, action);
  let updater;

  if (subAction) {
    const subIndex = findActionIndex(backup.server.actions[index].actions, subAction);

    updater = function createActionUpdate(update) {
      return {
        server: {
          actions: {
            [index]: {
              actions: {
                [subIndex]: update
              }
            }
          }
        }
      };
    };
  } else {
    updater = function createActionUpdate(update) {
      return {
        server: {
          actions: {
            [index]: update
          }
        }
      };
    };
  }

  return updater;
}

function createActionUpdater(originalBackup, action, subAction) {
  const createUpdate = createUpdater(originalBackup, action, subAction);

  return {
    setSubActions(backup, subActions) {
      return u(createUpdate({
        actions: subActions
      }), backup);
    },

    setState(backup, newState) {
      return u(createUpdate({ state: newState }), backup);
    },

    pending(backup) {
      return this.setState(backup, state.PENDING);
    },

    completed(backup) {
      return this.setState(backup, state.COMPLETED);
    },

    failed(backup, error) {
      return u(createUpdate({
        state: state.FAILED,
        error
      }), backup);
    },

    skipped(backup, reason = '') {
      return u(createUpdate({
        state: state.SKIPPED,
        reason
      }), backup);
    }
  };
}

module.exports = createActionUpdater;
