const Telegraf = require('telegraf')
const url = require('url')

function start (token, handler, domain, port, host) {
  const bot = new Telegraf(token)
  bot.catch((err) => {
    console.log(`micro-bot: Error when processing update: ${err.stack}`)
  })
  bot.use(handler)
  const secret = Math.random().toString(36)
  return bot.telegram.getMe()
    .then((botInfo) => {
      console.log(`Starting ${botInfo.username}...`)
      if (typeof domain !== 'string') {
        return bot.telegram.removeWebHook().then(() => bot.startPolling())
      }
      if (domain.startsWith('https://')) {
        domain = url.parse(domain).host
      }
      return bot.telegram.setWebHook(`https://${domain}/${secret}`)
        .then(() => bot.startWebHook(`/${secret}`, null, port, host, handler.cb))
    })
    .then(() => {
      console.log('Bot started')
    })
}

module.exports = Telegraf
module.exports.start = start
