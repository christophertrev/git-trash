/** @jsx React.DOM */
var RepoItem = React.createClass({
  delete: function (e) {
    console.log('Delete this repo' + this.props.repo.id)
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
    var url = "http://github.com" + this.props.repo.full_name
    return (
      <tr className="repoItem">
        <td><input type="checkbox" value={this.state.id} name="selectedRepo"/></td>
        <td><a href={this.props.repo.html_url}>{this.props.repo.name} {this.props.repo.html_url} {this.props.id}</a></td>
        <td><button onClick={this.delete}>Delete</button></td>
      </tr>
    )
  }
})

var RepoBox = React.createClass({
  getInitialState: function() {
    var token;
    if (token = sessionStorage.getItem("access_token")) {
      this.props.access_token = token
      return {authorized: true}
    }
    return {authorized: false};
  },

  componentDidMount: function () {
    if (this.state.authorized) {
      this.loadRepo(this.props.access_token, function (data) {
        if (data) {
          this.props.repo = data
          this.setState({authorized: true})
        } else {
          this.setState({authorized: false})
        }
      }.bind(this))
    }
  },

  loadRepo: function (token, cb) {
    //Grab github data
    var url = "https://api.github.com/user/"
    $.ajax(url + "repos", {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "token " + token
      },
      contentType: 'JSON'
    })
    .done(function (data) {
      cb(data)
    })
    .fail(function () {
      cb(null)
    })
  },
  
  multiToggle: function (e) {
    $('.repoItem input[type=checkbox]').prop("checked", $(e.target).prop("checked"))
  },

  handleFetch: function (e) {
    //http://stackoverflow.com/questions/24073392/onclick-is-firing-right-away
    e.preventDefault();
    OAuth.initialize('ei8Oo3tvYIssBSbrxeaxVi5v9Ck') //OAuth.io public key
    OAuth.popup('github')
    .done(function(result) { //OAuth.io provider
      if (result.access_token) {
        sessionStorage.setItem("access_token", result.access_token);
        this.props.access_token = result.access_token
        this.loadRepo(result.access_token, function (data) {
          if (data) {
            this.props.repo = data
            this.setState({authorized: true});
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
      console.log("Fail")  
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
      rows.push(<RepoItem repo={repo} key={repo.id} id={repo.id} />)
    }.bind(this))
    return (
      <table>
      <thead>
      <tr>
      <th><input type="checkbox" name="checkAll" value="1" onChange={this.multiToggle} /></th>
      <th>Name</th>
      <th></th>
      </tr>
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
