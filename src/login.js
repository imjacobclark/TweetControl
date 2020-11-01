const LoginWithTwitter = require("login-with-twitter");

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

  callback: (req, res) => {
    loginWithTwitter.callback(
      {
        oauth_token: req.query.oauth_token,
        oauth_verifier: req.query.oauth_verifier,
      },
      req.session.tokenSecret,
      (err, user) => {
        delete req.session.tokenSecret;
        req.session.user = user;

        return res.redirect("/");
      }
    );
  },
};
