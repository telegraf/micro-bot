const Telegraf = require('telegraf')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const WizardScene = require('telegraf/scenes/wizard')
const url = require('url')

const log = (message) => console.log(`μ-bot :: ${message}`)
const logError = (error) => console.error('μ-bot :: Error', error)
const defaultInit = () => Promise.resolve()
const defaultRequestHandler = (req, res) => res.end()

function start ({ token, domain, botModule, port, host }) {
  const bot = new Telegraf(token, botModule.options)
  const init = botModule.initialize || defaultInit
  bot.catch(logError)
  bot.use(botModule.botHandler || botModule)
  return bot.telegram.getMe()
    .then((botInfo) => {
      log(`Starting @${botInfo.username}`)
      bot.options.username = botInfo.username
      bot.context.botInfo = botInfo
      return init(bot)
    })
    .then(() => {
      if (typeof domain !== 'string') {
        return bot.telegram.deleteWebhook()
          .then(() => bot.startPolling())
          .then(() => log(`Bot started`))
      }
      if (domain.startsWith('https://') || domain.startsWith('http://')) {
        domain = url.parse(domain).host
      }
      const secret = `micro-bot/${Math.random().toString(36).slice(2)}`
      bot.startWebhook(`/telegraf/${secret}`, botModule.tlsOptions, port, host, botModule.requestHandler || defaultRequestHandler)
      return bot.telegram
        .setWebhook(`https://${domain}/telegraf/${secret}`)
        .then(() => log(`Bot started @ https://${domain}`))
    })
}

module.exports = Object.assign(Telegraf, { Stage, Scene, WizardScene, start: start })
