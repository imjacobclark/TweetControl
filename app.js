const express = require("express");
const session = require("express-session");

const loginWithTwitter = require("./src/login");
const actions = require("./src/tweetActions");

const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN;

const app = express();

const sess = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: false,
  cookie: {},
};

const connectedClients = {};

if (process.env.ENV === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

setInterval(() => {
  for (const [key, user] of Object.entries(connectedClients)) {
    actions.deleteAllTweetsButTodays(user, { json: () => {}});
  }
}, 900000)

app.use(session(sess));

app.get("/", (req, res) => {
  if (req.session.user) {
    return res.json({
      deleteAllTweets: `${domain}/deleteAllTweets`,
      deleteAllTweetsButTodays: `${domain}/deleteAllTweetsButTodays`
    });
  }else {
    return res.json({
      login: `${process.env.DOMAIN}/login`,
    });
  }
});

app.get("/deleteAllTweets", (req, res) => {
  if (req.session.user) {
    actions.deleteAllTweets(connectedClients[req.session.user], res);
  } else {
    return res.json({
      login: `${process.env.DOMAIN}/login`,
    });
  }
});

app.get("/deleteAllTweetsButTodays", (req, res) => {
  if (req.session.user) {
    actions.deleteAllTweetsButTodays(connectedClients[req.session.user], res);
  } else {
    return res.json({
      login: `${process.env.DOMAIN}/login`,
    });
  }
});

app.get("/login", (req, res) => {
  loginWithTwitter.login(req, res);
});

app.get("/callback", (req, res) => {
  loginWithTwitter.callback(req, res, connectedClients);
});

app.listen(port, () => {
  console.log(`Example app listening at ${domain}`);
});
