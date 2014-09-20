/** @jsx React.DOM */
var React = require('react')
   ,OAuth = require('oauth');

var RepoHeader = React.createClass({
  render: function () {
    return (
      <tr>
        <th><input type="checkbox" name="checkAll" value="1" onChange={this.props.onToggleAll} /></th>
        <th>You have {this.props.repoCount} repos.</th>
        <th><button className="pure-button pure-button-primary" onClick={this.props.onRemoveAll} >Remove Selected({this.props.selectedCount})</button></th>
      </tr>
    )
  }
})

var RepoItem = React.createClass({
  getInitialState: function() {
    return {id: this.props.id, url: this.props.repo.html_url}
  },

  componentDidMount: function () {
    if (this.isMounted()) {
      this.setState({id: this.props.id, url: this.props.repo.html_url}) 
    }
  },

  render: function() {
    var url = "http://github.com" + this.props.repo.full_name

    return (
      <tr className={"repoItem " + (this.props.repo.isRemoving? 'isRemoving':'')}>
        <td><input type="checkbox" value={this.state.id} name="selectedRepo" checked={this.props.checked} onChange={this.props.onToggle} /></td>
        <td><a href={this.props.repo.html_url}>{this.props.repo.name}</a></td>
        <td>
          <button className="pure-button" onClick={this.props.onDestroy}>Delete</button>
          <div className="load-container">
            Removing...
            <div className="loaderbar">Removing...</div>
          </div>  
        </td>

      </tr>
    )
  }
})

var RepoBox = React.createClass({
  getInitialState: function() {
    var token;
    if (token = sessionStorage.getItem("access_token")) {
      this.props.access_token = token;
      return {authorized: true, selected: []}
    }
    return {authorized: false, selected: [], repoCount: 0};
  },

  componentDidMount: function () {
    if (this.state.authorized) {
      this.loadRepo(this.props.access_token, this.setRepo.bind(this))
    }
  },

  removeRepo: function (token, repoId, cb) {
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
  },

  loadRepo: function (token, cb) {
    //Grab github data
    var url = "https://api.github.com/user/"
    var request = new XMLHttpRequest()
    request.open('GET', url + "repos?per_page=100", true)
    request.setRequestHeader("Accept", "application/vnd.github.v3+json")
    request.setRequestHeader("Authorization", "token " + token)

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        data = JSON.parse(request.responseText);
        cb(data)
      } else {
        cb(null)
      }
    }

    request.onerror = function() {
      cb(null)
    }

    request.send()
  },

  setRepo: function (data) {
    if (data) {
      this.setState({authorized: true, repo: data})
    } else {
      this.setState({authorized: false})
    }
    this.setState({selected: []}) 
  },
  
  toggleAll: function (e) {
    var selected =[]
    if (e.target.checked) {
      selected = this.state.repo.map(function (r, index) {
        return index
      })
    }
    console.log(selected)
    this.setState({selected: selected})
  },

  destroyAll: function (e) {
    e.preventDefault();   
    if (!confirm("Are you sure to remove multiple repos at a time. Be careful, have no undo action!!!")) {
      return;
    }
    var repo = this.state.repo.filter(function (repo, repoIndex) {
      if (this.state.selected.indexOf(repoIndex)>=0) {
        //console.log("Remove Repo " + "https://api.github.com/repos/" + repo.full_name)
        //this.removeRepo(this.props.access_token, repo, function () {
        
        //})
        //return false
        return this.destroy(repo, repoIndex)
      }
      return true
    }.bind(this))
    this.setState({repo: repo, selected: []})
  },
  
  toggle: function (repo, index) {
    var selected = this.state.selected || [];
    if (selected.indexOf(index)>=0) {
      selected = selected.filter(function (repoIndex) {
        return index != repoIndex
      })
    } else {
      selected.push(index)
    }
    this.setState({selected: selected})
  },

  destroy: function (repo, index) {
    if (!confirm("Are you sure to remove " + repo.name))  {
      return false 
    }
    this.removeRepo(this.props.access_token, repo, function (result) {
      var repo = this.state.repo.filter(function (r, repoIndex) {
        //unchecked it
        if (index == repoIndex && this.state.selected.indexOf(repoIndex)>=0) {
          var selected = this.state.selected || [];
          selected = selected.filter(function (repoIndex) {
            return index != repoIndex
          })
          this.setState({selected: selected})
        }
        return index != repoIndex
      }.bind(this))
      this.setState({repo: repo})
    }.bind(this))
  },

  handleFetch: function (e) {
    e.preventDefault();
    OAuth.initialize('ei8Oo3tvYIssBSbrxeaxVi5v9Ck') 
    OAuth.popup('github')
    .done(function(result) { 
      if (result.access_token) {
        sessionStorage.setItem("access_token", result.access_token);
        this.props.access_token = result.access_token
        this.loadRepo(result.access_token, this.setRepo.bind(this))
      } else {
        this.setState({authorized: false});
        return
      }
    }.bind(this))
    .fail(function () {
      this.setState({authorized: false});
    }.bind(this))
  },

  render: function() {
    if (!this.state.authorized) {
      return (
        <div className="repoBox">
        <h4>Please login to Github to authorize permission</h4>
        <button className="pure-button pure-primary-button" onClick={this.handleFetch}>Login via Github</button>
        </div>
      );
    }
    if (typeof this.state.repo == 'undefined') {
      return (
        <div  className="loader-container">
          <h4>Fetching your repo...</h4>
            <div className="loader"></div>
        </div>
      );
    }
    var rows = []
    this.state.repo.forEach(function (repo, index) {
      rows.push(<RepoItem 
                repo={repo} 
                key={repo.id} 
                id={repo.id} 
                checked={this.state.selected.indexOf(index)>=0? "checked":''}
                onDestroy={this.destroy.bind(this, repo, index)}
                onToggle={this.toggle.bind(this, repo, index)}
                />)
    }.bind(this))
    return (
      <table className="pure-table pure-table-horizontal">
      <thead>
        <RepoHeader 
        repoCount={this.state.repo.length}
        selectedCount={this.state.selected.length}
        onToggleAll={this.toggleAll}
        onRemoveAll={this.destroyAll}
        />
      </thead>
      <tbody>
      {rows}
      </tbody>
      <tfoot>
        <RepoHeader 
        repoCount={this.state.repo.length}
        onToggleAll={this.toggleAll}
          onRemoveAll={this.destroyAll}
        />
      </tfoot>
      </table>
    );
  }
});

module.exports = {
  RepoHeader: RepoHeader,
  RepoItem: RepoItem,
  RepoBox: RepoBox
}
