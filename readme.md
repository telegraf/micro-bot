[![NPM Version](https://img.shields.io/npm/v/micro-bot.svg?style=flat-square)](https://www.npmjs.com/package/micro-bot)
[![node](https://img.shields.io/node/v/micro-bot.svg?style=flat-square)](https://www.npmjs.com/package/micro-bot)
[![Build Status](https://img.shields.io/travis/telegraf/micro-bot.svg?branch=master&style=flat-square)](https://travis-ci.org/telegraf/micro-bot)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)

# μ-bot
> 🤖 Async Telegram microbots

> `micro-bot` is highly inspired by [`micro`](https://github.com/zeit/micro/) 

## Example

The following example `echo.js` will answer user with important information about everything.

```js
module.exports = async function (ctx) {
  await ctx.reply('42')
}
```

To run the bot, use the `micro-bot` command:

```bash
$ micro-bot -t TOKEN echo.js
```

To run the bot with webhook support, provide webhook domain name:

```bash
$ micro-bot -t TOKEN -d yourdoimain.tld echo.js
```

Also you can provide options via environment variables:

* `process.env.BOT_TOKEN` - Bot token
* `process.env.BOT_DOMAIN` - Webhook domain

```bash
$ BOT_TOKEN='TOKEN' micro-bot echo.js
```

## Documentation

`micro-bot` was built on top of [`telegraf`](https://github.com/telegraf/telegraf) libary.

[Telegraf documentation](http://telegraf.js.org).

### Installation

**Note**: `micro-bot` requires Node `6.2.0` or later

Install from NPM:

```js
$ npm init
$ npm install micro-bot --save
```

Then in your `package.json`:

```js
"main": "index.js",
"scripts": {
  "start": "micro-bot"
}
```

Then write your `index.js` (see above for an example). 
To run your bot run:

```bash
$ npm start
```

### Transpilation

We use `async-to-gen`, so that the only transformation that happens is converting async and await to generators.

If you want to do it manually, you can! `micro-bot` is idempotent and should not interfere.

`micro-bot` exclusively supports Node 6.2+ to avoid a big transpilation pipeline. 
`async-to-gen` is fast and can be distributed with the main `micro-bot` package due to its small size.

### Advanced Examples

```js
const { mount } = require('micro-bot')

module.exports = mount('sticker', (ctx) => ctx.reply('👍'))
```

```js
const { readFileSync } = require('fs')
const { Composer } = require('micro-bot')
const app = new Composer()

app.command('/start', async (ctx) => ctx.reply('Welcome!'))
app.hears('hi', (ctx) => ctx.reply('Hey there!'))
app.on('sticker', (ctx) => ctx.reply('👍'))

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

### Realtime global deployments with [`now`](https://zeit.co/now)

Wanna deploy your bot in seconds? 
First, change your `package.json` as in following snippet:

```js
"main": "index.js",
"scripts": {
  "start": "micro-bot -d ${NOW_URL}"
}
```

then use `now` to deploy:

```bash
$ now -e BOT_TOKEN='TOKEN'
```

Congratulations, your bot is alive! 🎉

#### Example μ-bots

* [@uncover_bot](https://telegram.me/uncover_bot): [Source code](https://uncover.now.sh/_src)
* [@epub2mobi_bot](https://telegram.me/epub2mobi_bot): [Source code](https://epub2mobi.now.sh/_src)
