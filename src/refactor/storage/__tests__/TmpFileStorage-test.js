/* eslint-env node, jest */

const fs = require('fs');
const os = require('os');
const path = require('path');

const TmpFileStorage = require('../TmpFileStorage');

describe('TmpFileStorage', () => {
  it('deletes itself', async () => {
    const storage = new TmpFileStorage();
    await storage.destroy();
    expect(storage.destroyed).toBe(true);
    expect(fs.existsSync(storage.root)).toBe(false);
  });

  it('creates a tmp dir in os tmpdir by default', async () => {
    const storage = new TmpFileStorage();
    expect(path.dirname(storage.root)).toEqual(os.tmpdir());
    await storage.destroy();
  });
});
