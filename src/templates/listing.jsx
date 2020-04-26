import React from "react";
import { graphql } from "gatsby";
import PostListing from '../components/PostListing/PostListing/PostListing'
import Layout from "../components/Layout/Layout";

class Listing extends React.Component {
  render() {
    return (
      <Layout>
        <PostListing timelineKey="allTimeline" {...this.props}></PostListing>
      </Layout>
    );
  }
}

export default Listing;

/* eslint no-undef: "off" */
export const listingQuery = graphql`
  query ListingQuery($skip: Int!, $limit: Int!, $allMarkdownRemarkIds: [String!], $alltwitterStatusesUserTimelineTweetsIds: [String!], $allInstaNodeIds: [String!]) {
    allTimeline(
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
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
    allMarkdownRemark(filter: {id: {in: $allMarkdownRemarkIds}}) {
      edges {
        node {
          id
          excerpt( format: HTML, pruneLength: 500)
          frontmatter {
            title
            tags
          }
        }
      }
    }
    allTwitterStatusesUserTimelineTweets(filter: {id: {in: $alltwitterStatusesUserTimelineTweetsIds}}) {
      edges {
        node {
          id
          fields {
            html
          }
        }
      }
    }
    allInstaNode(filter: {id: {in: $allInstaNodeIds}}) {
      edges {
        node {
          id
          fields {
            html
          }
        }
      }
    }
  }
`;


