import React, { useState } from "react";
import ReactDisqusComments from "react-disqus-comments";
import urljoin from "url-join";
import { useStaticQuery, graphql } from "gatsby";
export default function Disqus({
  postNode
}) {
  const data = useStaticQuery(query)
  const config = data.site.siteMetadata;
  const [toasts, setToasts] = useState([])
  if (!config.disqusShortname) {
    return null;
  }
  const post = postNode.frontmatter;
  const { slug } = postNode.fields
  const url = urljoin(
    config.siteUrl,
    config.pathPrefix,
    postNode.fields.slug
  );
  const notifyAboutComment = () => {
    const newToasts = toasts.slice();
    newToasts.push({ text: "New comment available!" });
    setToasts(newToasts);
  }
  return (
    <ReactDisqusComments
      shortname={config.disqusShortname}
      identifier={slug}
      title={post.title}
      url={url}
      onNewComment={notifyAboutComment}
    />
  );
}

const query = graphql`
  query DisqusQuery {
    site {
      siteMetadata {
        siteUrl
        pathPrefix
        disqusShortname
      }
    }
  }
`;