/* eslint-env node, jest */

const actions = [
  require('../cleanRemoteFiles'),
  require('../createGitlabBackup')
];

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
