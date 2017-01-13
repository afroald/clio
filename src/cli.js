const dotenv = require('dotenv');
const meow = require('meow');
const path = require('path');

dotenv.config({
  path: path.join(__dirname, '../.env')
});

const Backupper = require('./Backupper');

function cli() {
  const cli = meow([
    'Usage',
    '  clio [server]'
  ]);

  const serverName = cli.input[0];
  const backupper = new Backupper();

  backupper.backup(serverName)
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = cli;
