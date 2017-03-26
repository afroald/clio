/* eslint-disable no-console */

const meow = require('meow');
const path = require('path');

const Backupper = require('./Backupper');
const ConsoleRenderer = require('./renderers/ConsoleRenderer');

function backupCommand(config, serverName) {
  const renderer = new ConsoleRenderer();
  const backupper = new Backupper(Object.assign({}, config, { renderer }));

  backupper.backup(serverName)
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

function listCommand(config) {
  console.log('Available server configurations:');
  config.servers.forEach((server) => {
    console.log(`  - ${server.hostname}`);
  });
}

function cli() {
  const terminal = meow([
    'Usage',
    '  clio [command]',
  ]);

  const command = terminal.input[0];
  const config = require(path.resolve('/etc/clio', 'clio.config')); // eslint-disable-line

  switch (command) {
    case 'backup':
      backupCommand(config, terminal.input[1]);
      break;
    case 'list':
      listCommand(config);
      break;
    default:
      console.error('No command specified');
      terminal.showHelp(1);
      break;
  }
}

module.exports = cli;
