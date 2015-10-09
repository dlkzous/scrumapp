var express = require('express')
  , router = express.Router()
  , getAllBoardsByUser = require('./boards/getAllBoardsByUser')
  , addBoard = require('./boards/addBoard');

router.route('/:userid')
  .get(getAllBoardsByUser);

router.route('/add')
  .post(addBoard);

module.exports = router;
