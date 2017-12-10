/* eslint-env node, jest */

const states = require('../../backupStates');
const startMutation = require('../startMutation');

describe('startMutation', () => {
  it('should set the start date to now', () => {
    const state = {
      state: null,
      start: null,
    };

    startMutation(state);

    expect(state.state).toEqual(states.RUNNING);
    expect(state.start).toBeInstanceOf(Date);
  });
});
