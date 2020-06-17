const hashtag = require('hashtag');
const _ = require("lodash");

const {HashtagParser} = hashtag;
exports.getTags = function (text) {
  const h = new HashtagParser(text, "#", "[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]")
  return h.tags
}


exports.getTemplateValue = function (text, ctx) {
  _.templateSettings.interpolate = /\${{([\s\S]+?)}}/g;
  const compiled = _.template(text);
  return compiled(ctx);

}

