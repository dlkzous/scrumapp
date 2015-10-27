var expect = require('expect.js')
  , mongoose = require('mongoose')
  , config = require('./config')
  , mockHandler = require('./helpers/mockHandler')
  , User = require('../models/user')
  , Board = require('../models/Board')
  , getAllBoardsByOwner = require('../routes/getAllBoardsByOwner');

describe('usersapi', function() {

    before(function () {
      /** Connect to database and load models **/
      mongoose.connect(config.dbPath);
    });

    after(function() {
      mongoose.connection.close();
    });

    it('should list all boards owned by the user', function(done) {
      
    });
  });
