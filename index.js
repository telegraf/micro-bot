const Telegraf = require('telegraf')
const url = require('url')

function log (message) {
  console.log(`μ-bot :: ${message}`)
}

function start (token, handler, { domain, port, host, tlsOptions }, httpCallback) {
  const bot = new Telegraf(token)
  bot.catch((err) => log(`Error\n${err}`))
  bot.use(handler)
  return bot.telegram.getMe()
    .then((botInfo) => {
      log(`Starting @${botInfo.username}`)
      bot.options.username = botInfo.username
      bot.context.botInfo = botInfo
      if (typeof domain !== 'string') {
        return bot.telegram.deleteWebhook()
          .then(() => bot.startPolling())
          .then(() => log(`Bot started`))
      }
      if (domain.startsWith('https://') || domain.startsWith('http://')) {
        domain = url.parse(domain).host
      }
      const secret = `micro-bot/${Math.random().toString(36).slice(2)}`
      bot.startWebhook(`/telegraf/${secret}`, tlsOptions, port, host, httpCallback)
      return bot.telegram
        .setWebhook(`https://${domain}/telegraf/${secret}`)
        .then(() => log(`Bot started @ https://${domain}`))
    })
}

module.exports = Object.assign(Telegraf, { start: start })
