const Telegraf = require('telegraf')
const url = require('url')

function start (token, handler, domain, port, host, httpCallback) {
  const bot = new Telegraf(token)
  bot.catch((err) => {
    console.log(`micro-bot: Error when processing update: ${err.stack}`)
  })
  bot.use(handler)
  return bot.telegram.getMe()
    .then((botInfo) => {
      console.log(`Starting ${botInfo.username}...`)
      bot.options.username = botInfo.username
      if (typeof domain !== 'string') {
        return bot.telegram.removeWebHook().then(() => bot.startPolling())
      }
      if (domain.startsWith('https://')) {
        domain = url.parse(domain).host
      }
      const secret = Math.random().toString(36).slice(2)
      bot.startWebHook(`/${secret}`, null, port, host, httpCallback)
      return bot.telegram.setWebHook(`https://${domain}/${secret}`)
    })
    .then(() => console.log('Bot started'))
}

module.exports = Object.assign(Telegraf, {start: start})
