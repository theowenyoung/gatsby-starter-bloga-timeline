import React from "react";
import Helmet from "react-helmet";
import urljoin from "url-join";
import moment from "moment";
import { useStaticQuery, graphql } from "gatsby";

export default function SEO({ postNode, postPath, postSEO }) {
  const queryResult = useStaticQuery(query)
  const config = queryResult.site.siteMetadata;
  let title;
  let description;
  let image;
  let postURL;

  if (postSEO) {
    const postMeta = postNode.frontmatter;
    ({ title } = postMeta);
    description = postMeta.description
      ? postMeta.description
      : postNode.excerpt;
    image = postMeta.cover || config.siteLogo;
    postURL = urljoin(config.siteUrl, config.pathPrefix, postPath);
  } else {
    title = config.siteTitle;
    description = config.siteDescription;
    image = config.siteLogo;
  }

  const getImagePath = imageURI => {
    if (
      !imageURI.match(
        `(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]`
      )
    )
      return urljoin(config.siteUrl, config.pathPrefix, imageURI);

    return imageURI;
  };

  const getPublicationDate = () => {
    if (!postNode) return null;

    if (!postNode.fields) return null;

    if (!postNode.fields.date) return null;
    return moment(postNode.fields.date).toDate();
  };

  image = getImagePath(image);

  const datePublished = getPublicationDate();

  const authorJSONLD = {
    "@type": "Person",
    name: config.userName,
    email: config.userEmail,
    address: config.userLocation
  };

  const logoJSONLD = {
    "@type": "ImageObject",
    url: getImagePath(config.siteLogo)
  };

  const blogURL = urljoin(config.siteUrl, config.pathPrefix);
  const schemaOrgJSONLD = [
    {
      "@context": "http://schema.org",
      "@type": "WebSite",
      url: blogURL,
      name: title,
      alternateName: config.siteDescription ? config.siteDescription : ""
    }
  ];
  if (postSEO) {
    schemaOrgJSONLD.push(
      {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            item: {
              "@id": postURL,
              name: title,
              image
            }
          }
        ]
      },
      {
        "@context": "http://schema.org",
        "@type": "BlogPosting",
        url: blogURL,
        name: title,
        alternateName: config.siteDescription ? config.siteDescription : "",
        headline: title,
        image: { "@type": "ImageObject", url: image },
        author: authorJSONLD,
        publisher: {
          ...authorJSONLD,
          "@type": "Organization",
          logo: logoJSONLD
        },
        datePublished,
        description
      }
    );
  }
  return (
    <Helmet>
      {/* General tags */}
      <meta name="description" content={description} />
      <meta name="image" content={image} />

      {/* Schema.org tags */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>

      {/* OpenGraph tags */}
      <meta property="og:url" content={postSEO ? postURL : blogURL} />
      {postSEO ? <meta property="og:type" content="article" /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta
        property="fb:app_id"
        content={config.siteFBAppID ? config.siteFBAppID : ""}
      />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:creator"
        content={config.userTwitter ? config.userTwitter : ""}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}



const query = graphql`
  query SeoQuery {
    site {
      siteMetadata {
        siteLogo
        siteUrl
        siteDescription
        siteTitle
        pathPrefix
        disqusShortname
        userName
        userEmail
        userLocation
      }
    }
  }
`;