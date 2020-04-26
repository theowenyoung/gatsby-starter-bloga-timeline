import React from 'react'
import styled from "@emotion/styled"
import Frame from '../Frame/SideFrame'
import { useStaticQuery, graphql, Link } from "gatsby";

export default function () {
  const data = useStaticQuery(query)
  const {
    site: {
      siteMetadata: {
        userDescription
      }
    }
  } = data;
  return (<Frame title="NOW">
    <div>{userDescription}</div>
  </Frame>)
}

const query = graphql`
  query AboutQuery {
    site {
      siteMetadata {
        userDescription
      }
    }
  }
`;