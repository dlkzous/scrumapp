var express = require('express')
  , router = express.Router()
  , getAllBoardsByOwner = require('./boards/getAllBoardsByOwner')
  , getAllBoardsBelongedTo = require('./boards/getAllBoardsBelongedTo')
  , addBoard = require('./boards/addBoard')
  , addMember = require('./boards/addMember');

router.route('/')
  .get(getAllBoardsByOwner);

router.route('/other')
  .get(getAllBoardsBelongedTo);

router.route('/add')
  .post(addBoard);

router.route('/addmember')
  .post(addMember);

module.exports = router;
