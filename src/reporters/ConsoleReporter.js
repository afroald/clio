const chalk = require('chalk');
const logSymbols = require('log-symbols');
const moment = require('moment');
const ora = require('ora');

const BaseReporter = require('./BaseReporter');

class ConsoleReporter extends BaseReporter {
  constructor() {
    super();

    this.stdout = process.stdout;
    this.stderr = process.stderr;
    this.ora = ora();
  }

  backupStart(backup) {
    this.write(chalk.bold(`Backing up ${backup.server.hostname}`));
  }

  backupEnd(backup) {
    const formattedDuration = `${moment.duration(backup.duration).asSeconds()}s`;
    this.write(`✨ Done in ${formattedDuration}.`);
  }

  taskStart(description) {
    this.ora.text = description;
    this.ora.start();
  }

  taskSucceeded() {
    this.ora.succeed();
  }

  taskFailed(reason) {
    this.ora.text += ` - Failed: ${reason}`;
    this.ora.fail();
  }

  taskSkipped(reason) {
    this.ora.text += ` - Skipped: ${reason}`;
    this.ora.stopAndPersist(logSymbols.warning);
  }

  error(error) {
    
  }

  write(message) {
    this.stdout.write(`${message}\n`);
  }
}

module.exports = ConsoleReporter;
