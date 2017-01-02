const chalk = require('chalk');
const moment = require('moment');
const ora = require('ora');

class ConsoleReporter {
  constructor() {
    this.ora = ora();
  }

  write(message) {
    process.stdout.write(`${message}\n`);
  }

  onBackupStart(backup) {
    this.write(chalk.bold(`Backing up ${backup.server.hostname}`));
  }

  onBackupEnd(backup) {
    const formattedDuration = `${moment.duration(backup.duration).asSeconds()}s`;
    this.write(`✨  Done in ${formattedDuration}.`);
  }

  onTaskStart(description) {
    this.ora.text = description;
    this.ora.start();
  }

  onTaskEnd(succeeded = true) {
    if (succeeded) {
      this.ora.succeed();
    } else {
      this.ora.fail();
    }
  }

  onError() {}
}

module.exports = ConsoleReporter;
