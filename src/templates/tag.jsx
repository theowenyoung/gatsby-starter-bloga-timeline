import React from "react";
import { graphql } from "gatsby";
import PostListing from '../components/PostListing/PostListing/PostListing'
import Layout from "../components/Layout/Layout";

class Listing extends React.Component {
  render() {
    const {
      tag
    } = this.props.pageContext
    return (
      <Layout>
        <PostListing title={`#${tag}`} timelineKey="allTagTimeline" {...this.props}></PostListing>
      </Layout>
    );
  }
}

export default Listing;

/* eslint no-undef: "off" */
export const TagListingQuery = graphql`
query TagListingQuery($tag: String!, $skip: Int!, $limit: Int!, $isIncludeMarkdownRemark: Boolean!, $isIncludeTwitterStatusesUserTimelineTweets: Boolean!, $isIncludeInstaNode: Boolean!, $allMarkdownRemarkIds: [String!], $allTwitterStatusesUserTimelineTweetsIds: [String!], $allInstaNodeIds: [String!]) {
  allTagTimeline(sort: {fields: date, order: DESC}, limit: $limit, skip: $skip, filter: {tag: {eq: $tag}}) {
    edges {
      node {
        id
        ...IndexTagTimelineFragment
      }
    }
  }
  allMarkdownRemark(filter: {id: {in: $allMarkdownRemarkIds}}) @include(if: $isIncludeMarkdownRemark) {
    edges {
      node {
        id
        ...IndexPostFragment
      }
    }
  }
  allTwitterStatusesUserTimelineTweets(filter: {id: {in: $allTwitterStatusesUserTimelineTweetsIds}}) @include(if: $isIncludeTwitterStatusesUserTimelineTweets) {
    edges {
      node {
        id
        ...IndexTwitterFragment
      }
    }
  }
  allInstaNode(filter: {id: {in: $allInstaNodeIds}}) @include(if: $isIncludeInstaNode) {
    edges {
      node {
        id
        ...IndexInstagramFragment
      }
    }
  }
}

`;


