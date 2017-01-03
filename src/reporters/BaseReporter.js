class BaseReporter {
  backupStart(backup) {}
  backupEnd(backup) {}
  taskStart(description) {}
  taskSucceeded() {}
  taskFailed(reason) {}
  taskSkipped(reason) {}
  error(error) {}
}

module.exports = BaseReporter;
