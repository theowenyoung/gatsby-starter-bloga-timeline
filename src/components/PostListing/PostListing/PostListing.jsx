import React from "react";
import Helmet from "react-helmet";
import { Link } from "gatsby";
import styled from "@emotion/styled"
import Post from "../../PostListing/Post/Post";
import Tweet from "../../PostListing/Tweet/Tweet";
import Instagram from '../../PostListing/Instagram/Instagram'
import Instagram2 from '../../PostListing/Instagram/Instagram2'
import Youtube from '../../PostListing/Youtube/Youtube'
import Twitter3 from '../../PostListing/Tweet/Tweet3'
import SEO from "../../SEO/SEO";
import config from "../../../../data/SiteConfig";
import About from '../../Side/About'
import Tags from '../../Side/Tags'
import Title from '../../Title/Title'
import Subscription from '../../Side/Subscription'
import Flex from '../../Layout/Flex'
import Container from '../../Layout/Container'
import Pagination from '../../Pagination/Pagination'

class Listing extends React.Component {

  render() {
    const postEdges = this.props.data[this.props.timelineKey || 'allTimeline'].edges;
    const markdownRemarkEntities = this.getEntities('allMarkdownRemark')
    const tweetEntities = this.getEntities('allTwitterStatusesUserTimelineTweets')
    const instagramEntities = this.getEntities('allInstaNode')

    const { title } = this.props;
    return (
      <Flex styles="justify-content:space-between;">
        <Helmet title={config.siteTitle} />
        <SEO />
        <MainContainer>
          <MainContainerWrapper>
            <Title>{title || "LATEST"}</Title>
            <ListContainer>
              {/* <Twitter3></Twitter3> */}
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
              {/* <Instagram2 /> */}
              {/* <Youtube /> */}
              {/* <Instagram></Instagram> */}
            </ListContainer>
            <Container styles="align-items:center;padding:4rem 0;">
              <Pagination {...this.props.pageContext}></Pagination>
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
  getEntities(key) {
    const entities = {};
    this.props.data[key].edges.forEach(({ node }) => {
      entities[node.id] = node
    })
    return entities
  }
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



export default Listing;

