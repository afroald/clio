const server = require('./server');
const createTmpDir = require('../actions/createTmpDir');

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
    
  ]
});

module.exports = vps3;
