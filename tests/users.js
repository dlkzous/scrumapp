var expect = require('expect.js')
  , mongoose = require('mongoose')
  , config = require('./config')
  , mockHandler = require('./helpers/mockHandler')
  , User = require('../models/user')
  , getAllUsers = require('../routes/users/getAllUsers')
  , getMyProfile = require('../routes/users/getMyProfile');

describe('usersapi', function() {

  before(function () {
    /** Connect to database and load models **/
    mongoose.connect(config.dbPath);
  });

  after(function() {
    mongoose.connection.close();
  });

  it('should return a list with three users', function(done) {

    var service = mockHandler('GET', '/users', true);

    getAllUsers(service.request, service.response);
    service.response.on('end', function() {
      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.equal(200);
      expect(data).to.eql({
          users: [
            {
                _id: "5603d450951764890c6d013f"
              , name: "Test User Three"
              , facebook_id: "10156106043525548"
              , facebook: {
                  name: "Test User Three"
                , id: "10156106043525548"
              }
              , __v: 0
            },
            {
                _id: "5603d450951764890c6d013e"
              , name: "Test User"
              , facebook_id: "10156106043525333"
              , facebook: {
                  name: "Test User"
                , id: "10156106043525333"
              }
              , __v: 0
            },
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

  it('should return a valid message and status code if the user is not logged in', function(done) {

    var service = mockHandler('GET', '/users/profile', false);

    // Mock unauthenticated user
    service.request.session = {
      auth: false
    };

    getMyProfile(service.request, service.response);
    var data = JSON.parse(service.response._getData());
    expect(service.response.statusCode).to.equal(401);
    expect(data).to.eql({
      message: 'You need to be logged in to view this information'
    });
    done();
  });

  it('should return the user profile if the user is authenticated', function(done) {

    var service = mockHandler('GET', '/users/profile', false);

    // Mock authenticated user
    service.request = {
        session: {
          auth: true
        }
      , user: {
        toObject: function() {
          return {
            name: 'Test user'
          };
        }
      }
    };

    getMyProfile(service.request, service.response);
    var data = JSON.parse(service.response._getData());
    expect(service.response.statusCode).to.equal(200);
    expect(data).to.eql({
      user: {
        name: 'Test user'
      }
    });
    done();
  });
});
