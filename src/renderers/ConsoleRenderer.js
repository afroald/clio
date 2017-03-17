const chalk = require('chalk');
const elegantSpinner = require('elegant-spinner');
const indentString = require('indent-string');
const logUpdate = require('log-update');
const prettyMs = require('pretty-ms');

const { filterSubActions, getActionStats, getSymbol } = require('./utils');
const state = require('../action/state');

function renderActions(actions, spinner, level = 0) {
  let output = [];

  actions.forEach((action) => {
    const skipped = action.state === state.SKIPPED ? ` ${chalk.dim('[skipped]')}` : '';

    let actionRow = indentString(` ${getSymbol(action, spinner)} ${action.title}${skipped}`, level, '  ');
    if (action.actions) {
      actionRow += ` (${getActionStats(action)})`;
    }
    output.push(actionRow);

    if (action.actions && action.state !== state.COMPLETED) {
      const subActionsToRender = filterSubActions(action.actions);
      output = output.concat(renderActions(subActionsToRender, spinner, level + 1));
    }

    if (action.state === state.FAILED && action.error) {
      output.push(indentString(` ${action.error}`, level + 2, '  '));
    }
  });

  return output;
}

function render(backup, spinner) {
  let output = [];

  output.push(`Backing up ${backup.server.hostname}`);

  output = output.concat(renderActions(backup.server.actions, spinner()));

  if (backup.duration) {
    output.push(` ✨ Done in ${prettyMs(backup.duration)}`);
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
