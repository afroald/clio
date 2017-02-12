const chalk = require('chalk');
const figures = require('figures');
const logSymbols = require('log-symbols');

const state = require('../action/state');

const pointer = chalk.yellow(figures.pointer);
const skippedSymbol = chalk.yellow(figures.arrowDown);

module.exports.getSymbol = function getSymbol(action, spinner) {
  if (action.state === state.PENDING) {
    return action.actions ? pointer : chalk.yellow(spinner);
  }

  if (action.state === state.COMPLETED) {
    return logSymbols.success;
  }

  if (action.state === state.FAILED) {
    return logSymbols.error;
  }

  if (action.state === state.SKIPPED) {
    return skippedSymbol;
  }

  return ' ';
};

module.exports.filterSubActions = function filterSubActions(subActions) {
  if (subActions.length < 9) {
    return subActions;
  }

  const completedIndexes = subActions.reduce((indexes, subAction, index) => {
    if (subAction.state !== state.COMPLETED) {
      return indexes;
    }

    return [].concat(indexes, [index]);
  }, []);
  const allowedCompleted = completedIndexes.slice(-5);

  const waitingIndexes = subActions.reduce((indexes, subAction, index) => {
    if (subAction.state !== null) {
      return indexes;
    }

    return [].concat(indexes, [index]);
  }, []);
  const allowedWaiting = waitingIndexes.slice(0, 5);

  const filteredSubActions = subActions.filter((subAction, index) => {
    if (subAction.state === state.COMPLETED) {
      return allowedCompleted.indexOf(index) !== -1;
    }

    if (subAction.state === null) {
      return allowedWaiting.indexOf(index) !== -1;
    }

    return true;
  });

  return filteredSubActions;
};

module.exports.getActionStats = function getActionStats(action) {
  if (!action.actions || action.actions.length <= 0) {
    return '';
  }

  const subActions = action.actions;
  const numTotal = subActions.length;
  const numDone = subActions.filter(subAction => subAction.state !== null && subAction.state !== state.PENDING).length;
  const numFailed = subActions.filter(subAction => subAction.state === state.FAILED).length;
  const numSkipped = subActions.filter(subAction => subAction.state === state.SKIPPED).length;

  let stats = `${numDone}/${numTotal}`;

  if (numFailed > 0) {
    stats += `, ${numFailed} failed`;
  }

  if (numSkipped > 0) {
    stats += `, ${numSkipped} skipped`;
  }

  return stats;
};
