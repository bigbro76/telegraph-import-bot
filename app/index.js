const { Composer, Extra, Markup, optional } = require('micro-bot')
const { parse } = require('url')
const RateLimit = require('telegraf-ratelimit')
const fetch = require('node-fetch')
const Telegraph = require('telegra.ph')

const extractors = [
  require('./extractors/androidpolice.com'),
  require('./extractors/vc.ru'),
  require('./extractors/tjournal.ru'),
  require('./extractors/pikabu.ru')
]

async function importPage (url) {
const extractor = extractors.find((extractor) => extractor.canHandle(url))
  if (!extractor) {
    return

  }
  const client = new Telegraph()
  const account = await client.createAccount('Telegraph Importer Bot')
  client.token = account.access_token
  const text = await fetch(url, { size: 512 * 1024 }).then((res) => res.text())
  const { title, content, authorName, authorUrl } = extractor.extract(url, text)
  const page = await client.createPage(title, content, authorName, authorUrl, true)
  return { account, page }
}

const limiter = new RateLimit({
  window: 5000,
  limit: 10,
  onLimitExceeded: (ctx, next) => ctx.reply('Wow, slow down!')
})

const bot = new Composer()
bot.use(limiter)
bot.on('text', optional((ctx) => parse(ctx.message.text).protocol, async (ctx) => {
  const url = ctx.message.text
  ctx.replyWithChatAction('typing')
  try {
    const imported = await importPage(url)
    if (!imported) {
      return ctx.reply("Can't import provided url 😕")
    }
    ctx.reply(`<b>Import complete</b>\n${imported.page.url}`, Extra.HTML()
        .webPreview(false)
        .markup(Markup.inlineKeyboard([Markup.urlButton('Login for edit', imported.account.auth_url)]))
    )
  } catch (err) {
    console.log(err)
    ctx.reply(`🚨<b>Oops!</b>\n<pre>${err.message}</pre>`, Extra.HTML())
  }
}))

bot.on('message', (ctx) => ctx.reply('Send me link please'))

module.exports = bot
