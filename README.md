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
container if changes are wanted. This is enforced by using [Updeep](https://www.npmjs.com/package/updeep).

## Experiments
- async/await
- TDD with [Jest](http://facebook.github.io/jest/)
- Less classical inheritance ([Classical Inheritance is Obsolete](https://vimeo.com/69255635))

## To do
- `backup` should be a state store with defined mutations, instead of just an immutable object
- The cli should be a separate package?

- Verbose renderer
- Add Slack notifications
- Make project easier to start using
- Possibility to configure how many backups to keep
- Move files instead of copying then when archiving
- Refactor server concept into more generic device?
- Rename actions to tasks?
- Replace custom store with vuex?
