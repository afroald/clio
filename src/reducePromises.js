function reducePromises(tasks) {
  return tasks.reduce((previousPromise, task) => {
    return previousPromise.then((values) => {
      return task().then(value => [].concat(values, [value]));
    });
  }, Promise.resolve([]));
}

module.exports = reducePromises;
