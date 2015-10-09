var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Schema
 */
var BoardSchema = Schema({
    name: String
  , owner: { type: Schema.Types.ObjectId, ref: 'User' }
  , members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

mongoose.model('Board', BoardSchema);
