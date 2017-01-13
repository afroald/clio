const u = require('updeep');

const state = require('./state');

function getActionIndex(backup, actionToFind) {
  const index = backup.server.actions.findIndex(action => action.action === actionToFind.action);

  if (index === -1) {
    const error = new Error('Action not found in backup');
    error.backup = backup;
    error.action = actionToFind;
    throw error;
  }

  return index;
}

function actionUpdater(action) {
  return {
    setState(backup, newState) {
      const index = getActionIndex(backup, action);
      return u.updateIn(['server', 'actions', index, 'state'], newState, backup);
    },

    pending(backup) {
      return this.setState(backup, state.PENDING);
    },

    completed(backup) {
      return this.setState(backup, state.COMPLETED);
    },

    failed(backup, error) {
      const index = getActionIndex(backup, action);

      return u({
        server: {
          actions: {
            [index]: {
              state: state.FAILED,
              error
            }
          }
        }
      }, backup);
    },

    skipped(backup, reason = '') {
      const index = getActionIndex(backup, action);

      return u({
        server: {
          actions: {
            [index]: {
              state: state.SKIPPED,
              reason
            }
          }
        }
      }, backup);
    }
  };
}

module.exports = actionUpdater;
