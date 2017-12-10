/* eslint-env node, jest */

const Backup = require('../Backup');

describe('Backup', () => {
  it('sets start time', async () => {
    const backup = new Backup();
    await backup.run();
    expect(backup.start).toBeInstanceOf(Date);
  });
});
