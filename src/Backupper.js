const SSH = require('node-ssh');
const u = require('updeep');

const createBackup = require('./backup/createBackup');
const createBackupTmpDir = require('./backup/createBackupTmpDir');
const cleanBackupTmpDir = require('./backup/cleanBackupTmpDir');
const DebugRenderer = require('./renderers/DebugRenderer');
const reducePromises = require('./reducePromises');
const runActions = require('./action/runActions');

class Backupper {
  constructor(config = {}) {
    this.connections = {};
    this.config = config;

    this.renderer = config.renderer || new DebugRenderer();
  }

  async backup(serverName) {
    let serversToBackup;

    if (serverName === 'all') {
      serversToBackup = this.config.servers;
    } else {
      const serverToBackup = this.config.servers.find(server => server.hostname === serverName);
      serversToBackup = [serverToBackup];
    }

    const backupsToRun = serversToBackup.map(server => async () => {
      let backup = createBackup(server, {
        config: {
          gpg: {
            recipient: this.config.gpg.recipient,
          },
          paths: {
            storage: this.config.paths.storage,
            tmp: this.config.paths.tmp,
          },
        },
      });
      backup = await createBackupTmpDir(backup);

      const connection = await this.getConnectionForServer(server);

      this.renderer.render(backup);

      backup = await runActions({
        actions: backup.server.actions,
        backup,
        connection,
        renderer: this.renderer,
      });

      connection.dispose();

      const end = new Date();
      backup = u({
        end,
        duration: end.getTime() - backup.start.getTime(),
      }, backup);

      backup = await cleanBackupTmpDir(backup);

      this.renderer.render(backup);
      this.renderer.end();
    });

    await reducePromises(backupsToRun);
  }

  async getConnectionForServer({ hostname, ssh }) {
    if (this.connections[hostname]) {
      return this.connections[hostname];
    }

    const client = new SSH();
    const connection = client.connect(ssh);

    this.connections[hostname] = connection;

    return connection.then(() => connection);
  }
}

module.exports = Backupper;
