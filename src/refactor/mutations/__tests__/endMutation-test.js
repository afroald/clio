/* eslint-env node, jest */

const { states: backupStates } = require('../../Backup');
const endMutation = require('../endMutation');

describe('endMutation', () => {
  it('should set the end date to now', () => {
    const backup = {
      state: backupStates.NEW,
      end: null,
    };

    endMutation(backup);

    expect(backup.state).toEqual(backupStates.FINISHED);
    expect(backup.end).toBeInstanceOf(Date);
  });
});
