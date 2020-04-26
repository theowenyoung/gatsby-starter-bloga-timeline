import React from 'react'
import styled from "@emotion/styled"
import Frame from '../Frame/SideFrame'
import { useStaticQuery, graphql, Link } from "gatsby";
import Tag from '../Tag/Tag'
import PostTag from '../Tag/PostTag'
import Flex from '../Layout/Flex'
export default function () {
  const data = useStaticQuery(query)
  const {
    allTag: {
      edges
    }
  } = data;
  return (<Frame title="TAGS">
    <Flex>
      {edges.map(edge => {
        return (<PostTag key={edge.node.tag} to={edge.node.slug}>{edge.node.tag}({edge.node.postCount})</PostTag>)
      })}
    </Flex>

  </Frame>)
}

const query = graphql`
  query TagsQuery {
    allTag(sort: {fields: date, order: DESC}) {
      edges {
        node {
          id
          date
          tag
          slug
          postCount
        }
      }
    }
  }
`;