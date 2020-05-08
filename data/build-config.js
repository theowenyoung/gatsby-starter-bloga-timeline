const path = require("path");
const fse = require('fs-extra')

const cacheDbPath = path.resolve(__dirname, '../.cache/blog-config-cache/config.json')
// ensure 
fse.ensureFileSync(cacheDbPath);

const config = {
  buildCacheKey: "BUILD_CACHE_KEY_2020_04_21",
  cacheDbPath
}

module.exports = config;