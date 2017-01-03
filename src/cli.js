const dotenv = require('dotenv');
const meow = require('meow');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const Backupper = require('./Backupper');
const ConsoleReporter = require('./reporters/ConsoleReporter');
const servers = require('./servers');

function cli() {
  const cli = meow([
    'Usage',
    '  clio [server]'
  ], {

  });

  const serverName = cli.input[0];
  const server = servers[serverName];
  const reporter = new ConsoleReporter();

  const backupper = new Backupper({ reporter });

  backupper.backup(server);
}

module.exports = cli;
