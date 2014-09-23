function api(provider, token) {
  this.token = token
  this.client = require('api/' . provider . '.js')
}

api.prototype.getClient = function () {
  return this.client  
}

module.exports = api
