# TweetControl

TweetControl enables people to login to Twitter and delete their entire timeline of tweets.

## Running

You'll need to set up an application in the Twitter developer console, then provide as env variables:

- `CONSUMER_SECRET` - Twitter consumer key
- `CONSUMER_SECRET` - Twitter consumer secret
- `ENV` - An environment, `dev` or `production`
- `SESSION_SECRET` - A secret for local session storage
- `DOMAIN` - The domain you're running the app on
- `PORT` - The port you'd like to bind too

```shell
CONSUMER_KEY= CONSUMER_SECRET= ENV= SESSION_SECRET= DOMAIN= PORT= node app.js
```
