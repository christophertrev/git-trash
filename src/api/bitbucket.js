var api = {}

api.removeRepo = function (token, repoId, cb) {
  //Grab github data
  var repo = this.state.repo.map(function (repo) {
    if (repoId.id == repo.id) {
      repo.isRemoving = true
    }
    return repo
  })
  this.setState({repo: repo})
  //return;
  var url = "https://api.github.com/repos/"
  var request = new XMLHttpRequest()
  request.open('DELETE', url + repoId.full_name, true)
  request.setRequestHeader("Accept", "application/vnd.github.v3+json")
  request.setRequestHeader("Authorization", "token " + token)

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      return cb(true)
    }
    cb(false)
  }

  request.onerror = function() {
    cb(false)
  }
  request.send()
}
module.exports = api
