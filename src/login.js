const LoginWithTwitter = require("login-with-twitter");
const { v4: uuidv4 } = require('uuid');

const loginWithTwitter = new LoginWithTwitter({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackUrl: `${process.env.DOMAIN}/callback`,
});

module.exports = {
  login: (req, res) => {
    loginWithTwitter.login((err, tokenSecret, url) => {
      req.session.tokenSecret = tokenSecret;
      return res.redirect(url);
    });
  },
  callback: (req, res, connectedClients) => {
    loginWithTwitter.callback(
      {
        oauth_token: req.query.oauth_token,
        oauth_verifier: req.query.oauth_verifier,
      },
      req.session.tokenSecret,
      (err, user) => {
        const uuid = uuidv4();
        delete req.session.tokenSecret;

        connectedClients[uuid] = user;

        req.session.user = uuid;

        return res.redirect("/");
      }
    );
  },
};
