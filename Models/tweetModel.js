var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tweetModel = new Schema ({
    tweetId: {type: String},
    userId: {type: Number},
    fullName: {type: String},
    userName: {type: String},
    body: {type: String}
});

module.exports = mongoose.model("tweets", tweetModel);