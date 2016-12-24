const { Extractor } = require('./../utils')

const tjournal = new Extractor((url) => url.startsWith('http://www.androidpolice.com'))

tjournal.title(($) => $('.post-header h2').text())
tjournal.authorName(($) => $('.author-name').text())
tjournal.authorUrl(($, url) => url)
tjournal.content(($) => $('.post-hero-single img'))
tjournal.content(($) => $('.post-content p, .post-content p iframe'))

module.exports = tjournal
