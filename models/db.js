var mongoose = require('mongoose');

// define our schema
const UrlSchema = mongoose.Schema({
    orginalUrl: {type:String, unique: true},
    myUrl: String,
    shortedUrl: String
});
//create and export model
module.exports = mongoose.model('url',UrlSchema);