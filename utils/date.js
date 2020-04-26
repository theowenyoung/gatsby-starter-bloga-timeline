const gitP = require('simple-git/promise');
const path = require('path')
const moment = require('moment')
exports.getFileLastCommitDate = function (filePath) {
  const git = gitP(path.dirname(filePath))
  return git.log({
    file: filePath,
  }).then(data => {
    if (data && data.latest && data.latest.date) {
      return moment(data.latest.date, 'YYYY-MM-DD HH:mm:ss Z').toISOString()
    }
  })
}
