const { Extractor } = require('./../utils')

const tjournal = new Extractor((url) => url.startsWith('https://vc.ru'))

tjournal.title(($) => $('.b-article__head h1').text())
tjournal.authorName(($) => $('.b-article__infopanel__author a').text())
tjournal.authorUrl(($, url) => url)
tjournal.content(($) => $('.b-article__intro p, article p, article img, article h2, article h3, article h4, article h5'))

module.exports = tjournal
