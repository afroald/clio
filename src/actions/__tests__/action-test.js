/* eslint-env node, jest */

/* eslint-disable global-require */
const actions = [
  require('../archiveFiles'),
  require('../cleanLocalFiles'),
  require('../cleanRemoteFiles'),
  require('../downloadRemoteFiles'),
  require('../encryptFiles')
];
/* eslint-enable */

const actionStructure = expect.objectContaining({
  title: expect.any(String),
  action: expect.any(Function),
  skip: expect.any(Function),
  state: null
});

actions.forEach((action) => {
  describe(action.action.name, () => {
    it('should be an action', () => {
      expect(action).toEqual(actionStructure);
    });
  });
});
