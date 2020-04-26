const qs = require('query-string')
const fetch = require('../fetch')
exports.getHTML = (url, query) => {
  /**
   * For moments, Twitter oembed doesn't work with urls using 'events', they should
   * use 'moments', even though they redirect from 'moments' to 'events' on the browser.
   */
  let apiEndpoint = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true&maxwidth=520`;
  if (query) {
    apiEndpoint = `${apiEndpoint}&${qs.stringify(query)}`
  }
  return fetch(
    apiEndpoint
  ).then(({ html }) => {
    return html
  }

  );
};