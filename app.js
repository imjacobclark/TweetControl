const express = require("express");
const session = require("express-session");

const loginWithTwitter = require("./src/login");
const actions = require("./src/tweetActions");

const port = (process.env.port = 3000);
const domain = process.env.DOMAIN;

const app = express();

const sess = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
};

if (process.env.ENV === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

app.use(session(sess));

app.get("/", (req, res) => {
  if (req.session.user) {
    actions.deleteAllTweets(req.session.user, res);
  } else {
    return res.json({
      login: `${process.env.DOMAIN}:${process.env.PORT}/login`,
    });
  }
});

app.get("/login", (req, res) => {
  loginWithTwitter.login(req, res);
});

app.get("/callback", (req, res) => {
  loginWithTwitter.callback(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening at ${domain}:${port}`);
});
