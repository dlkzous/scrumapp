var express = require('express')
  , router = express.Router()
  , getAllBoardsByOwner = require('./boards/getAllBoardsByOwner')
  , getAllBoardsBelongedTo = require('./boards/getAllBoardsBelongedTo')
  , addBoard = require('./boards/addBoard')
  , addMember = require('./boards/addMember')
  , getAllBoardMembers = require('./boards/getAllBoardMembers');

  
router.route('/owned')
  .get(getAllBoardsByOwner);

router.route('/belongedTo')
  .get(getAllBoardsBelongedTo);

router.route('/add')
  .post(addBoard);

router.route('/addmember')
  .post(addMember);
  
 router.route('/getAllBoardMembers')
  .get(getAllBoardMembers);

module.exports = router;
