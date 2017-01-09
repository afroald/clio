const dotenv = require('dotenv');
const meow = require('meow');
const path = require('path');
const util = require('util');

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const Backupper = require('./Backupper');
const ConsoleReporter = require('./reporters/ConsoleReporter');



function cli() {
  const cli = meow([
    'Usage',
    '  clio [server]'
  ]);

  const serverName = cli.input[0];
  const reporter = new ConsoleReporter();
  const backupper = new Backupper({ reporter });

  backupper.backup(serverName)
    .catch((error) => {
      reporter.error(error);
      process.exitCode = 1;
    });
}

module.exports = cli;
