var expect = require('expect.js');
var superagent = require('superagent');
var server = require('../bin/www');
var config = require('./config.js');

describe('homepage', function() {
  var app;
  var url = config.baseUrl + ':' + config.port;

  before(function () {
    app = server();
  });

  after(function() {
    app.close();
  });

  it('should respond to GET with api metadata', function(done) {
    superagent.get(url).end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.body).to.eql({
          title: 'ScrumAPI'
        , version: '0.0.1'
      });
      done();
    });
  });

  it('should return not found on an invalid path', function(done) {
    superagent.get(url + '/' + config.invalid).end(function(err, res) {
      expect(res.status).to.equal(404);
      expect(res.body.message).to.equal('Not Found');
    });
    done();
  });
});
