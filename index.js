require('babel-register');
require('dotenv').config();
const Backupper = require('./src/Backupper');
const { vps3 } = require('./src/servers');

const backupper = new Backupper();

backupper.backup(vps3);

// Steps:
// 1. Create backup file(s) on remote
// 2. Download file(s) to disk
// 3. Encrypt files with GPG
// 4. Delete old backups

