/** @jsx React.DOM */
var RepoHeader = React.createClass({
  render: function () {
    return (
      <tr>
        <th><input type="checkbox" name="checkAll" value="1" onChange={this.props.onToggleAll} /></th>
        <th>You have {this.props.repoCount} repos.</th>
        <th><button onClick={this.props.onRemoveAll} >Remove All</button></th>
      </tr>
    )
  }
})

var RepoItem = React.createClass({
  delete: function (e) {
  },
  getInitialState: function() {
    return {id: this.props.id, url: this.props.repo.html_url};
  },
  componentDidMount: function () {
    if (this.isMounted()) {
      this.setState({id: this.props.id, url: this.props.repo.html_url}) 
    }
  },

  render: function() {
    var url = "http://github.com" + this.props.repo.full_name;
    return (
      <tr className="repoItem">
        <td><input type="checkbox" value={this.state.id} name="selectedRepo" checked={this.props.checked} /></td>
        <td><a href={this.props.repo.html_url}>{this.props.repo.name}</a></td>
        <td><button onClick={this.props.onDestroy}>Delete</button></td>
      </tr>
    )
  }
})

var RepoBox = React.createClass({
  getInitialState: function() {
    var token;
    if (token = sessionStorage.getItem("access_token")) {
      this.props.access_token = token;
      return {authorized: true}
    }
    return {authorized: false, checkAll: false, repoCount: 0};
  },

  componentDidMount: function () {
    if (this.state.authorized) {
      this.loadRepo(this.props.access_token, function (data) {
        if (data) {
          this.props.repo = data
          this.setState({authorized: true, repoCount: data.length})
        } else {
          this.setState({authorized: false})
        }
      }.bind(this))
    }
  },

  loadRepo: function (token, cb) {
    //Grab github data
    var url = "https://api.github.com/user/"
    var request = new XMLHttpRequest();
    request.open('GET', url + "repos", true);
    request.setRequestHeader("Accept", "application/vnd.github.v3+json")
    request.setRequestHeader("Authorization", "token " + token)

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        data = JSON.parse(request.responseText);
        cb(data)
      } else {
        cb(null)
      }
    };

    request.onerror = function() {
      cb(null)
    };

    request.send();
  },
  
  toggleAll: function (e) {
    //e.target.checked
    this.setState({checkAll: !this.state.checkAll})
  },

  destroyAll: function (e) {
    e.preventDefault();   
  },
  
  toggle: function (repo) {
    this.props.selected = this.props.selected || [];
    if (e.target.checked) {
      this.props.selected.push(repo.id)
    } else {
      this.props.selected = this.props.selected.filter(function (r) {
        return r.id != repo.id
      })
    }
  },

  destroy: function (repo) {
    if (alert("Are you sure to remove " + repo.name))  {
      return false 
    }
    this.props.repo = this.props.repo.filter(function (r) {
      return r.id != repo.id
    })
    this.setState({repoCount: this.props.repo.length})
  },

  handleFetch: function (e) {
    e.preventDefault();
    OAuth.initialize('ei8Oo3tvYIssBSbrxeaxVi5v9Ck') 
    OAuth.popup('github')
    .done(function(result) { 
      if (result.access_token) {
        sessionStorage.setItem("access_token", result.access_token);
        this.props.access_token = result.access_token
        this.loadRepo(result.access_token, function (data) {
          if (data) {
            this.props.repo = data
            this.setState({authorized: true, repoCount: data.length});
          } else {
            this.setState({authorized: false})
          }
        }.bind(this))
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
        <h4>Your repos</h4>
        <button onClick={this.handleFetch}>Login</button>
        </div>
      );
    }
    if (typeof this.props.repo == 'undefined') {
      return (
        <div>
          <h4>Fetching your repo...</h4>
        </div>
      );
    }
    var rows = []
    this.props.repo.forEach(function (repo) {
      rows.push(<RepoItem 
                repo={repo} 
                key={repo.id} 
                id={repo.id} 
                checked={this.state.checkAll? "checked":''}
                onDestroy={this.destroy.bind(this, repo)}
                onToggle={this.toggle.bind(this, repo)}
                />)
    }.bind(this))
    return (
      <table>
      <thead>
        <RepoHeader 
        repoCount={this.state.repoCount}
        onToggleAll={this.toggleAll}
        onRemoveAll={this.destroyAll}
        />
      </thead>
      <tbody>
      {rows}
      </tbody>
      </table>
    );
  }
});

React.renderComponent(
  <RepoBox />,
  document.getElementById('app')
);
