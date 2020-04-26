const qs = require('query-string')
const fetch = require('../fetch')
exports.getHTML = (url, query) => {
  /**
   * For moments, Twitter oembed doesn't work with urls using 'events', they should
   * use 'moments', even though they redirect from 'moments' to 'events' on the browser.
   */
  const twitterUrl = url.replace('events', 'moments');
  let apiEndpoint = `https://publish.twitter.com/oembed?url=${twitterUrl}&dnt=true&omit_script=true`
  if (query) {
    apiEndpoint = `${apiEndpoint}&${qs.stringify(query)}`
  }
  return fetch(
    apiEndpoint
  ).then(({ html }) => {
    return [html]
      .map((s) => s.replace(/\?ref_src=twsrc.*?fw/g, ''))
      .map((s) => s.replace(/<br>/g, '<br />'))
      .map((s) => s.replace(/class=\"twitter-tweet\"/g, 'class="twitter-tweet" data-width="520" style="margin:10px 0;"'))
      .join('')
      .trim()
  }

  );
};