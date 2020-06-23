require("dotenv").config()
const urljoin = require("url-join");
const path = require("path");
const GitUrlParse = require("git-url-parse");
const _ = require('lodash')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const buildConfig = require('./data/build-config')
const config = require("./data/site-config");

const adapter = new FileSync(buildConfig.cacheDbPath)
const db = low(adapter);
db.defaults({})
  .write();

const buildCache = db.get(buildConfig.buildCacheKey).value();
console.log('last build:', buildCache);

const plugins = []

const sources = config.sources || [];

sources.forEach((source, index) => {
  if (source.provider === 'git') {
    const gitObj = GitUrlParse(source.remote)
    plugins.push({
      resolve: `@theowenyoung/gatsby-source-git`,
      options: {
        name: `${gitObj.name}${index}`,
        remote: source.remote,
        branch: source.branch,
        // Optionally supply a branch. If none supplied, you'll get the default branch.
        // Tailor which files get imported eg. import the docs folder from a codebase.
        patterns: source.patterns
      }
    })
  }
  if (source.provider === 'twitter') {
    const {provider,credentials,...rest} = source
    console.log('rest',rest);
    const twitterOptions = {
      credentials: source.credentials,
      queries: {
        tweets: {
          endpoint: "statuses/user_timeline",
          maxCount: db.get(buildConfig.buildCacheKey).value() ? 200 : 3200,
          params: {include_rts: true,
            count: 200,
            exclude_replies: true,
            tweet_mode: "extended",...rest},
        },

      },
    };
    
    plugins.push({
      resolve: `@theowenyoung/gatsby-source-twitter`,
      options: twitterOptions
    })
  }

  if (source.provider === 'instagram') {

    plugins.push(
      {
        resolve: `@theowenyoung/gatsby-source-instagram`,
        options: {
          access_token: source.accessToken,
          instagram_id: source.instagramId,
          paginate: 100,
          maxPosts: db.get(buildConfig.buildCacheKey).value() ? 100 : 10000,
        },
      })
  }
})

const cloneConfig = _.cloneDeep(config);
delete cloneConfig.sources;
module.exports = {
  pathPrefix: config.pathPrefix === "" ? "/" : config.pathPrefix,
  siteMetadata: {
    ...cloneConfig,
    siteUrl: urljoin(config.siteUrl, config.pathPrefix),

  },
  plugins: plugins.concat([
    `gatsby-plugin-emotion`,
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-lodash",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "assets",
        path: `${__dirname}/static/`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/`
      }
    },
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: 'Site',
        imagePath: 'siteMetadata.siteLogo',
        name: "localSiteLogo"
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-embedder`,
            options: {
              customTransformers: [
                // Your custom transformers
              ],
              services: {
                // The service-specific options by the name of the service
              },
            },
          },
          {
            resolve: `gatsby-remark-relative-images`
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 690
            }
          },
          {
            resolve: "gatsby-remark-responsive-iframe"
          },
          "gatsby-remark-copy-linked-files",
          {
            resolve: `gatsby-remark-autolink-headers`
          },
          "gatsby-remark-prismjs",
          {
            resolve: `@theowenyoung/gatsby-remark-default-html-attrs`,
            options: {
              'heading > link[url^=#]': {
                style: "display:none"
              },// for rss render better, and post listing render better

            }
          }
        ]
      }
    },
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: config.googleAnalyticsID
      }
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: config.themeColor
      }
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-catch-links",
    "gatsby-plugin-twitter",
    `gatsby-plugin-instagram`,
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: config.siteTitle,
        short_name: config.siteTitleShort,
        description: config.siteDescription,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: "minimal-ui",
        icon: "static/logos/logo.png"
      }
    },
    "gatsby-plugin-offline",
    // {
    //   resolve: "gatsby-plugin-netlify-cms",
    //   options: {
    //     modulePath: path.resolve("src/netlifycms/index.js"), // default: undefined
    //     enableIdentityWidget: true,
    //     publicPath: "admin",
    //     htmlTitle: "Content Manager",
    //     includeRobots: false
    //   }
    // },
    `gatsby-plugin-netlify`,
    {
      resolve: "@theowenyoung/gatsby-plugin-feed",
      options: {
        setup(ref) {
          const {siteMetadata} = ref.query.site;
          const ret = {
            site_url: siteMetadata.siteUrl,
            feed_url: urljoin(siteMetadata.siteUrl, siteMetadata.siteRss),
            title: siteMetadata.siteTitle,
            description: siteMetadata.siteDescription,
            image_url: siteMetadata.siteLogo,
            copyright: siteMetadata.copyright
          }
          ret.allMarkdownRemark = ref.query.allMarkdownRemark;
          ret.generator = "@theowenyoung/gatsby-plugin-feed";
          return ret;
        },
        query: `
        {
          site {
            siteMetadata {
              siteUrl
              siteTitle
              siteLogo
              copyright
              siteDescription
              siteRss
            }
          }
        }
      `,
        feeds: [
          {
            serialize(ctx) {
              return ctx.query.items;
            },
            customQuery: async ({
              runQuery
            }) => {
              const allTimelineResult = await runQuery(`
              query ListingQuery {
                site {
                  siteMetadata {
                    siteUrl
                  }
                }
                allTimeline(
                  sort: { fields: date, order: DESC }
                  limit: 30
                ) {
                  edges {
                    node {
                      slug
                      date
                      parent {
                        internal {
                          type
                        }
                        id
                      }
                    }
                  }
                }
              }
            `);
              const allMarkdownRemarkIds = [];
              const allTweetIds = [];
              const allInstagramIds = []
              allTimelineResult.allTimeline.edges.forEach(({ node }) => {
                const {type} = node.parent.internal;

                const {id} = node.parent;

                if (type === 'MarkdownRemark') {
                  allMarkdownRemarkIds.push(id)
                } else if (type === 'twitterStatusesUserTimelineTweets') {
                  allTweetIds.push(id)
                } else if (type === 'InstaNode') {
                  allInstagramIds.push(id)
                }
              })

              const query = `
              query EntitiesQuery {
                allMarkdownRemark(filter: {id: {in: ${JSON.stringify(allMarkdownRemarkIds)}}}) {
                  edges {
                    node {
                      id
                      html
                      excerpt(pruneLength: 200)
                      frontmatter {
                        title
                        tags
                      }
                    }
                  }
                }
                allTwitterStatusesUserTimelineTweets(filter: {id: {in: ${JSON.stringify(allTweetIds)}}}) @include(if: ${JSON.stringify(allTweetIds.length > 0)}) {
                  edges {
                    node {
                      id
                      id_str
                      full_text
                      fields {
                        html
                      }
                      user {
                        screen_name
                      }
                    }
                  }
                }
                allInstaNode(filter: {id: {in: ${JSON.stringify(allInstagramIds)}}}) @include(if: ${JSON.stringify(allInstagramIds.length > 0)}) {
                  edges {
                    node {
                      id
                      caption
                      fields {
                        html
                      }
                    }
                  }
                }
              }
              
              `

              // get markdownRemark Entities
              const entitiesResults = await runQuery(query)
              const markdownRemarkEntities = {};
              const tweetEntities = {};
              const instagramEntities = {}
              if (entitiesResults.allMarkdownRemark) {
                entitiesResults.allMarkdownRemark.edges.forEach(({ node }) => {
                  markdownRemarkEntities[node.id] = node;
                });
              }
              if (entitiesResults.allTwitterStatusesUserTimelineTweets) {
                entitiesResults.allTwitterStatusesUserTimelineTweets.edges.forEach(({ node }) => {
                  tweetEntities[node.id] = node;
                })
              }
              if (entitiesResults.allInstaNode) {
                entitiesResults.allInstaNode.edges.forEach(({ node }) => {
                  instagramEntities[node.id] = node;
                })
              }


              const {siteMetadata} = allTimelineResult.site;

              const items = allTimelineResult.allTimeline.edges.map(({ node: {
                date,
                slug,
                parent: {
                  id,
                  internal: {
                    type
                  }
                }
              } }) => {
                let categories = []; let title; let description; let url; let guid; let custom_elements = [];
                if (type === 'MarkdownRemark' || type === 'twitterStatusesUserTimelineTweets' || type === 'InstaNode') {
                  if (type === 'MarkdownRemark') {
                    const node = markdownRemarkEntities[id];
                    categories = node.frontmatter.tags;
                    title = node.frontmatter.title || node.excerpt.substring(0, 50);
                    description = node.excerpt;
                    url = siteMetadata.siteUrl + slug
                    guid = siteMetadata.siteUrl + slug;
                    custom_elements = [
                      { "content:encoded": node.html },
                      { author: config.userEmail }
                    ]
                  } else if (type === 'twitterStatusesUserTimelineTweets') {
                    const node = tweetEntities[id];

                    if (node.fields && node.fields.tags) {
                      node.fields.tags.forEach(hushTag => {
                        const tag = hushTag;
                        categories.push(tag)
                      })
                    }
                    title = node.full_text?node.full_text.substring(0, 50):"";
                    description = node.full_text;
                    url = `https://twitter.com/${node.user.screen_name}/status/${node.id_str}`
                    guid = url;
                    custom_elements = [
                      { "content:encoded": node.fields.html },
                      { author: config.userEmail }
                    ]
                  }
                  const item = {
                    categories,
                    date,
                    title,
                    description,
                    url,
                    guid,
                    custom_elements
                  };

                  return item;
                } 
                  return false
                
              }).filter(item => item);
              return {
                items
              }

            },
            output: config.siteRss,
            title: config.siteTitle
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-zeit-now',
    },
    'gatsby-plugin-robots-txt'
  ])
};
