import React from "react";
import Helmet from "react-helmet";
import styled from "@emotion/styled"
import Post from "../../PostListing/Post/Post";
import Tweet from "../../PostListing/Tweet/Tweet";
import Instagram from '../../PostListing/Instagram/Instagram'
import SEO from "../../SEO/SEO";
import About from '../../Side/About'
import Tags from '../../Side/Tags'
import Title from '../../Title/Title'
import Subscription from '../../Side/Subscription'
import Flex from '../../Layout/Flex'
import Container from '../../Layout/Container'
import Pagination from '../../Pagination/Pagination'
import { useStaticQuery, graphql } from "gatsby";

export default function Postlisting(props) {
  const queryResult = useStaticQuery(query);
  const config = queryResult.site.siteMetadata;
  const postEdges = props.data[props.timelineKey || 'allTimeline'].edges;
  const getEntities = (key) => {
    const entities = {};
    if (props.data[key] && props.data[key].edges) {
      props.data[key].edges.forEach(({ node }) => {
        entities[node.id] = node
      })
    }

    return entities
  }
  const markdownRemarkEntities = getEntities('allMarkdownRemark')
  const tweetEntities = getEntities('allTwitterStatusesUserTimelineTweets')
  const instagramEntities = getEntities('allInstaNode')

  const { title } = props;
  return (
    <Flex styles="justify-content:space-between;">
      <Helmet title={config.siteTitle} />
      <SEO />
      <MainContainer>
        <MainContainerWrapper>
          <Title>{title || "LATEST"}</Title>
          <ListContainer>
            {
              postEdges.map(({ node }) => {

                const {
                  slug,
                  parent: {
                    internal: {
                      type,
                    },
                    id
                  }
                } = node;
                if (type === 'MarkdownRemark') {
                  if (markdownRemarkEntities[id]) {
                    const item = markdownRemarkEntities[id];
                    const params = {
                      ...node,
                      title: item.frontmatter.title,
                      excerpt: item.excerpt,
                      tags: item.frontmatter.tags,
                      dateFormat: config.dateFormat
                    }
                    return (<Post {...params} key={slug} ></Post>)
                  }
                } else if (type === 'twitterStatusesUserTimelineTweets') {
                  // return null
                  if (tweetEntities[id]) {
                    const item = tweetEntities[id];
                    const params = {
                      ...node,
                      html: item.fields.html
                    }
                    return (<Tweet {...params} key={slug}></Tweet>)

                  }
                } else if (type === 'InstaNode') {
                  // return null
                  if (instagramEntities[id]) {
                    const item = instagramEntities[id];
                    const params = {
                      ...node,
                      html: item.fields.html
                    }
                    return (<Instagram {...params} key={slug}></Instagram>)
                  }
                }
              })
            }
          </ListContainer>
          <Container styles="align-items:center;padding:4rem 0;">
            <Pagination {...props.pageContext}></Pagination>
          </Container>
        </MainContainerWrapper>
      </MainContainer>
      <SideContainer>
        <SideContainerWrapper>
          <About></About>
          <Tags></Tags>
          <Subscription></Subscription>
        </SideContainerWrapper>
      </SideContainer>

    </Flex>
  );
}


const MainContainer = styled.main`
 flex:2;
 flex-shrink:0;
 display:flex;
 flex-direction:column;
 align-items:center;
 @media screen and (min-width: 54.5rem){
  align-items:flex-start;
}
`
const MainContainerWrapper = styled.div`
min-width: 20rem;
width: calc( 100vw - 32px );
@media screen and (min-width: 34.5rem) {
  width: 32.5rem;
}
`
const SideContainer = styled.aside`
  flex:1;
  display:flex;
  flex-direction: column;
  align-items: center;
  @media screen and (min-width: 54.5rem){
    align-items:flex-end;
  }
`
const SideContainerWrapper = styled.div`
  display:flex;
  flex-direction: column;
  min-width: 20rem;
  max-width: 32.5rem;
  width: 100%;
  @media screen and (min-width: 54.5rem){
    padding-left: 5rem;
    max-width: 25rem;

  }
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const query = graphql`
  query PostListingQuery {
    site {
      siteMetadata {
        siteDescription
        dateFormat
      }
    }
  }
  fragment IndexPostFragment on MarkdownRemark {
    excerpt( format: HTML, pruneLength: 500)
    frontmatter {
      title
      tags
    }
  }
  fragment IndexInstagramFragment on InstaNode {
    fields {
      html
    }
  }
  fragment IndexTwitterFragment on twitterStatusesUserTimelineTweets {
    fields {
      html
    }
  }
  fragment IndexTimelineFragment on Timeline {
    slug
    date
    parent {
      internal {
        type
      }
      id
    }
  }
  fragment IndexTagTimelineFragment on TagTimeline {
    slug
    date
    parent {
      internal {
        type
      }
      id
    }
  }
`;