var expect = require('expect.js')
  , mongoose = require('mongoose')
  , config = require('./config')
  , mockHandler = require('./helpers/mockHandler')
  , User = require('../models/user')
  , Board = require('../models/Board')
  , getAllBoardsByOwner = require('../routes/boards/getAllBoardsByOwner')
  , addBoard = require('../routes/boards/addBoard')
  , addMember = require('../routes/boards/addMember')
  , getAllBoardsBelongedTo = require('../routes/boards/getAllBoardsBelongedTo')
  , getAllBoardMembers = require('../routes/boards/getAllBoardMembers');

describe('boardsapi', function() {

    before(function () {
      /** Connect to database and load models **/
      mongoose.connect(config.dbPath);
    });

    after(function() {
      mongoose.connection.close();
    });

    it('should return a valid message and status code if the user is not logged in while trying to retrieve boards that are owned by the user', function(done) {
      var service = mockHandler('GET', '/boards');

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
      var service = mockHandler('GET', '/boards', true);

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
      var service = mockHandler('GET', '/boards');

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

    it('should return an error message if the board name is not provided', function(done) {
      var service = mockHandler('GET', '/users');

      service.request = {
          session: {
            auth: true
          }
        , user: mongoose.Types.ObjectId("5603d450951764890c6d013e")
        , body: {}
      };

      addBoard(service.request, service.response);

      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.equal(400);
      expect(data).to.eql({
          success: false
        , message: {
          name: 'Field is required'
        }
      });
      done();
    });

    it('should succesfully add a board if the user is logged in', function(done) {
      var service = mockHandler('POST', '/boards', true);

      service.request = {
          session: {
            auth: true
          }
        , user: mongoose.Types.ObjectId("5603d450951764890c6d013e")
        , body: {
          name: 'Test Board'
        }
      };

      addBoard(service.request, service.response);
      service.response.on('end', function() {
        var data = JSON.parse(service.response._getData());
        expect(service.response.statusCode).to.eql(200);
        expect(data.board.name).to.eql('Test Board');
        expect(data.board.owner).to.eql('5603d450951764890c6d013e');
        done();
      });
    });
    
    it('should return a valid status code and error message if the user tries to add a member to a board when unauthenticated', function(done) {
      var service = mockHandler('POST', '/boards');
      
      service.request = {
        session: {
          auth: false
        }
      };
      
      addMember(service.request, service.response);
      
      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.equal(401);
      expect(data).to.eql({
        message: 'You need to be logged in to view this information'
      });
      done();
    });
    
    it('should return a valid status code and error message if any of the required fields are absent', function(done) {
      var service = mockHandler('POST', '/boards');

      service.request = {
          session: {
            auth: true
          }
        , user: mongoose.Types.ObjectId("5603d450951764890c6d013e")
        , body: {
        }
      };

      addMember(service.request, service.response);
      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.eql(400);
      expect(data).to.eql({
          success: false
        , message: {
            memberid: 'Field is required'
          , boardid: 'Field is required'
        }
      });
      done();
    });
    
    it('should give an appropriate error message if the user tries to add a member to a board that the user does not own', function(done) {
      var service = mockHandler('POST', '/boards', true);

      service.request = {
          session: {
            auth: true
          }
        , user: mongoose.Types.ObjectId("5603d450951764890c6d013e")
        , body: {
            memberid: "5603d450951764890c6d013f"
          , boardid: "562f8b09f1981ba016ada669"
        }
      };

      addMember(service.request, service.response);
      
      service.response.on('end', function() {
        var data = JSON.parse(service.response._getData());
        expect(service.response.statusCode).to.eql(400);
        expect(data).to.eql({
            success: false
          , message: 'Board does not belong to the user'
        });
        done();
      });
    });
    
    it('should succesfully add a member to the board if all the above validations pass', function(done) {
      var service = mockHandler('POST', '/boards', true);

      service.request = {
          session: {
            auth: true
          }
        , user: {
          _id: mongoose.Types.ObjectId("5603d450951764890c6d013e")
        }, body: {
            memberid: "5603d450951764890c6d013f"
          , boardid: "562f8b09f1981ba016ada668"
        }
      };

      addMember(service.request, service.response);
      
      service.response.on('end', function() {
        var data = JSON.parse(service.response._getData());
        expect(service.response.statusCode).to.eql(200);
        expect(data.success).to.eql(true);
        expect(data.message).to.eql("1 boards succesfully updated");
      done();
      });
    });
    
    it('should return a valid error message and status code if the user tries to retrieve boards that he belongs to without autorisation', function(done) {
      var service = mockHandler('GET', '/boards');
      
      service.request = {
        session: {
          auth: false
        }
      };
      
      getAllBoardsBelongedTo(service.request, service.response);
      
      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.equal(401);
      expect(data).to.eql({
        message: 'You need to be logged in to view this information'
      });
      done();
    });
    
    it('should return a list of boards that he user belongs to if authorised', function(done) {
      var service = mockHandler('GET', '/boards', true);

      service.request = {
          session: {
            auth: true
          }
        , user: {
          _id: mongoose.Types.ObjectId("5603d450951764890c6d013f")
        }
      };

      getAllBoardsBelongedTo(service.request, service.response);
      
      service.response.on('end', function() {
        var data = JSON.parse(service.response._getData());
        expect(service.response.statusCode).to.eql(200);
        expect(data.boards[0]._id).to.eql("562f8b09f1981ba016ada668");
      done();
      });
    });
    
    it('should return a valid status code and message if an unauthorised user tries to retrieve the list of members of a board', function(done) {
      var service = mockHandler('GET', '/boards');

      service.request = {
          session: {
            auth: false
          }
      };

      getAllBoardMembers(service.request, service.response);
      var data = JSON.parse(service.response._getData());
      expect(service.response.statusCode).to.eql(401);
      expect(data).to.eql({
        message: 'You need to be logged in to view this information'
      });
      done();
    });
    
    it('should ensure the board belongs to the user before returning the list of members', function(done) {
      var service = mockHandler('GET', '/boards', true);

      service.request = {
          session: {
            auth: true
          }
        , user: {
          _id: mongoose.Types.ObjectId("5603d450951764890c6d013f")
        }
        , params: {
          id: "562f8b09f1981ba016ada668"
        }
      };

      getAllBoardMembers(service.request, service.response);
      
      service.response.on('end', function() {
        var data = JSON.parse(service.response._getData());
        expect(service.response.statusCode).to.eql(400);
        expect(data).to.eql({
            success: false
          , message: 'Board does not belong to the user'
        });
        done();
      });
    });
    
    it('should list the members belonging to a given board if the user is authorised and owns the board', function(done) {
      var service = mockHandler('POST', '/boards', true);

      service.request = {
          session: {
            auth: true
          }
        , user: {
          _id: mongoose.Types.ObjectId("5603d450951764890c6d013e")
        }, body: {
            memberid: "563e8fea8b56be8e44595a52"
          , boardid: "562f8b09f1981ba016ada668"
        }
      };

      addMember(service.request, service.response);
      
      service.response.on('end', function() {
        
        service = mockHandler('GET', '/boards', true);

        service.request = {
            session: {
              auth: true
            }
          , user: {
            _id: mongoose.Types.ObjectId("5603d450951764890c6d013e")
          }
          , params: {
            id: "562f8b09f1981ba016ada668"
          }
        };
  
        getAllBoardMembers(service.request, service.response);
        
        service.response.on('end', function() {
          var data = JSON.parse(service.response._getData());
          expect(service.response.statusCode).to.eql(200);
          expect(data.users[0]._id).to.eql("5603d450951764890c6d013f");
          expect(data.users[1]._id).to.eql("563e8fea8b56be8e44595a52");
          done();
      });
      });
    });
  });
