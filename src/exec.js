const exec = require('child_process').exec;

function promisedExec(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      return resolve({ stdout, stderr });
    });
  });
}

module.exports = promisedExec;
