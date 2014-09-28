/** @jsx React.DOM */
/*global describe, beforeEach, afterEach, it, assert */
var React = require('react');
var ReactTestUtils = require('react/lib/ReactTestUtils');
var repo = require('../src/repo.jsx');
var api = require('api.js');
var mocha = require('mocha')
  , chai = require('chai')
  , expect = chai.expect
  , should = chai.should
  , assert = chai.assert;


err = function (fn, msg) {
  try {
    fn();
    throw new chai.AssertionError({ message: 'Expected an error' });
  } catch (err) {
    if ('string' === typeof msg) {
      chai.expect(err.message).to.equal(msg);
    } else {
      chai.expect(err.message).to.match(msg);
    }
  }
};

mocha.setup('bdd');
window.onload = function () {
  setTimeout(function () {
    mocha.checkLeaks();
    mocha.run();  
  }, 500)
}

describe('Repo', function(){
  it('returns object', function () {
    assert.ok(repo, 'Repo is valid')
    assert.property(repo, 'RepoHeader', 'Missing RepoHeader')
    assert.property(repo, 'RepoItem', 'Missing RepoItem')
    assert.property(repo, 'RepoBox', 'Missing RepoBox') 
  })

})

describe('RepoHeader', function () {
  var toggle = function () {
  
  }

  var remove = function () {
  
  }
  
  var RepoHeader = repo.RepoHeader;
  var instance = ReactTestUtils.renderIntoDocument(
    //ButtonGroup(null, Button(null, 'Title'))
    <table><RepoHeader repoCount="10"
    onToggleAll={toggle}
    onRemoveAll={remove} /></table>
  )

  it('#render', function () {
    assert.equal(instance.getDOMNode().nodeName, 'TABLE', "Don't render");
    assert.ok(instance.getDOMNode().innerHTML.match(/\bYou have 10\b/), "Render wrong content");
  })

  it('#accept the data', function () {
    assert.equal(instance.props.repoCount, 10, "Wrong repo count")
  })
})

describe('RepoItem', function () {
  it ('#render', function() {
  
  })

  it ('can mark', function () {
  })

  it ('show loading bar when removing', function () {
  
  })

})

describe('RepoBox', function () {
  sessionStorage.clear()
  var instance = ReactTestUtils.renderIntoDocument(
    <repo.RepoBox />
  )
  var repos = [{id: 1}, {id: 2}, {id: 3}]     
  instance.setState({repo: repos})
  describe('#render', function () {
    it('output the content', function () {
      assert.equal(instance.getDOMNode().nodeName, 'DIV', "Don't render");
      assert.equal(instance.getDOMNode().className, 'repoBox', "Don't render");
    })
  })

  describe('#toggle', function () {
    it('check an element', function() {
      instance.toggle(repos[1], 1)
      assert.equal(instance.state.selected[0], 1, "Selected first element")
      instance.toggle(repos[2], 2)
      assert.equal(instance.state.selected[1], 2, "Selected second element")
    })

    it('uncheck an element', function () {
      instance.toggle(repos[2], 2)
      assert.notOk(instance.state.selected[1], "Unselected an element")
      instance.toggle(repos[1], 1)
      assert.notOk(instance.state.selected[0], "Unselected an element")
    })
  })

  describe('#toggleAll', function () {
    it('check all', function () {
      instance.toggleAll({target: {checked: true}})
      assert.lengthOf(instance.state.selected, 3, 'Selected all of 3')
      assert.equal(instance.state.selected[0], 0, 'Selected first element')
    })
    it('uncheck all', function () {
      instance.toggleAll({target: {checked: false}})
      assert.lengthOf(instance.state.selected, 0, 'Selected none')
    })
  })  
})


