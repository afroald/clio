/* eslint-env node, jest */

const { states: backupStates } = require('../../Backup');
const startMutation = require('../startMutation');

describe('startMutation', () => {
  it('should set the start date to now', () => {
    const backup = {
      state: backupStates.NEW,
      start: null,
    };

    startMutation(backup);

    expect(backup.state).toEqual(backupStates.RUNNING);
    expect(backup.start).toBeInstanceOf(Date);
  });
});
