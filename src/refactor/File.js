const { freeze } = require('updeep');

function File(path, attributes = {}) {
  if (!path) {
    throw new Error('No path set.');
  }

  this.path = path;
  this.attributes = attributes;

  freeze(this);
}

module.exports = File;
