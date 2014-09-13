var RepoBox = React.createClass({
  render: function() {
    return (
      <div className="repoBox">
        <h4>Your repos</h4>
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
