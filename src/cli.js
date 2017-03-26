const dotenv = require('dotenv');
const meow = require('meow');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env'),
});

const Backupper = require('./Backupper');
const ConsoleRenderer = require('./renderers/ConsoleRenderer');

function cli() {
  const terminal = meow([
    'Usage',
    '  clio [server]',
  ]);

  const serverName = terminal.input[0];
  const renderer = new ConsoleRenderer();
  const backupper = new Backupper({ renderer });

  backupper.backup(serverName)
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = cli;
