const config = {
  siteTitle: "Owen Young's Blog", // Site title.
  siteTitleShort: "Owen", // Short site title for homescreen (PWA). Preferably should be under 12 characters to prevent truncation.
  siteTitleAlt: "All Owen Young's blog, tweets and more in one place.", // Alternative site title for SEO.
  siteLogo: "/logos/logo-1024.png", // Logo used for SEO and manifest.
  siteUrl: "https://blog.owenyoung.com", // Domain of your website without pathPrefix.
  pathPrefix: "/", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription: "All Owen Young's blog, tweets and more in one place.", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteRssTitle: "Owen Young's Blog", // Title of the RSS feed
  siteFBAppID: "1867376560066167", // FB Application ID for using app insights
  googleAnalyticsID: "UA-164063423-1", // GA tracking ID.
  disqusShortname: "owen-youngs-blog", // Disqus shortname.
  dateFromFormat: "YYYY-MM-DD", // Date format used in the frontmatter.
  dateFormat: "DD/MM/YYYY", // Date format for display.
  postsPerPage: 4, // Amount of posts displayed per listing page.
  userName: "Owen Young", // Username to display in the author segment.
  userEmail: "theowenyoung@gmail.com", // Email used for RSS feed's author segment
  userTwitter: "TheOwenYoung", // Optionally renders "Follow Me" in the UserInfo segment.
  userInstagram: "iamowenyoung", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "North Pole, Earth", // User location to display in the author segment.
  userAvatar: "https://api.adorable.io/avatars/150/test.png", // User avatar to display in the author segment.
  userDescription:
    "自由职业者/完美主义/自动化工作流爱好者/相信普世价值", // User description to display in the author segment.
  copyright: `Copyright © ${new Date().getFullYear()}. Owen Young`, // Copyright string for the footer of the website and RSS feed.
  themeColor: "#c62828", // Used for setting manifest and progress theme colors.
  backgroundColor: "#e0e0e0" // Used for setting manifest background color.
};

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
