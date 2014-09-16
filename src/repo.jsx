/** @jsx React.DOM */
var RepoBox = React.createClass({
  handleFetch: function (e) {
    console.log("lol")
    e.preventDefault();
    OAuth.initialize('ei8Oo3tvYIssBSbrxeaxVi5v9Ck') //OAuth.io public key
    OAuth.popup('github').done(function(result) { //OAuth.io provider
        console.log(result)
        // do some stuff with result
    })
  },
  render: function() {
    return (
      <div className="repoBox">
        <h4>Your repos</h4>
        <button onClick="{this.handleFetch}">Login</button>
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
