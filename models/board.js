var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema
 */
var BoardSchema = Schema({
    name: {type: String, required: 'Name is required'}
  , owner: { type: Schema.Types.ObjectId, ref: 'User', required: 'Owner is required' }
  , members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

mongoose.model('Board', BoardSchema);
