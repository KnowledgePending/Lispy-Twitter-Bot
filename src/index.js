// External Libraries
const Twit = require('twit');
const littleLisp = require("./littlelisp").littleLisp;

// Config file for twitter
const config = require('./config.js');

const twit = new Twit(config);
const targetAccount = '@targetAccount';

const stream = twit.stream('statuses/filter', { track: [targetAccount] });
stream.on('tweet', mentionEvent);
console.log("Tweet Watching Started");

function mentionEvent(tweet) {
  const name = tweet.user.screen_name;
  const nameID = tweet.id_str;

  const codeOutput = littleLisp.interpret(littleLisp.parse(tweet.text));
  const reply = "@" + name + ' ' + "Your code Produced:\n" + codeOutput;
  const params = {
    status: reply,
    in_reply_to_status_id: nameID
  };

  // Reply to user
  twit.post('statuses/update', params, function (err, data, response) {
    if (err !== undefined) {
      console.log(err);
    } else {
      console.log('Tweeted: ' + params.status);
    }
  })

  // create tweet url
  const tweetUrl = "https://twitter.com/" + name + "/status/" + nameID;
  console.log(tweetUrl + '\n');
};