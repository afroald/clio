/* eslint-disable no-param-reassign, no-shadow */
const states = require('../action/actionStates');

function updateActionStateMutation(backupState, { action: actionToUpdate, state, error }) {
  if (!Object.values(states).includes(state)) {
    throw new Error('Invalid action state.');
  }

  const action = backupState.actions.find(action => action.action === actionToUpdate.action);

  if (!action) {
    throw new Error('Action to update not found.');
  }

  const index = backupState.actions.indexOf(action);

  backupState.actions.splice(index, 1, {
    ...action,
    state,
  });

  if (error) {
    backupState.actions[index].error = error;
  }
}

module.exports = updateActionStateMutation;
