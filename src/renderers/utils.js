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
