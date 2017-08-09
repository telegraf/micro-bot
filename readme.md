[![NPM Version](https://img.shields.io/npm/v/micro-bot.svg?style=flat-square)](https://www.npmjs.com/package/micro-bot)
[![node](https://img.shields.io/node/v/micro-bot.svg?style=flat-square)](https://www.npmjs.com/package/micro-bot)
[![Build Status](https://img.shields.io/travis/telegraf/micro-bot.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/micro-bot)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# μ-bot
> 🤖 Async Telegram microbots

> `micro-bot` is highly inspired by [`micro`](https://github.com/zeit/micro/) 

## Documentation

`micro-bot` was built on top of [`Telegraf`](https://github.com/telegraf/telegraf) libary.

[Telegraf documentation](http://telegraf.js.org).

## Installation

Install from NPM:

```js
$ npm install micro-bot
```

**Note**: `micro-bot` requires Node `6.2.0` or later

## Quick start

The following example will answer with important information about everything.

```js
$ mkdir smart-bot
$ cd smart-bot
$ npm init
$ npm install micro-bot --save
```

Then write your `index.js`.

```js
module.exports = ({ reply }) => reply('42')
```

Then in your `package.json`:

```js
"main": "index.js",
"scripts": {
  "start": "micro-bot"
}
```

To run the bot, use the `micro-bot` command:

```bash
$ BOT_TOKEN='TOKEN' npm start
```

or

```bash
$ micro-bot -t TOKEN index.js
```

To run the bot with webhook support, provide webhook domain name:

```bash
$ micro-bot -t TOKEN -d yourdoimain.tld echo.js
```

Supported environment variables:

* `process.env.BOT_TOKEN` - Bot token
* `process.env.BOT_DOMAIN` - Webhook domain

## Telegraf context

`micro-bot` automatically fetch Bot info from telegram servers at start.

You can obtain it from update context:

```js
module.exports = (ctx) => {
  return ctx.reply(`Hey, my name is ${ctx.botInfo.first_name} ${ctx.botInfo.last_name}`)
}
```

## Deployment to `now`

Let's deploy your `micro-bot` with Realtime global deployments by Zeit.

First, install [`now`](https://zeit.co/now) 
```js
$ npm install now -g
$ now login
```

Then change `start` script in `package.json` as in following snippet:

```js
"scripts": {
  "start": "micro-bot -d ${NOW_URL}"
}
```

Finally use `now` to deploy:

```bash
$ now -e BOT_TOKEN='YOUR BOT TOKEN'
```

Congratulations, your bot is alive! 🎉

## Deployment to Heroku

Okay, now we will deploy our `micro-bot` to Heroku. Why not?!

First, install [`heroku binaries`](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) and login via console.

Then, init new git repo:
```bash
$ git init
$ heroku create
```

Afterwards, update Heroku config:

```bash
$ heroku config:set --app YourAppId BOT_TOKEN='YOUR BOT TOKEN'
$ heroku config:set --app YourAppId BOT_DOMAIN='https://YourAppId.herokuappp.com'
```

Then change `start` script in `package.json`:

```js
"scripts": {
  "start": "micro-bot -p ${PORT}"
}
```

Finally use `heroku` to deploy:

```bash
$ git add index.js package.json
$ git commit -m 'initial commit'
$ git push heroku master
```

Congratulations, your bot is alive! Again.

#### Example μ-bots

* [`@uncover_bot`](https://telegram.me/uncover_bot) - [Source code](https://uncover.now.sh/_src)
* [`@epub2mobi_bot`](https://telegram.me/epub2mobi_bot) - [Source code](https://epub2mobi.now.sh/_src)
* [`@gorchichkabot`](https://bot.gorchichka.com) - [Source code](https://github.com/agudulin/gorchichkabot)

## Transpilation

We use [is-async-supported](https://github.com/timneutkens/is-async-supported) combined with [async-to-gen](https://github.com/leebyron/async-to-gen),
so that the we only convert `async` and `await` to generators when needed.

If you want to do it manually, you can! `micro-bot` is idempotent and should not interfere.

`micro-bot` exclusively supports Node 6.2+ to avoid a big transpilation pipeline.
`async-to-gen` is fast and can be distributed with the main `micro-bot` package due to its small size.

## Advanced Examples

```js
const { mount, reply } = require('micro-bot')
module.exports = mount('sticker', reply('👍'))
```

```js
const { readFileSync } = require('fs')
const { Composer } = require('micro-bot')
const app = new Composer()

app.command('/start', (ctx) => ctx.reply('Welcome!'))
app.hears('hi', ({ reply }) => reply('Hey there!'))
app.on('sticker', ({ reply }) => reply('👍'))

// Export bot handler
module.exports = app

// Export http handler (optional)
module.exports.requestHandler = (req, res) => {...}

// Export tls options (optional)
module.exports.tlsOptions = {
  key:  readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem')
}

// Or you can export hash with handlers and options
module.exports = {
  botHandler: app,
  requestHandler:  (req, res, next) => {...},
  tlsOptions: {
    key:  readFileSync('server-key.pem'),
    cert: readFileSync('server-cert.pem'),
    ca: [
      // This is necessary only if the client uses the self-signed certificate.
      readFileSync('client-cert.pem')
    ]
  }
}
```
