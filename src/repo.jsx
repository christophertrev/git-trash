/** @jsx React.DOM */
var RepoBox = React.createClass({
  handleFetch: function (e) {
    //this.setState({liked: !this.state.liked});
    //http://stackoverflow.com/questions/24073392/onclick-is-firing-right-away
    e.preventDefault();
    console.log("lol")
    e.preventDefault();
    OAuth.initialize('ei8Oo3tvYIssBSbrxeaxVi5v9Ck') //OAuth.io public key
    OAuth.popup('github')
      .done(function(result) { //OAuth.io provider
        //Grab github data
        var url = "https://api.github.com/user/"
        $.ajax(url + "repos", {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "token " + result.access_token
          },
          contentType: 'JSON'
        })
        .done(function (data) {
            console.log(data)
        })
        console.log(result)
      })
      .fail(function () {
        console.log("Fail")  
      })
  },
  render: function() {
    var t = this
    return (
      <div className="repoBox">
        <h4>Your repos</h4>
        <button onClick={this.handleFetch}>Login</button>
      </div>
    );
  }
});

React.renderComponent(
  <RepoBox />,
  document.getElementById('app')
);

var RepoItem = React.createClass({
  render: function() {
    return (
      <div className="repoItem">
        <h4>Title </h4>
        <button>Delete</button>
      </div>
    )
  }
})
