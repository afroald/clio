/* eslint-env node, jest */

const states = require('../../backupStates');
const endMutation = require('../endMutation');

describe('endMutation', () => {
  it('should set the end date to now', () => {
    const backup = {
      state: states.NEW,
      start: new Date(),
      end: null,
    };

    endMutation(backup);

    expect(backup.state).toEqual(states.FINISHED);
    expect(backup.end).toBeInstanceOf(Date);
  });
});
