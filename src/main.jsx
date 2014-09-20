/** @jsx React.DOM */
var Repo = require('./repo.jsx')
   ,React = require('react')

React.renderComponent(
  <Repo.RepoBox />,
  document.getElementById('app')
)


