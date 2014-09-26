var api = {}

api.setParam = function (opt) {
  this.params = opt
}

api.loadRepo = function (token, cb) {
  //Grab github data
  var url = "https://api.bitbucket.org/2.0/repositories/" + this.params['user']
  var request = new XMLHttpRequest()
  request.open('GET', url + "?size=100", true)
  request.setRequestHeader("Accept", "application/vnd.github.v3+json")
  request.setRequestHeader("Authorization", "token " + token)

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      data = JSON.parse(request.responseText);
      cb(data.values)
    } else {
      cb(null)
    }
  }

  request.onerror = function() {
    cb(null)
  }

  request.send()
}

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
  var url = "https://api.bitbucket.org/2.0/repositories/" + this.params['user'] + '/' + repoId
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

