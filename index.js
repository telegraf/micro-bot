const Telegraf = require('telegraf')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const WizardScene = require('telegraf/scenes/wizard')

const defaultInit = () => Promise.resolve()
const defaultCb = (req, res) => {
  res.statusCode = 404
  res.end()
}

function start ({ token, domain, hookPath, botModule, port, host, silent }) {
  const webhook = typeof domain === 'string' || typeof hookPath === 'string'
    ? {
      domain,
      hookPath,
      port,
      host,
      tlsOptions: botModule.tlsOptions,
      cb: botModule.server || botModule.requestHandler || defaultCb
    }
    : null
  const bot = new Telegraf(token, botModule.options)
  const init = botModule.init || botModule.initialize || defaultInit
  bot.catch((err) => console.error('μ-bot: Unhandled error', err))
  bot.use(botModule.bot || botModule.botHandler || botModule)
  return init(bot)
    .then(() => bot.launch({ webhook }))
    .then(() => !silent && console.log(`μ-bot: Bot started`))
}

module.exports = Object.assign(Telegraf, { Stage, Scene, WizardScene, start: start })
