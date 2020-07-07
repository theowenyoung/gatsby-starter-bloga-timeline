require("dotenv").config()

// console.log('BLOGA_SITE_CONFIG_URL',process.env.BLOGA_SITE_CONFIG_URL)
// before use this config, make sure you have already run `bloga-gatsby init` successfully.
const {Config} = require('bloga-gatsby')

const gatsbyConfig = new Config('./_gatsby.config').toConfig()
// console.log('finalConfig', JSON.stringify(gatsbyConfig, null, 2))

module.exports = gatsbyConfig
