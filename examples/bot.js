const { Composer } = require('micro-bot')
const bot = new Composer()

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Help message'))
bot.hears('hi', ({ reply }) => reply('Hello'))
bot.on('sticker', ({ reply }) => reply('👍'))
bot.on('message', ({ reply }) => reply('👋'))

module.exports = bot
