import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout/Layout";
import Disqus from "../components/Disqus/Disqus";
import PostTags from "../components/Tag/PostTags";
import SocialLinks from "../components/SocialLinks/SocialLinks";
import SEO from "../components/SEO/SEO";
import Bio from '../components/Bio/Bio'
import ContentContainer from '../components/Layout/Content'
import moment from "moment";

export default class PostTemplate extends React.Component {
  render() {
    const { data, pageContext } = this.props;
    const { slug } = pageContext;
    const config = data.site.siteMetadata;
    const postNode = data.markdownRemark;
    const { fields: {
      date
    } } = data.markdownRemark;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }

    return (
      <Layout isShowHeader={false}>
        <Helmet>
          <title>{`${post.title} | ${config.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <div>
          <h1>{post.title}</h1>
          <Bio descption={moment(date).format(config.dateFormat)} />
          <ContentContainer>
            <div dangerouslySetInnerHTML={{ __html: postNode.html }} />
          </ContentContainer>
          <div>
            <PostTags tags={post.tags} />
            <SocialLinks postPath={slug} postNode={postNode} />
          </div>
          <Disqus postNode={postNode} />
        </div>
      </Layout>
    );
  }
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        siteTitle
        dateFormat
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      tableOfContents
      frontmatter {
        title
        cover
        tags
      }
      fields {
        slug
        date
      }
    }
  }
`;
