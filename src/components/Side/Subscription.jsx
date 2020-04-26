import React from 'react'
import styled from "@emotion/styled"
import Frame from '../Frame/SideFrame'
import { useStaticQuery, graphql, Link } from "gatsby";
import { Follow } from "react-twitter-widgets";
import GitHubButton from 'react-github-btn'
import Container from '../Layout/Container'
import RSS from '../Buttons/Rss'
import Instagram from '../Buttons/Instagram'

export default function () {
  const data = useStaticQuery(query)
  const {
    site: {
      siteMetadata: {
        userTwitter,
        userInstagram
      }
    }
  } = data;
  return (<Frame title="SUBSCRIBE">
    <Container styles="margin-bottom:0.6rem;">
      <RSS></RSS>
    </Container>
    <Container styles="margin-bottom:0.6rem;">
      <Instagram username={userInstagram}></Instagram>
    </Container>
    <Container styles="margin-bottom:0.6rem;">
      <Follow
        username={userTwitter}
        options={{ size: "large", count: "none" }}
      />
    </Container>
    <Container styles="margin-bottom:0.6rem;">
      <GitHubButton data-size="large" href="https://github.com/theowenyoung">Follow @theowenyoung</GitHubButton>
    </Container>
  </Frame>)
}

const query = graphql`
  query SubscribedQuery {
    site {
      siteMetadata {
        userTwitter
        userInstagram
      }
    }
  }
`;