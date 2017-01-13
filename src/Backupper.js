const SSH = require('node-ssh');
const u = require('updeep');

const actionUpdater = require('./action/actionUpdater');
const createBackup = require('./createBackup');
const DebugRenderer = require('./renderers/DebugRenderer');
const reducePromises = require('./reducePromises');

function getServer(serverName) {
  let server;

  try {
    server = require(`../servers/${serverName}`);
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

    // console.log('Backing up servers:');
    // serversToBackup.forEach(server => console.log(`- ${server.hostname}`));

    const backupsToRun = serversToBackup.map(server => async () => {
      let backup = createBackup(server);

      const connection = await this.getConnectionForServer(server);

      this.renderer.render(backup);

      // Execute all actions for this server
      // TODO: handle errors
      const finishedBackup = await server.actions.reduce(async (previousAction, action) => {
        let backup = await previousAction;

        const updater = actionUpdater(action);
        const skipReason = action.skip(backup);

        if (skipReason !== false) {
          // set state to skipped
          backup = updater.skipped(backup, skipReason);
        } else {
          // set state to pending
          backup = updater.pending(backup);
          this.renderer.render(backup);

          try {
            backup = await action.action(backup, connection);
            // set state to completed
            backup = updater.completed(backup);
          } catch (error) {
            // set state to failed
            backup = updater.failed(backup, error);
          }
        }

        this.renderer.render(backup);

        return backup;
      }, Promise.resolve(backup));

      this.renderer.render(finishedBackup);

      connection.dispose();

      const end = new Date();
      backup = u({
        end,
        duration: end.getTime() - backup.start.getTime()
      }, backup);
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

    return connection.then(() => {
      return connection;
    });
  }
}

module.exports = Backupper;
