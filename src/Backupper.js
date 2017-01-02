const SSH = require('node-ssh');
const createBackup = require('./createBackup');
const runActions = require('./runActions');

class Backupper {
  constructor() {
    this.connections = {};
  }

  async backup(server) {
    const backup = createBackup(server);
    const connection = await this.getConnectionForServer(server);

    // Execute all actions for this server
    // TODO: handle errors
    await runActions(backup, connection);

    connection.dispose();
  }

  async getConnectionForServer({ hostname, ssh }) {
    if (this.connections[hostname]) {
      return this.connections[hostname];
    }

    console.log('Connecting to %s', hostname);
    const client = new SSH();
    const connection = client.connect(ssh);

    this.connections[hostname] = connection;

    return connection.then(() => {
      console.log('Connected to %s', hostname);
      return connection;
    });
  }
}

module.exports = Backupper;
