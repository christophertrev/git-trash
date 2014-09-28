var api = require('../src/api.js');
var mocha = require('mocha')
  , chai = require('chai')
  , expect = chai.expect
  , should = chai.should
  , assert = chai.assert;

describe("api", function () {
  client = new api();

  describe("with valid param", function () {
    var client = new api('github', 'test_token')
    it("return an api client", function () {
      
    })

    it("#getClient", function () {
      var c = client.getClient()
    })

  })

  describe("#getClient", function () {
    
  })

})



