const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path')
const { getTemplateValue } = require('../utils/string')
// Get document, or throw exception on error
let defaultConfig, userConfig;
try {
  defaultConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './default-site-config.yaml'), 'utf8'));
} catch (e) {
  console.error('load default yaml error', e);
}

try {
  userConfig = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, '../bloga.yaml'), 'utf8'));
} catch (e) {
  console.log('There is no user config, use default config');
}
const config = Object.assign({

}, defaultConfig, userConfig)

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
const iterate = (obj, ...parentKeys) => {
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (typeof value === 'object' && value !== null) {
      if (parentKeys) {
        iterate(obj[key], ...parentKeys, key)
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
        if (parentKeys && parentKeys.length > 0) {
          const keysLength = parentKeys.length;
          if (keysLength === 8) {
            config[parentKeys[0]][parentKeys[1]][parentKeys[2]][parentKeys[3]][parentKeys[4]][parentKeys[5]][parentKeys[6]][parentKeys[7]][key] = newValue
          }
          else if (keysLength === 7) {
            config[parentKeys[0]][parentKeys[1]][parentKeys[2]][parentKeys[3]][parentKeys[4]][parentKeys[5]][parentKeys[6]][key] = newValue
          }
          else if (keysLength === 6) {
            config[parentKeys[0]][parentKeys[1]][parentKeys[2]][parentKeys[3]][parentKeys[4]][parentKeys[5]][key] = newValue
          }
          else if (keysLength === 5) {
            config[parentKeys[0]][parentKeys[1]][parentKeys[2]][parentKeys[3]][parentKeys[4]][key] = newValue
          }
          else if (keysLength === 4) {
            config[parentKeys[0]][parentKeys[1]][parentKeys[2]][parentKeys[3]][key] = newValue
          }
          else if (keysLength === 3) {
            config[parentKeys[0]][parentKeys[1]][parentKeys[2]][key] = newValue
          } else if (keysLength === 2) {
            config[parentKeys[0]][parentKeys[1]][key] = newValue

          } else if (keysLength === 1) {
            config[parentKeys[0]][key] = newValue
          }

        } else {
          config[key] = newValue
        }

      }
    }
  })
}
iterate(config)

module.exports = config;
