const { Extractor } = require('./../utils')

const vc = new Extractor((url) => url.startsWith('https://vc.ru'))

vc.title(($) => $('.b-article__head h1').text())
vc.authorName(($) => $('.b-article__infopanel__author a').text())
vc.authorUrl(($, url) => url)
vc.content(($) => $('.b-article__intro p, article p, article img, article h2, article h3, article h4, article h5'))

module.exports = vc
