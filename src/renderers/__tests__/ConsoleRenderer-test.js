/* eslint-env node, jest */

jest.mock('log-update');

const logUpdate = require('log-update');
const u = require('updeep');

const actionState = require('../../action/state');
const baseServer = require('../../server');
const baseAction = require('../../action');
const ConsoleRenderer = require('../ConsoleRenderer');
const createBackup = require('../../backup/createBackup');

describe('ConsoleRenderer', () => {
  let backup;
  let renderer;
  let server;

  beforeEach(() => {
    logUpdate.mockReset();
    renderer = new ConsoleRenderer();
  });

  it('renders correctly', () => {
    server = u({
      actions: [
        u({
          title: 'Completed action',
          state: actionState.COMPLETED
        }, baseAction),
        u({
          title: 'Pending action',
          state: actionState.PENDING
        }, baseAction),
        u({
          title: 'Pending action with sub-actions',
          state: actionState.PENDING,
          actions: [
            u({
              title: 'Completed sub-action 1',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Completed sub-action 2',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Failed sub-action',
              state: actionState.FAILED,
              error: 'Something went wrong'
            }, baseAction),
            u({
              title: 'Completed sub-action 3',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Skipped sub-action',
              state: actionState.SKIPPED
            }, baseAction),
            u({
              title: 'Completed sub-action 4',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Completed sub-action 5',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Completed sub-action 6',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Completed sub-action 7',
              state: actionState.COMPLETED
            }, baseAction),
            u({
              title: 'Pending sub-action',
              state: actionState.PENDING
            }, baseAction),
            u({
              title: 'Waiting sub-action 1'
            }, baseAction),
            u({
              title: 'Waiting sub-action 2'
            }, baseAction),
            u({
              title: 'Waiting sub-action 3'
            }, baseAction),
            u({
              title: 'Waiting sub-action 4'
            }, baseAction),
            u({
              title: 'Waiting sub-action 5'
            }, baseAction),
            u({
              title: 'Waiting sub-action 6'
            }, baseAction),
            u({
              title: 'Waiting sub-action 7'
            }, baseAction)
          ]
        }, baseAction),
        u({
          title: 'Failed action',
          state: actionState.FAILED,
          error: 'Something went wrong'
        }, baseAction),
        u({
          title: 'Skipped action',
          state: actionState.SKIPPED
        }, baseAction),
        u({
          title: 'Waiting action'
        }, baseAction)
      ]
    }, server);

    backup = createBackup(server, {
      duration: 83000 // 1m 23s in milliseconds
    });

    renderer.render(backup);
    renderer.end();

    expect(logUpdate.mock.calls[0][0]).toMatchSnapshot();
  });
});
