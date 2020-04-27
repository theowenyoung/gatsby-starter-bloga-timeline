import React from "react";
import { graphql } from "gatsby";
import PostListing from '../components/PostListing/PostListing/PostListing'
import Layout from "../components/Layout/Layout";

export default function Listing(props) {
  return (
    <Layout>
      <PostListing timelineKey="allTimeline" {...props}></PostListing>
    </Layout>
  );

}

/* eslint no-undef: "off" */
export const listingQuery = graphql`
query ListingQuery($skip: Int!, $limit: Int!, $isIncludeMarkdownRemark: Boolean!, $isIncludeTwitterStatusesUserTimelineTweets: Boolean!, $isIncludeInstaNode: Boolean!, $allMarkdownRemarkIds: [String!], $allTwitterStatusesUserTimelineTweetsIds: [String!], $allInstaNodeIds: [String!]) {
  allTimeline(sort: {fields: date, order: DESC}, limit: $limit, skip: $skip) {
    edges {
      node {
        id
        ...IndexTimelineFragment
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


