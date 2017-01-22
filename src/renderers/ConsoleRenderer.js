const chalk = require('chalk');
const elegantSpinner = require('elegant-spinner');
const figures = require('figures');
const indentString = require('indent-string');
const logSymbols = require('log-symbols');
const logUpdate = require('log-update');
const moment = require('moment');

const state = require('../action/state');

const pointer = chalk.yellow(figures.pointer);
const skippedSymbol = chalk.yellow(figures.arrowDown);

function getSymbol(action, spinner) {
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
}

function renderActions(actions, spinner, level = 0) {
  let output = [];

  actions.forEach((action) => {
    const skipped = action.state === state.SKIPPED ? ` ${chalk.dim('[skipped]')}` : '';

    output.push(indentString(` ${getSymbol(action, spinner)} ${action.title}${skipped}`, level, '  '));

    if (action.actions && action.state !== state.COMPLETED) {
      output = output.concat(renderActions(action.actions, spinner, level + 1));
    }

    if (action.state === state.FAILED) {
      output.push(action.error);
    }
  });

  return output;
}

function render(backup, spinner) {
  let output = [];

  output.push(`Backing up ${backup.server.hostname}`);

  output = output.concat(renderActions(backup.server.actions, spinner()));

  if (backup.duration) {
    const duration = moment.duration(backup.duration);
    output.push(`✨  Done in ${duration.minutes()}m ${duration.seconds()}`);
  }

  logUpdate(output.join('\n'));
}

class ConsoleRenderer {
  constructor() {
    this.timer = null;
    this.backup = null;
    this.spinner = elegantSpinner();
  }

  render(updatedBackup) {
    this.backup = updatedBackup;

    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      render(this.backup, this.spinner);
    }, 100);
  }

  end() {
    clearInterval(this.timer);
    this.timer = null;

    render(this.backup, this.spinner);

    logUpdate.done();
  }
}

module.exports = ConsoleRenderer;
