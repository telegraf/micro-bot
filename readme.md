[![NPM Version](https://img.shields.io/npm/v/micro-bot.svg?style=flat-square)](https://www.npmjs.com/package/micro-bot)
[![node](https://img.shields.io/node/v/micro-bot.svg?style=flat-square)](https://www.npmjs.com/package/micro-bot)
[![Build Status](https://img.shields.io/travis/telegraf/micro-bot.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/micro-bot)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# μ-bot
> 🤖 Zero-configuration Telegram bot runner

## Documentation

`micro-bot` was built on top of [`Telegraf`](https://github.com/telegraf/telegraf) library.

[Telegraf API documentation](http://telegraf.js.org).

## Installation

Install from NPM:

```bash
$ npm install micro-bot
```

**Note**: `micro-bot` requires Node `8.5.0` or later

## Scaffolding

If you have installed `yarn^0.24` or `npm^5` you can use [`create-bot`](https://github.com/telegraf/create-bot) scaffolding tool:

```bash
$ npx create-bot smart-bot
$ cd smart-bot
```

Or using `yarn`:

```bash
$ yarn create bot smart-bot
$ cd smart-bot
```

## Quick start

The following example will answer with important information about everything.

```bash
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
$ micro-bot -t TOKEN -d yourdomain.tld echo.js
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
```bash
$ npm install now -g
$ now login
```

Then add `now-start` script in `package.json` as in following snippet:

```js
"scripts": {
  "now-start": "micro-bot -d ${NOW_URL}"
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
$ heroku config:set --app YourAppId BOT_DOMAIN='https://YourAppId.herokuapp.com'
```

Then add `Procfile` into the root of your project, with one line:

```Procfile
web: micro-bot -p $PORT
```

Finally use git to deploy:

```bash
$ git add index.js package.json
$ git commit -m 'initial commit'
$ git push heroku master
```

Congratulations, your bot is alive! Again.

#### Example μ-bots

* [ 🔥 Glitch example](https://glitch.com/edit/#!/dashing-light)
* [`@uncover_bot`](https://telegram.me/uncover_bot) - [Source code](https://uncover.now.sh/_src)
* [`@epub2mobi_bot`](https://telegram.me/epub2mobi_bot) - [Source code](https://epub2mobi.now.sh/_src)
* [`@gorchichkabot`](https://bot.gorchichka.com) - [Source code](https://github.com/agudulin/gorchichkabot)
* [`@aloudbot`](https://telegram.me/aloudbot) - [Source code](https://github.com/shrynx/aloudbot)

## Advanced Examples

```js
const { mount, reply } = require('micro-bot')
module.exports = mount('sticker', reply('👍'))
```

```js
const { readFileSync } = require('fs')
const { Composer } = require('micro-bot')
const app = new Composer()

app.start((ctx) => ctx.reply('Welcome'))
app.help((ctx) => ctx.reply('Help message'))
app.hears('hi', ({ reply }) => reply('Hello'))
app.on('sticker', ({ reply }) => reply('👍'))

// Export bot handler
module.exports = app

// Or you can export hash with handlers and options
module.exports = {
  initialize: (bot) => {...},
  botHandler: app,
  requestHandler:  (req, res, next) => {...},
  options: {
    telegram: {
      agent: new HttpsProxyAgent('proxy url')
    }
  },
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

### Stages & Scenes

```js
const { Composer, Stage, Scene, session } = require('micro-bot')

// Greeter scene
const greeter = new Scene('greeter')
greeter.enter((ctx) => ctx.reply('Hi'))
greeter.leave((ctx) => ctx.reply('Buy'))
greeter.hears(/hi/gi, (ctx) => ctx.scene.leave())
greeter.on('message', (ctx) => ctx.reply('Send `hi`'))

const stage = new Stage()
stage.register(greeter)

const bot = new Composer()
bot.use(session())
bot.use(stage.middleware())
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
bot.command('cancel', (ctx) => ctx.scene.leave())
module.exports = bot

```

## Credits

`micro-bot` is highly inspired by [`Micro`](https://github.com/zeit/micro/)
