const Twitter = require("twitter");

const keys = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
};

module.exports = {
  deleteAllTweets: (user, res) => {
    const client = new Twitter({
      access_token_key: user.userToken,
      access_token_secret: user.userTokenSecret,
      ...keys,
    });

    const params = { screen_name: user.userName };
    client.get("statuses/user_timeline", params, function (error, tweets) {
      if (tweets.length === 0) {
        return res.json({ status: "You have no Tweets left to delete..." });
      }

      tweets.forEach((tweet) =>
        client.post("statuses/destroy", { id: tweet.id_str })
      );

      setTimeout(() => deleteTweets(user, res), 5000);
    });
  },
};
