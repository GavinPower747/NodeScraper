var http = require("request");
var fs = require("fs");
var express = require("express");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var schedule = require("node-schedule");
var tweetModel = require("./Models/tweetModel");

var app = express();
var port = process.env.PORT || 8081;
var router = express.Router();
var db = mongoose.connect("mongodb://xxxxx:xxxxx@ds031862.mongolab.com:31862/twitterfeed");


router.route("/twitter")
  .get(function(req, res){
    res.status(200).json(tweetModel.find({}));
});
app.use("/api", router);

app.listen(port, function() { 
    
	console.log('Running Running on PORT: ' + port);
	
	var rule = new schedule.RecurrenceRule();

    rule.minute = new schedule.Range(0, 59, 1);
    
    schedule.scheduleJob(rule, function(){
        scrape();
    });
    
});

function scrape() {
    console.log("Scraping and writing new entries");
    var url = "https://twitter.com/hashtag/MetGala?src=tren"; // Could easily change this to dynamic subscriptions

    http(url, function(error, response, html){
        if(!error)
        {
            var $ = cheerio.load(html);
            var tweetList = [];
            $(".tweet").each(function() {
                
                var tweet = $(this);
                var newTweet = new tweetModel({
                    tweetId : tweet.data().tweetId,
                    userId : tweet.data().userId,
                    fullName : tweet.data().name,
                    userName : tweet.data().screenName,
                    body : tweet.find(".tweet-text").text()
                });
                var timestamp = tweet.find("._timestamp").text();
                
                if(timestamp == "1m" || timestamp.indexOf("s") != -1)
                    newTweet.save(function(err) { console.log("Tweet Saved") });
            });
        }
    });
}

exports = module.exports = app;