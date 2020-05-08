/* eslint "no-console": "off" */

const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const fse = require('fs-extra')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const twitterEmbed = require('./utils/transformers/tweet')
const instagramEmbed = require('./utils/transformers/instagram')

const siteConfig = require("./data/site-config");
const { getFileLastCommitDate } = require('./utils/date')
const { getTags } = require('./utils/string')
const buildConfig = require('./data/build-config');

const adapter = new FileSync(buildConfig.cacheDbPath)
const db = low(adapter)
db.defaults({})
  .write();
exports.sourceNodes = async ({
  getNodes,
  graphql,
}) => {
  console.log('source node');
}
exports.createResolvers = async function ({
  getNodes, createNodeId, actions, createContentDigest, ...rest
}) {
  const globalTagsEntities = {}

  const { createNode } = actions
  console.log('createResolvers');
  const nodes = getNodes()
  nodes.forEach(node => {

    // create timeline node
    if (node.internal.type === "MarkdownRemark" || node.internal.type === "twitterStatusesUserTimelineTweets" || node.internal.type === "InstaNode") {
      const { date, slug } = node.fields
      createNode({
        id: createNodeId(`timeline-${node.id}`),
        date,
        slug,
        children: [],
        parent: node.id,
        internal: {
          type: "Timeline",
          contentDigest: createContentDigest(`timeline-${node.id}`)
        },
      })

      if (node.internal.type === 'MarkdownRemark') {
        // create tags
        if (node.frontmatter && node.frontmatter.tags) {
          node.frontmatter.tags.forEach(tag => {
            const tagEntity = {
              tag,
              date,
            }
            if (globalTagsEntities[tag]) {
              globalTagsEntities[tag].push(tagEntity)
            } else {
              globalTagsEntities[tag] = [tagEntity]
            }
            createNode({
              id: createNodeId(`tag-timeline-${tag}-${node.id}`),
              tag,
              slug,
              date,
              children: [],
              parent: node.id,
              internal: {
                type: "TagTimeline",
                contentDigest: createContentDigest(`tag-timeline-${tag}-${node.id}`)
              },
            })
          })
        }
      }
      if (node.internal.type === "twitterStatusesUserTimelineTweets") {
        // create tags

        if (node.entities && node.entities.hashtags) {
          node.fields.tags.forEach(hushTag => {
            const tag = hushTag;
            const tagEntity = {
              tag,
              date,
            }
            if (globalTagsEntities[tag]) {
              globalTagsEntities[tag].push(tagEntity)
            } else {
              globalTagsEntities[tag] = [tagEntity]
            }
            createNode({
              id: createNodeId(`tag-timeline-${tag}-${node.id}`),
              tag,
              slug,
              date,
              children: [],
              parent: node.id,
              internal: {
                type: "TagTimeline",
                contentDigest: createContentDigest(`tag-timeline-${tag}-${node.id}`)
              },
            })
          })
        }
      }
      if (node.internal.type === "InstaNode") {
        // create tags
        // add instagram tag
        const hashtags = node.fields.tags;
        if (hashtags) {
          hashtags.forEach(hushTag => {
            const tag = hushTag;
            const tagEntity = {
              tag,
              date,
            }
            if (globalTagsEntities[tag]) {
              globalTagsEntities[tag].push(tagEntity)
            } else {
              globalTagsEntities[tag] = [tagEntity]
            }
            createNode({
              id: createNodeId(`tag-timeline-${tag}-${node.id}`),
              tag,
              slug,
              date,
              children: [],
              parent: node.id,
              internal: {
                type: "TagTimeline",
                contentDigest: createContentDigest(`tag-timeline-${tag}-${node.id}`)
              },
            })
          })
        }
      }
    }

  })



  const tagsKeys = Object.keys(globalTagsEntities)
  // create tag node
  tagsKeys.forEach(key => {
    // calculate list number
    const list = globalTagsEntities[key]
    const totalCount = list.length;
    // sort
    list.sort((a, b) => {
      const aDate = moment(a.date)
      const bDate = moment(b.date)
      if (aDate > bDate) {
        return -1
      }
      if (aDate < bDate) {
        return 1
      }
      return 0
    })

    const lastUpdatedDate = list[0].date;
    const tagNode = {
      id: createNodeId(`tag-${key}`),
      tag: key,
      slug: `/tags/${_.kebabCase(key)}/`,
      date: lastUpdatedDate,
      children: [],
      parent: null,
      postCount: totalCount,
      internal: {
        type: "Tag",
        contentDigest: createContentDigest(`tag-${key}`)
      },
    };



    createNode(tagNode)
  })
  console.log('createResolvers end');

}
exports.onCreateNode = async ({ node, actions, getNode, createNodeId, createContentDigest, cache }) => {

  const { createNodeField, createNode } = actions;
  let slug; let date;
  if (node.internal.type === "MarkdownRemark") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      node.frontmatter &&
      node.frontmatter.title
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      slug = `/${(parsedFilePath.dir)}/${_.kebabCase(parsedFilePath.name)}/`;
    } else if (parsedFilePath.dir === "") {
      slug = `/${_.kebabCase(parsedFilePath.name)}/`;
    } else {
      slug = `/${(parsedFilePath.dir)}/`;
    }

    if (node.frontmatter) {
      if (node.frontmatter.slug)
        slug = `/${_.kebabCase(node.frontmatter.slug)}`;
      if (node.frontmatter.date) {
        date = moment(node.frontmatter.date, siteConfig.dateFromFormat);
        if (!date.isValid)
          console.warn(`WARNING: Invalid date.`, node.frontmatter);

      }
    }
    slug = `/post${slug}`;
    // date

    if (!date) {
      try {
        date = await getFileLastCommitDate(node.fileAbsolutePath);
        date = moment(date)
      } catch (error) {
        // default
        date = moment(new Date())
      }

    }
    createNodeField({ node, name: "date", value: date.toISOString() });
    createNodeField({ node, name: "slug", value: slug });



  }

  // twitter
  if (node.internal.type === "twitterStatusesUserTimelineTweets") {
    date = moment(node.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en');
    if (!date.isValid)
      console.warn(`WARNING: Invalid date.`, node.created_at);

    createNodeField({ node, name: "date", value: date.toISOString() });

    slug = `/tweet/${node.id_str}`
    createNodeField({ node, name: "slug", value: slug });

    // create tags
    let hashtags = []
    if (node.entitie && node.entities.hashtags) {
      hashtags = node.entities.hashtags
    }

    if (hashtags.filter((item) => item.text === 'tweet').length === 0) {
      // add tweet tag for every tweet 
      hashtags.push({
        text: 'tweet'
      })
    }
    createNodeField({ node, name: "tags", value: hashtags.map(item => item.text) });


    // create embed html  
    try {
      const urlString = `https://twitter.com/${node.user.screen_name}/status/${node.id_str}`;
      let html = await cache.get(urlString);
      if (!html) {
        html = await twitterEmbed.getHTML(urlString, {
          width: 520
        })
        await cache.set(urlString, html);
      }
      createNodeField({ node, name: "html", value: html });

    } catch (error) {
      throw error;
    }

  }

  // instagram
  if (node.internal.type === "InstaNode") {
    date = moment(node.timestamp * 1000);
    if (!date.isValid)
      console.warn(`WARNING: Invalid date.`, node.created_at);

    createNodeField({ node, name: "date", value: date.toISOString() });

    slug = `/instagram/${node.id_str}`
    createNodeField({ node, name: "slug", value: slug });

    // create tag

    const hashtags = getTags(node.caption)
    if (hashtags.filter((item) => item.text === 'instagram').length === 0) {
      // add instagram tag for every instagram post 
      hashtags.push('instagram')
    }
    createNodeField({ node, name: "tags", value: hashtags });

    // create embed html  
    try {
      const urlString = `https://www.instagram.com/p/${node.id}/`
      let html = await cache.get(urlString);
      if (!html) {
        html = await instagramEmbed.getHTML(urlString, {
          width: 520
        })
        await cache.set(urlString, html);
      }
      createNodeField({ node, name: "html", value: html });

    } catch (error) {
      throw error;
    }

  }

};
exports.onCreatePage = (params) => {
  console.log('onCreatePage');

}
exports.createPages = async ({ graphql, actions, createNodeId, createContentDigest }) => {
  console.log('createPages');

  const { createPage, createNode } = actions;
  const postPage = path.resolve("src/templates/post.jsx");
  const tagPage = path.resolve("src/templates/tag.jsx");
  const listingPage = path.resolve("./src/templates/listing.jsx");
  const landingPage = path.resolve("./src/templates/landing.jsx");

  // Get a full list of all type posts
  const allTimelineResult = await graphql(`
    {
      allTimeline(sort: {fields: date, order: DESC}) {
        edges {
          node {
            id
            slug
            date
            parent {
              id
              internal {
                type
              }
            }
          }
        }
      }
    }
  `);

  if (allTimelineResult.errors) {
    console.error(allTimelineResult.errors);
    throw allTimelineResult.errors;
  }
  const postsEdges = allTimelineResult.data.allTimeline.edges;

  // Paging
  const { postsPerPage } = siteConfig;

  if (postsPerPage && postsEdges.length > 0) {
    const pageCount = Math.ceil(postsEdges.length / postsPerPage);
    [...Array(pageCount)].forEach((_val, pageNum) => {
      // calculate allMarkdownRemarkIds for page to get the markdownremark datas
      const allMarkdownRemarkIds = [];
      const allTwitterStatusesUserTimelineTweetsIds = [];
      const allInstaNodeIds = [];
      [...Array(postsPerPage)].forEach((_val, postIndex) => {
        const index = pageNum * postsPerPage + postIndex;
        if (postsEdges[index]) {
          if (postsEdges[index].node.parent.internal.type === 'MarkdownRemark') {
            allMarkdownRemarkIds.push(postsEdges[index].node.parent.id)
          }
          if (postsEdges[index].node.parent.internal.type === 'twitterStatusesUserTimelineTweets') {
            allTwitterStatusesUserTimelineTweetsIds.push(postsEdges[index].node.parent.id)
          }
          if (postsEdges[index].node.parent.internal.type === 'InstaNode') {
            allInstaNodeIds.push(postsEdges[index].node.parent.id)
          }
        }
      })
      const pagePrefix = `/`
      createPage({
        path: pageNum === 0 ? `/` : `/pages/${pageNum + 1}/`,
        component: listingPage,
        context: {
          limit: postsPerPage,
          skip: pageNum * postsPerPage,
          pageCount,
          pagePrefix,
          currentPageNum: pageNum + 1,
          allTwitterStatusesUserTimelineTweetsIds,
          allMarkdownRemarkIds,
          allInstaNodeIds,
          isIncludeMarkdownRemark: allMarkdownRemarkIds.length > 0,
          isIncludeTwitterStatusesUserTimelineTweets: allTwitterStatusesUserTimelineTweetsIds.length > 0,
          isIncludeInstaNode: allInstaNodeIds.length > 0
        }
      });
    });
  } else {
    // Load the landing page instead
    createPage({
      path: `/`,
      component: landingPage
    });
  }

  // Post page creating
  postsEdges.forEach((edge, index) => {
    // only markdown



    if (edge.node.parent.internal.type === 'MarkdownRemark') {
      // Create post pages
      const nextID = index + 1 < postsEdges.length ? index + 1 : 0;
      const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1;
      const nextEdge = postsEdges[nextID];
      const prevEdge = postsEdges[prevID];

      createPage({
        path: edge.node.slug,
        component: postPage,
        context: {
          slug: edge.node.slug,
          nexttitle: nextEdge.node.id,
          nextslug: nextEdge.node.slug,
          prevtitle: prevEdge.node.id,
          prevslug: prevEdge.node.slug
        }
      });
    }

  });

  // Get a full list of tag posts
  const allTagResult = await graphql(`
    {
      allTagTimeline(sort: {fields: date, order: DESC}) {
        edges {
          node {
            id
            slug
            date
            tag
            parent {
              id
              internal {
                type
              }
            }
          }
        }
      }
    }
  `);

  if (allTagResult.errors) {
    console.error(allTagResult.errors);
    throw allTagResult.errors;
  }
  const tagPostsEdges = allTagResult.data.allTagTimeline.edges;

  const tagsEntities = {};
  tagPostsEdges.forEach((tagPostNode) => {
    if (tagsEntities[tagPostNode.node.tag]) {
      tagsEntities[tagPostNode.node.tag].push(tagPostNode)
    } else {
      tagsEntities[tagPostNode.node.tag] = [tagPostNode]

    }
  })
  const tagKeys = Object.keys(tagsEntities)
  for (let i = 0; i < tagKeys.length; i++) {
    const tag = tagKeys[i];
    //  Create tag pages
    //  page 
    const tagPostsEdges = tagsEntities[tag];
    if (postsPerPage && tagPostsEdges.length > 0) {
      const pageCount = Math.ceil(tagPostsEdges.length / postsPerPage);
      for (let pageNum = 0; pageNum < pageCount; pageNum++) {
        const _val = pageNum + 1;
        // calculate allMarkdownRemarkIds for page to get the markdownremark datas
        const allMarkdownRemarkIds = [];
        const allTwitterStatusesUserTimelineTweetsIds = [];
        const allInstaNodeIds = [];
        [...Array(postsPerPage)].forEach((_val, postIndex) => {
          const index = pageNum * postsPerPage + postIndex;
          if (tagPostsEdges[index]) {
            if (tagPostsEdges[index].node.parent.internal.type === 'MarkdownRemark') {
              allMarkdownRemarkIds.push(tagPostsEdges[index].node.parent.id)
            }
            if (tagPostsEdges[index].node.parent.internal.type === 'twitterStatusesUserTimelineTweets') {
              allTwitterStatusesUserTimelineTweetsIds.push(tagPostsEdges[index].node.parent.id)
            }
            if (tagPostsEdges[index].node.parent.internal.type === 'InstaNode') {
              allInstaNodeIds.push(tagPostsEdges[index].node.parent.id)
            }
          }
        })
        const pagePrefix = `/tags/${_.kebabCase(tag)}/`
        const tagPagePath = pageNum === 0 ? pagePrefix : `${pagePrefix}pages/${pageNum + 1}/`
        // query
        createPage({
          path: tagPagePath,
          component: tagPage,
          context: {
            tag,
            limit: postsPerPage,
            skip: pageNum * postsPerPage,
            pageCount,
            pagePrefix,
            currentPageNum: pageNum + 1,
            allMarkdownRemarkIds,
            allTwitterStatusesUserTimelineTweetsIds,
            allInstaNodeIds,
            isIncludeMarkdownRemark: allMarkdownRemarkIds.length > 0,
            isIncludeTwitterStatusesUserTimelineTweets: allTwitterStatusesUserTimelineTweetsIds.length > 0,
            isIncludeInstaNode: allInstaNodeIds.length > 0
          }
        });
      }
    }

  }



};


exports.createSchemaCustomization = ({ actions }) => {
  console.log('createSchemaCustomization');

  const { createTypes } = actions

  const typeDefs = `
    type Tag implements Node @dontInfer {
      tag: String!
      postCount: Int!
      date: Date @dateformat
      slug: String!
    }
    type Timeline implements Node @dontInfer {
      date: Date @dateformat
      slug: String!
    }
    type TagTimeline implements Node @dontInfer {
      date: Date @dateformat
      slug: String!
      tag: String!
    }
    type Fields {
      html: String
      slug: String
      date: Date @dateformat
    }
    type TwitterUser {
      screen_name: String
    }
    type twitterStatusesUserTimelineTweets implements Node {
      fields: Fields
      id_str: String
      full_text: String
      user: TwitterUser
    }
    type InstaNode implements Node {
      fields: Fields
      caption: String
    }
    type Frontmatter {
      title: String
      tags: [String!]
      cover: String
    }
    type MarkdownRemark implements Node {
      fields: Fields
      frontmatter: Frontmatter
    }
    type SiteSiteMetadata implements Node {
      userGithub: String
      userTwitter: String
      userInstagram: String
      userEmail: String
      disqusShortname: String
    }
  `
  createTypes(typeDefs)
}
exports.onPreBootstrap = ({
  getNodes,
  actions: {
    touchNode
  }
}) => {
  // ensure 
  fse.ensureFileSync(buildConfig.cacheDbPath);
}
exports.onPostBuild = async function ({ cache, store, graphql }, { query }) {
  console.log('onPostBuild');

  const cacheKey = buildConfig.buildCacheKey
  let obj = await cache.get(cacheKey)
  if (!obj) {
    obj = { created: Date.now() }
  }
  obj.lastChecked = Date.now()
  await cache.set(cacheKey, obj)
  /* Do something with data ... */
  // sync to cache file
  db.set(buildConfig.buildCacheKey, obj).write()

}

