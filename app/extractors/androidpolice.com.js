const { Extractor } = require('./../utils')

const androidpolice = new Extractor((url) => url.startsWith('http://www.androidpolice.com'))

androidpolice.title(($) => $('.post-header h2').text())
androidpolice.authorName(($) => $('.author-name').text())
androidpolice.authorUrl(($, url) => url)
androidpolice.content(($) => $('.post-hero-single img'))
androidpolice.content(($) => $('.post-content p, .post-content p iframe'))

module.exports = androidpolice
