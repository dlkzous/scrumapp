var expect = require('expect.js')
  , superagent = require('superagent')
  , server = require('../bin/www')
  , config = require('./config.js');

describe('usersapi', function() {
  var app
    , url = config.baseUrl + ':' + config.port;

  before(function () {
    app = server();
  });

  after(function() {
    app.close();
  });

  it('should return an empty list without any users', function(done) {
    superagent.get(url + '/users').end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.body).to.eql({
          users: []
      });
      done();
    });
  });
});
