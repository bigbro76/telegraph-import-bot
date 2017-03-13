const { Extractor } = require ( './../utils' )
const 
pikabu = new Extractor ((url)  =>  url.startsWith  ('http://pikabu.ru'
 ))
      pikabu.title (($) => $('.page-story .story .story__main .story__header.first_story .story__header-title a.story__title-link').text())
pikabu.authorName(($) => $('.page-story .story .story__main .story__header.first_story .story__header-additional .story__header-additional-             wrapper a.story__author').text ())
pikabu.authorUrl (($, url) => $('.page-story.story .story__main .story__header.first_story .story__header-additional .story__header-additional-wrapper a.story__author').attr( 'href' ))
pikabu.content (($) => $('.page-story .story .story__main .b-story__content.b-story-blocks .b-story-block' ))

module.exports = pikabu

