const SSH = require('node-ssh');
const u = require('updeep');

const createBackup = require('./createBackup');
const runActions = require('./runActions');

class Backupper {
  constructor({ reporter } = { reporter: null }) {
    this.connections = {};
    this.reporter = reporter;
  }

  async backup(server) {
    let backup = createBackup(server);
    this.reporter.onBackupStart(backup);

    const connection = await this.getConnectionForServer(server);

    // Execute all actions for this server
    // TODO: handle errors
    await runActions(backup, connection, this.reporter);

    connection.dispose();

    const end = new Date();
    backup = u({
      end,
      duration: end.getTime() - backup.start.getTime()
    }, backup);

    this.reporter.onBackupEnd(backup);
  }

  async getConnectionForServer({ hostname, ssh }) {
    if (this.connections[hostname]) {
      return this.connections[hostname];
    }

    this.reporter.onTaskStart('Connecting');
    const client = new SSH();
    const connection = client.connect(ssh);

    this.connections[hostname] = connection;

    return connection.then(() => {
      this.reporter.onTaskEnd();
      return connection;
    });
  }
}

module.exports = Backupper;
