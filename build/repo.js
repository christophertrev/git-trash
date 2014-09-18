/** @jsx React.DOM */
var RepoHeader = React.createClass({displayName: 'RepoHeader',
  render: function () {
    return (
      React.DOM.tr(null, 
        React.DOM.th(null, React.DOM.input({type: "checkbox", name: "checkAll", value: "1", onChange: this.props.onToggleAll})), 
        React.DOM.th(null, "You have ", this.props.repoCount, " repos."), 
        React.DOM.th(null, React.DOM.button({className: "pure-button pure-button-primary", onClick: this.props.onRemoveAll}, "Remove Selected"))
      )
    )
  }
})

var RepoItem = React.createClass({displayName: 'RepoItem',
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
      React.DOM.tr({className: "repoItem"}, 
        React.DOM.td(null, React.DOM.input({type: "checkbox", value: this.state.id, name: "selectedRepo", checked: this.props.checked, onChange: this.props.onToggle})), 
        React.DOM.td(null, React.DOM.a({href: this.props.repo.html_url}, this.props.repo.name)), 
        React.DOM.td(null, React.DOM.button({className: "pure-button", onClick: this.props.onDestroy}, "Delete"))
      )
    )
  }
})

var RepoBox = React.createClass({displayName: 'RepoBox',
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
    var repo = this.state.repo.filter(function (repo, repoIndex) {
      if (this.state.selected.indexOf(repoIndex)>=0) {
        console.log("Remove Repo " + repoIndex)
        return false
      }
      return true
    }.bind(this))
    this.setState({repo: repo, selected: []})
  },
  
  toggle: function (repo, index) {
    console.log(index)
    var selected = this.state.selected || [];
    if (selected.indexOf(index)>=0) {
      selected = selected.filter(function (repoIndex) {
        return index != repoIndex
      })
    } else {
      selected.push(index)
    }
    console.log(selected)
    this.setState({selected: selected})
  },

  destroy: function (repo, index) {
    if (alert("Are you sure to remove " + repo.name))  {
      return false 
    }
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
        React.DOM.div({className: "repoBox"}, 
        React.DOM.h4(null, "Please login to Github to authorize permission"), 
        React.DOM.button({className: "pure-button pure-primary-button", onClick: this.handleFetch}, "Login via Github")
        )
      );
    }
    if (typeof this.state.repo == 'undefined') {
      return (
        React.DOM.div(null, 
          React.DOM.h4(null, "Fetching your repo...")
        )
      );
    }
    var rows = []
    this.state.repo.forEach(function (repo, index) {
      rows.push(RepoItem({
                repo: repo, 
                key: repo.id, 
                id: repo.id, 
                checked: this.state.selected.indexOf(index)>=0? "checked":'', 
                onDestroy: this.destroy.bind(this, repo, index), 
                onToggle: this.toggle.bind(this, repo, index)}
                ))
    }.bind(this))
    return (
      React.DOM.table({className: "pure-table pure-table-horizontal"}, 
      React.DOM.thead(null, 
        RepoHeader({
        repoCount: this.state.repo.length, 
        onToggleAll: this.toggleAll, 
        onRemoveAll: this.destroyAll}
        )
      ), 
      React.DOM.tbody(null, 
      rows
      ), 
      React.DOM.tfoot(null, 
        RepoHeader({
        repoCount: this.state.repo.length, 
        onToggleAll: this.toggleAll, 
          onRemoveAll: this.destroyAll}
        )
      )
      )
    );
  }
});

React.renderComponent(
  RepoBox(null),
  document.getElementById('app')
);
