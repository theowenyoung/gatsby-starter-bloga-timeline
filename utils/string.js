const hashtag = require('hashtag')
const HashtagParser = hashtag.HashtagParser;
exports.getTags = function (text) {
  const h = new HashtagParser(text, "#", "[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]")
  return h.tags
}
