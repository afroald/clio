const { freeze } = require('updeep');
const start = require('./startMutation');
const end = require('./endMutation');

module.exports = freeze({
  start,
  end,
});
