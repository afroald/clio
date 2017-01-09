# Clio
https://en.wikipedia.org/wiki/Clio

## The idea
This is a framework for creating automated backups. Usually it's not a good idea for servers to have the responsibility
to make backup of themselves. This system is designed to run separately from the servers that need to be backed up.

Server configuration is just code, so it's easy to create any custom backup flow.

## Architecture
Each server configuration contains details about how to connect to it and which actions should be performed to complete
a backup.

When running a backup an immutable backup state container is created. This should contain all the information needed to
perform the backup.

Actions are pure functions that receive the backup state container and return a promise that resolves with the backup
state container. Actions may not modify the state container. They should resolve with a modified copy of the state
container if changes are wanted.

## To do
- Logging (log backup state changes?)
- Handle backup errors properly
- Make console output nicer
- Add Slack notifications
