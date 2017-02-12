const SSH = require('node-ssh');
const u = require('updeep');

const createBackup = require('./backup/createBackup');
const DebugRenderer = require('./renderers/DebugRenderer');
const reducePromises = require('./reducePromises');
const runActions = require('./action/runActions');

function getServer(serverName) {
  let server;

  try {
    server = require(`../servers/${serverName}`); // eslint-disable-line global-require, import/no-dynamic-require
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      throw new Error(`Could not find server configuration for ${serverName}`);
    }

    throw error;
  }

  return server;
}

class Backupper {
  constructor(options = {}) {
    this.connections = {};

    this.renderer = options.renderer || new DebugRenderer();
  }

  async backup(serverName) {
    const serversToBackup = [];

    serversToBackup.push(getServer(serverName));

    const backupsToRun = serversToBackup.map(server => async () => {
      let backup = createBackup(server);

      const connection = await this.getConnectionForServer(server);

      this.renderer.render(backup);

      backup = await runActions({
        actions: backup.server.actions,
        backup,
        connection,
        renderer: this.renderer
      });

      connection.dispose();

      const end = new Date();
      backup = u({
        end,
        duration: end.getTime() - backup.start.getTime()
      }, backup);

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
