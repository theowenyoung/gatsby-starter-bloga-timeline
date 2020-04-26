const wrapFetch = require('fetch-retry');
const nodeFetch = require('node-fetch');

const fetchWithRetries = wrapFetch(nodeFetch);
const fetch = (url) =>
  fetchWithRetries(url, {
    retries: 3,
    retryDelay: (attempt) => 2 ** attempt * 1000,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Request to ${url} returned non-OK status (${response.status})`
        );
      }

      return response;
    })
    .then((data) => data.json());

module.exports = fetch;