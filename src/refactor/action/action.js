const { freeze } = require('updeep');

const action = freeze({
  title: 'Action',
  state: null,
  async action(store) {},
  async skip() {
    return false;
  },
});

module.exports = action;
