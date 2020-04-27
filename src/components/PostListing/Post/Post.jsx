import React from "react";
import { Link } from "gatsby"
import styled from "@emotion/styled"
import Frame from '../../Frame/PostFrame'
import Tags from '../../Tag/Tags'
import Tag from '../../Tag/Tag'
import ContentContainer from '../../Layout/Content'
import kebabcase from 'lodash.kebabcase'
import moment from 'moment'

const TitleContainer = styled.header`
a {
  text-decoration: none;
}
h1 {
  font-size: 2rem;
}
`;
const ContentSection = styled.section`
  padding: 0 0.8rem;
  position: relative;
  word-wrap: break-word;
  overflow: hidden;
`
const Content = styled.div`
  padding: 1.25rem;
`
const ContentBody = styled.div`
  font-size:18px;
  a.anchor.before {
    display: none !important;
  }
  h1 {
    font-size: 1.375rem;
    font-weight: 600;
  }
  h2 {
    font-size: 1.3rem;
    font-weight: 600;

  }
`;
const Footer = styled.section`
display: flex;
padding-top: 0.5rem;
flex-wrap: wrap;
`
const PublishDate = styled.div`
a {
  margin-right: 10px;
  color: #a7a7a7;
  text-decoration: none;
  line-height: 1.2;
  font-size: 16px;

}
a:hover {
  color: #8c8c8c;
}
`

const Post = ({
  slug,
  title,
  excerpt,
  tags,
  date,
  dateFormat,
  ...rest

}) => {
  return (
    <Frame>
      <ContentSection>
        <Content>
          <TitleContainer>
            <Link to={slug} key={title}>
              <h1>{title}</h1>
            </Link>
          </TitleContainer>

          {/* <ContentBody>
          {excerpt}
        </ContentBody> */}
          <ContentContainer>
            <ContentBody dangerouslySetInnerHTML={{ __html: excerpt }}>
            </ContentBody>
          </ContentContainer>

          {tags ? (<Tags>
            {
              tags.map(tag => {
                return <Tag key={tag} to={`/tags/${kebabcase(tag)}`}>{tag}</Tag>
              })
            }
          </Tags>) : null}
          <Footer>
            <PublishDate>
              <Link to={slug}>{moment(date).format(dateFormat)}</Link>
            </PublishDate>
          </Footer>
        </Content>
      </ContentSection>
    </Frame>
  )
}

export default Post

