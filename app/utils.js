const { load } = require('cheerio')

class Extractor {
  constructor (predicate = () => undefined) {
    this.canHandle = predicate
    this.contentRules = []
    this.titleRules = []
    this.authorNameRules = []
    this.authorUrlRules = []
  }

  title (rule, extractFn = extractSelector) {
    this.titleRules.push({ rule, extractFn })
    return this
  }

  authorName (rule, extractFn = extractSelector) {
    this.authorNameRules.push({ rule, extractFn })
    return this
  }

  authorUrl (rule, extractFn = extractSelector) {
    this.authorUrlRules.push({ rule, extractFn })
    return this
  }

  content (rule, extractFn = extractSelector) {
    this.contentRules.push({ rule, extractFn })
    return this
  }

  run (url, $, rules) {
    return rules.map(({ rule, extractFn }) => extractFn(rule($, url), extractFn)).filter(x => x)
  }

  extract (url, text) {
    const $ = load(text, {
      normalizeWhitespace: true,
      decodeEntities: false
    })
    return {
      title: this.run(url, $, this.titleRules)[0],
      authorName: this.run(url, $, this.authorNameRules)[0],
      authorUrl: this.run(url, $, this.authorUrlRules)[0],
      content: this.run(url, $, this.contentRules).reduce((acc, next) => acc.concat(next), []).filter((x) => x)
    }
  }
}

function normalizeHeading (tag) {
  switch (tag) {
    case 'h1':
    case 'h2':
      return 'h3'
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return 'h4'
    default:
      return tag
  }
}

function makeTag (name, attrs = {}, children) {
  const result = { tag: normalizeHeading(name) }
  if (attrs.href) {
    result.attrs = { href: attrs.href }
  }
  if (attrs.src) {
    result.attrs = Object.assign({ src: attrs.src }, result.attrs)
  }
  if (children) {
    result.children = children
  }
  return result
}

function extractSelector (selector, extractFn = extractSelector) {
  if (selector == null) {
    return selector
  }
  if (typeof selector === 'string') {
    return selector
  }
  if (typeof selector.children === 'function' && selector.children().length > 0) {
    return selector.get().map((elem) => extractFn(elem, extractFn)).filter(x => x)
  }
  const node = (typeof selector.get === 'function' && selector.get()) || selector
  if (node.type === 'text') {
    return selector.data
  }
  if (Array.isArray(node)) {
    return node.map((elem) => extractFn(elem, extractFn)).filter(x => x)
  }
  let childs
  if (Array.isArray(node.children) && node.children.length > 0) {
    childs = node.children.map((elem) => extractFn(elem, extractFn)).filter(x => x)
  }
  return makeTag(node.name.toLowerCase(), node.attribs, childs)
}

module.exports.Extractor = Extractor
module.exports.extractSelector = extractSelector
