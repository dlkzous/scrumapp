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

  it('should return a list with a single user', function(done) {
    superagent.get(url + '/users').end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.body).to.eql({
          users: [
                  {
                      _id: "5603d450951764890c6d012d"
                    , name: "Kushal D'Souza"
                    , facebook_id: "10156106043525077"
                    , facebook: {
                          name: "Kushal D'Souza"
                        , id: "10156106043525077"
                        }
                    , __v: 0
                  }
                ]
      });
      done();
    });
  });
});
