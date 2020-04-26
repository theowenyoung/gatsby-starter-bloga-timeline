require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})
const urljoin = require("url-join");
const path = require("path");
const low = require('lowdb')
const buildConfig = require('./data/BuildConfig')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(buildConfig.cacheDbPath)
const db = low(adapter);
db.defaults({})
  .write();


const buildCache = db.get(buildConfig.buildCacheKey).value();
console.log('last build:', buildCache);

const config = require("./data/SiteConfig");
const {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_BEARER_TOKEN,
  INSTAGRAM_ACCESS_TOKEN
} = process.env;
module.exports = {
  pathPrefix: config.pathPrefix === "" ? "/" : config.pathPrefix,
  siteMetadata: {
    ...config,
    siteUrl: urljoin(config.siteUrl, config.pathPrefix),
    rssMetadata: {
      site_url: urljoin(config.siteUrl, config.pathPrefix),
      feed_url: urljoin(config.siteUrl, config.pathPrefix, config.siteRss),
      title: config.siteTitle,
      description: config.siteDescription,
      image_url: `${urljoin(
        config.siteUrl,
        config.pathPrefix
      )}/logos/logo-512.png`,
      copyright: config.copyright
    }
  },
  plugins: [
    {
      resolve: `@theowenyoung/gatsby-source-git`,
      options: {
        name: `blog`,
        remote: `https://github.com/theowenyoung/blog.git`,
        branch: 'master',
        // Optionally supply a branch. If none supplied, you'll get the default branch.
        // Tailor which files get imported eg. import the docs folder from a codebase.
        patterns: `content/**`
      }
    },
    {
      resolve: `@theowenyoung/gatsby-source-twitter`,
      options: {
        credentials: {
          consumer_key: TWITTER_CONSUMER_KEY,
          consumer_secret: TWITTER_CONSUMER_SECRET,
          bearer_token: TWITTER_BEARER_TOKEN,
        },
        queries: {
          tweets: {
            endpoint: "statuses/user_timeline",
            maxCount: db.get(buildConfig.buildCacheKey).value() ? 200 : 3200,
            params: {
              screen_name: "TheOwenYoung",
              include_rts: true,
              count: 200,
              exclude_replies: true,
              tweet_mode: "extended",
            },
          },

        },
      },
    },
    {
      resolve: `@theowenyoung/gatsby-source-instagram`,
      options: {
        access_token: INSTAGRAM_ACCESS_TOKEN,
        instagram_id: "17841432487737681",
        // endpoint: "https://graph.instagram.com",
        paginate: 100,
        maxPosts: db.get(buildConfig.buildCacheKey).value() ? 100 : 10000,
      },
    },
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
        icon: "static/logos/logo-1024.png"
      }
    },
    "gatsby-plugin-offline",
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        modulePath: path.resolve("src/netlifycms/index.js"), // default: undefined
        enableIdentityWidget: true,
        publicPath: "admin",
        htmlTitle: "Content Manager",
        includeRobots: false
      }
    },
    `gatsby-plugin-netlify`,
    {
      resolve: "@theowenyoung/gatsby-plugin-feed",
      options: {
        setup(ref) {
          const ret = ref.query.site.siteMetadata.rssMetadata;
          ret.allMarkdownRemark = ref.query.allMarkdownRemark;
          ret.generator = "@theowenyoung/gatsby-plugin-feed";
          return ret;
        },
        query: `
        {
          site {
            siteMetadata {
              rssMetadata {
                site_url
                feed_url
                title
                description
                image_url
                copyright
              }
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
                    rssMetadata {
                      site_url
                      feed_url
                      title
                      description
                      image_url
                      copyright
                    }
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
                const type = node.parent.internal.type;

                const id = node.parent.id;

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
                allTwitterStatusesUserTimelineTweets(filter: {id: {in: ${JSON.stringify(allTweetIds)}}}) {
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
                allInstaNode(filter: {id: {in: ${JSON.stringify(allInstagramIds)}}}) {
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
              console.log('entitiesResults.allInstaNode', entitiesResults.allInstaNode);

              entitiesResults.allMarkdownRemark.edges.forEach(({ node }) => {
                markdownRemarkEntities[node.id] = node;
              });
              entitiesResults.allTwitterStatusesUserTimelineTweets.edges.forEach(({ node }) => {
                tweetEntities[node.id] = node;
              })
              entitiesResults.allInstaNode.edges.forEach(({ node }) => {
                instagramEntities[node.id] = node;
              })
              const rssMetadata = allTimelineResult.site.siteMetadata.rssMetadata;

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
                let categories = [], title, description, url, guid, custom_elements = [];
                if (type === 'MarkdownRemark' || type === 'twitterStatusesUserTimelineTweets' || type === 'InstaNode') {
                  if (type === 'MarkdownRemark') {
                    const node = markdownRemarkEntities[id];
                    categories = node.frontmatter.tags;
                    title = node.frontmatter.title || node.excerpt.substring(0, 50);
                    description = node.excerpt;
                    url = rssMetadata.site_url + slug
                    guid = rssMetadata.site_url + slug;
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
                    title = node.full_text.substring(0, 50);
                    description = node.full_text;
                    url = `https://twitter.com/${node.user.screen_name}/status/${node.id_str}`
                    guid = url;
                    custom_elements = [
                      { "content:encoded": node.fields.html },
                      { author: config.userEmail }
                    ]
                  }
                  let item = {
                    categories,
                    date,
                    title,
                    description,
                    url,
                    guid,
                    custom_elements
                  };

                  return item;
                } else {
                  return false
                }
              }).filter(item => item);
              return {
                items
              }

            },
            output: config.siteRss,
            title: config.siteRssTitle
          }
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-zeit-now',
    }
  ]
};
