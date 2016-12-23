const CommandFailedError = require('../errors/CommandFailedError');
const createTmpDir = require('../actions/createTmpDir');
const cleanTmpDir = require('../actions/cleanTmpDir');
const server = require('./server');

const vps3 = Object.assign(server, {
  hostname: 'vps3',
  ssh: {
    host: process.env.VPS3_HOST,
    username: process.env.VPS3_USERNAME,
    privateKey: process.env.VPS3_PRIVATE_KEY,
    passphrase: process.env.VPS3_PASSPHRASE
  },
  actions: [
    createTmpDir,
    // async (backup, connection) => {
    //   const result = await connection.execCommand('sudo gitlab-rake gitlab:backup:create');

    //   if (result.code !== 0) {
    //     throw new CommandFailedError('backup gitlab');
    //   }

    //   const newBackup = Object.assign({}, backup);

    //   if (!newBackup.remote.log) {
    //     newBackup.remote.log = {};
    //   }


    // }
    cleanTmpDir
  ]
});

module.exports = vps3;
