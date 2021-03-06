/* eslint-env node, jest */

const Store = require('../Store');

describe('Store', () => {
  it('should have empty object as default state', () => {
    const store = new Store();
    expect(store.state).toEqual({});
  });

  it('should set initial state', () => {
    const store = new Store({
      state: {
        test: true,
      },
    });

    expect(store.state).toEqual({ test: true });
  });

  it('should have immutable state', () => {
    const store = new Store({
      state: {
        test: true,
      },
    });

    expect(Object.isFrozen(store.state)).toBe(true);

    store.state.test = false;
    expect(store.state.test).toBe(true);
  });

  it('should mutate', () => {
    const store = new Store({
      state: {
        count: 0,
      },
      mutations: {
        increment: function increment(state) {
          state.count += 1; // eslint-disable-line no-param-reassign
        },
      },
    });

    store.commit('increment');

    expect(store.state.count).toBe(1);
  });

  it('should pass property lookups', () => {
    const store = new Store({
      state: {
        foo: 'bar',
      },
    });

    expect(store.foo).toEqual('bar');
  });
});
