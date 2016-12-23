const SSH = require('node-ssh');
const createBackup = require('./createBackup');
const createRemoteBackup = require('./steps/createRemoteBackup');

class Backupper {
  constructor() {
    this.connections = {};
  }

  async backup(server) {
    const backup = createBackup(server);
    const connection = await this.getConnectionForServer(server);
    try {
      const remoteBackup = await createRemoteBackup(backup, connection);
      console.log(remoteBackup);
    } catch (error) {
      console.log('Failed to create remote Backup');
      throw error;
    }
    connection.dispose();
    // const localBackup = await downloadBackup(remoteBackup, dest);
    // const encryptedBackup = await encryptBackup(localBackup);
  }

  async getConnectionForServer({ hostname, ssh }) {
    if (this.connections[hostname]) {
      return this.connections[hostname];
    }

    console.log('Connecting to %s', hostname);
    const client = new SSH;
    const connection = client.connect(ssh);

    this.connections[hostname] = connection;

    return connection.then(() => {
      console.log('Connected to %s', hostname);
      return connection;
    });
  }
}

module.exports = Backupper;
