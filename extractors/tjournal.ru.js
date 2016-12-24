const { Extractor } = require('./../utils')

const tjournal = new Extractor((url) => url.startsWith('https://tjournal.ru'))

tjournal.title(($) => $('.b-article__title h1').text())
tjournal.authorName(($) => $('.b-article__infoline__author').text())
tjournal.authorUrl(($, url) => url)
tjournal.content(($) => $('article p, article blockquote p, article h2, article iframe, .wrapper-image img, .wrapper-image span, .wrapper-video iframe'))

module.exports = tjournal
