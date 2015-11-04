var expect = require('expect.js')
  , mongoose = require('mongoose')
  , config = require('./config')
  , mockHandler = require('./helpers/mockHandler')
  , User = require('../models/user')
  , Board = require('../models/Board')
  , getAllBoardsByOwner = require('../routes/boards/getAllBoardsByOwner')
  , addBoard = require('../routes/boards/addBoard');

describe('usersapi', function() {

    before(function () {
      /** Connect to database and load models **/
      mongoose.connect(config.dbPath);
    });

    after(function() {
      mongoose.connection.close();
    });

    it('should return a valid message and status code if the user is not logged in while trying to retrieve boards that are owned by the user', function(done) {
      var service = mockHandler('GET', '/users');

      service.request.session = {
        auth: false
      };
      getAllBoardsByOwner(service.request, service.response);

      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.equal(401);
      expect(data).to.eql({
        message: 'You need to be logged in to view this information'
      });
      done();
    });

    it('should list all boards owned by the user', function(done) {
      var service = mockHandler('GET', '/users', true);

      service.request = {
          session: {
            auth: true
          }
        , user: "5603d450951764890c6d013e"
      };

      getAllBoardsByOwner(service.request, service.response);
      service.response.on('end', function() {
        var data = JSON.parse(service.response._getData());
        expect(service.response.statusCode).to.equal(200);
        expect(data).to.eql({
          boards: [
            {
              _id: "562f8b09f1981ba016ada667",
              name: "third board",
              owner: "5603d450951764890c6d013e",
              __v: 0,
              members: [ ]
            },
            {
              _id: "562f8b09f1981ba016ada668",
              name: "second board",
              owner: "5603d450951764890c6d013e",
              __v: 0,
              members: [ ]
            }
          ]
        });
        done();
      });
    });

    it('should display a valid message and status code if the user is not logged in while trying to add a board', function(done) {
      var service = mockHandler('GET', '/users');

      service.request.session = {
        auth: false
      };
      addBoard(service.request, service.response);

      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.equal(401);
      expect(data).to.eql({
        message: 'You need to be logged in to view this information'
      });
      done();
    });
  });
