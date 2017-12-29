const states = require('./actionStates');

async function runAction(store, action) {
  store.commit('updateActionState', { action, state: states.RUNNING });

  if (await action.skip(store.state)) {
    store.commit('updateActionState', { action, state: states.SKIPPED });
    return;
  }

  try {
    await action.action(store);
    store.commit('updateActionState', { action, state: states.COMPLETED });
  } catch (error) {
    store.commit('updateActionState', { action, state: states.FAILED, error });
  }
}

module.exports = runAction;
