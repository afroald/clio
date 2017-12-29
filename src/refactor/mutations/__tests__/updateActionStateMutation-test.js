/* eslint-env node, jest */

const { freeze } = require('updeep');
const merge = require('deepmerge');
const states = require('../../action/actionStates');
const createAction = require('../../action/createAction');
const updateActionStateMutation = require('../updateActionStateMutation');

describe('updateActionStateMutation', () => {
  let testAction = null;
  let originalState = null;
  let state = null;

  beforeEach(() => {
    testAction = createAction({ title: 'Test Action' });
    originalState = freeze({
      actions: [testAction],
    });
    state = merge({}, originalState);
  });

  it('updates action state', () => {
    updateActionStateMutation(state, { action: testAction, state: states.PENDING });

    expect(state).toEqual(expect.objectContaining({
      actions: expect.arrayContaining([
        expect.objectContaining({
          state: states.PENDING,
        }),
      ]),
    }));
  });

  it('adds error when needed', () => {
    updateActionStateMutation(state, {
      action: testAction,
      state: states.FAILED,
      error: new Error('Test error'),
    });

    expect(state).toEqual(expect.objectContaining({
      actions: expect.arrayContaining([
        expect.objectContaining({
          state: states.FAILED,
          error: expect.any(Error),
        }),
      ]),
    }));
  });

  it('throws error when invalid state is given', () => {
    expect(() => {
      updateActionStateMutation(state, {
        action: testAction,
        state: 'invalid state',
      });
    }).toThrow();
  });
});
