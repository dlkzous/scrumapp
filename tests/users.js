var expect = require('expect.js')
  , mongoose = require('mongoose')
  , config = require('./config')
  , httpMocks = require('node-mocks-http')
  , User = require('../models/user')
  , getAllUsers = require('../routes/users/getAllUsers')
  , getMyProfile = require('../routes/users/getMyProfile');

describe('usersapi', function() {

  before(function () {
    /** Connect to database and load models **/
    mongoose.connect(config.dbPath);

    // Pull in the models required for this test
    require('../models/user');
    var UserModel = mongoose.model('User');
  });

  after(function() {
    mongoose.connection.close();
  });

  it('should return a list with a single user', function(done) {

    // Create mock request
    var request = httpMocks.createRequest({
        method: 'GET'
      , url: '/users'
    });

    // Create mock response
    var response = httpMocks.createResponse({
      eventEmitter: require('events').EventEmitter
    });

    getAllUsers(request, response);
    response.on('end', function() {
      var data = JSON.parse(response._getData());
      expect(response.statusCode).to.equal(200);
      expect(data).to.eql({
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
