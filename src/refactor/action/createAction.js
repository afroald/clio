const { freeze } = require('updeep');

const defaultAction = require('./action');

module.exports = function createAction(action) {
  return freeze({
    ...defaultAction,
    ...action,
  });
};
