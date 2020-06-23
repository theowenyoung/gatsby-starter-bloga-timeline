const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path')
// Get document, or throw exception on error
let defaultConfig;
try {
  defaultConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './default-site-config.yaml'), 'utf8'));
} catch (e) {
  console.error('load default yaml error', e);
}


const config = { ...defaultConfig}

// Validate

// Make sure pathPrefix is empty if not needed
if (config.pathPrefix === "/") {
  config.pathPrefix = "";
} else {
  // Make sure pathPrefix only contains the first forward slash
  config.pathPrefix = `/${config.pathPrefix.replace(/^\/|\/$/g, "")}`;
}

// Make sure siteUrl doesn't have an ending forward slash
if (config.siteUrl.substr(-1) === "/")
  config.siteUrl = config.siteUrl.slice(0, -1);

// Make sure siteRss has a starting forward slash
if (config.siteRss && config.siteRss[0] !== "/")
  config.siteRss = `/${config.siteRss}`;

module.exports = config;
