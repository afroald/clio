/* eslint-env node, jest */

const reducePromises = require('../reducePromises');

describe('reducePromises', () => {
  const tasks = [
    async () => 'value1',
    async () => 'value2',
    async () => 'value3'
  ];

  it('should return a promise', () => {
    const promise = reducePromises(tasks);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should resolve to an array of values', async () => {
    const values = await reducePromises(tasks);

    expect(values).toEqual(expect.arrayContaining([
      'value1',
      'value2',
      'value3'
    ]));
  });

  it('should reject when a task fails', async () => {
    const failingTasks = [
      async () => 'value1',
      async () => {
        throw new Error('task failed');
      },
      async () => 'value3'
    ];

    let errorThrown = false;

    try {
      await reducePromises(failingTasks);
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(Error);
    }

    expect(errorThrown).toBe(true);
  });
});
