const { freeze } = require('updeep');

const action = freeze({
  title: 'Base action',
  action: async backup => backup,
  skip: () => false,
  state: null
});

module.exports = action;
