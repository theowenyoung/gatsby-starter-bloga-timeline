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
        userInstagram,
        userGithub
      }
    }
  } = data;
  return (<Frame title="SUBSCRIBE">
    <Container styles="margin-bottom:0.6rem;">
      <RSS></RSS>
    </Container>
    {userInstagram && (<Container styles="margin-bottom:0.6rem;">
      <Instagram username={userInstagram}></Instagram>
    </Container>)}

    {userTwitter && (<Container styles="margin-bottom:0.6rem;">
      <Follow
        username={userTwitter}
        options={{ size: "large", count: "none" }}
      />
    </Container>)}

    {userGithub && (<Container styles="margin-bottom:0.6rem;">
      <GitHubButton data-size="large" href={`https://github.com/${userGithub}`}>Follow @{userGithub}</GitHubButton>
    </Container>)}

  </Frame>)
}

const query = graphql`
  query SubscribedQuery {
    site {
      siteMetadata {
        userTwitter
        userInstagram
        userGithub
      }
    }
  }
`;