const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path')
const { getTemplateValue } = require('../utils/string')
const _ = require('lodash')
const requestSync = require('sync-request');
// Get document, or throw exception on error
let defaultConfig, userRemoteConfig, userLocalConfig;
try {
  defaultConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './default-site-config.yaml'), 'utf8'));
} catch (e) {
  console.error('load default yaml error', e);
}

// try go get remote bloga config 
try {
  // TODO add api key 
  if (process.env.BLOGA_CONFIG) {
    const res = requestSync('GET', process.env.BLOGA_CONFIG, {
      socketTimeout: 10000,
      timeout: 100000,
    });
    const blogaConfigResult = res.getBody('utf8');
    userRemoteConfig = yaml.safeLoad(blogaConfigResult, 'utf8');
    console.log('detect bloga remote config');
  }

} catch (e) {
  console.error('There is no user config or load user config error, use default config', e);
  process.exit()
  throw e;
}

// try go get local bloga config 
try {

  let localBlogaConfig = path.resolve(__dirname, '../bloga.yaml');

  if (fs.existsSync(localBlogaConfig)) {

    userLocalConfig = yaml.safeLoad(fs.readFileSync(localBlogaConfig, 'utf8'), 'utf8');
    console.log('detect bloga local config');
  }

} catch (e) {
  console.error('There is no user config or load user config error, use default config', e);
  process.exit()
  throw e;
}

const config = Object.assign({

}, defaultConfig, userRemoteConfig, userLocalConfig)

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

// parse the final value
const iterate = (obj, keyPath) => {
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (typeof value === 'object' && value !== null) {
      if (keyPath) {
        iterate(obj[key], `${keyPath}[${key}]`)
      } else {
        iterate(obj[key], key)

      }
    } else {
      // simple value
      if (typeof value === 'string') {
        // convert to template value

        const newValue = getTemplateValue(value, {
          env: process.env,
          date: {
            year: new Date().getFullYear(),
          },
          config: config
        })
        if (keyPath) {
          _.set(config, `${keyPath}[${key}]`, newValue)
        } else {
          config[key] = newValue
        }

      }
    }
  })
}
iterate(config);

module.exports = config;
