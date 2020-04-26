import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import Bio from "../Bio/Bio";
import styled from "@emotion/styled"
import { css } from '@emotion/core'
import Image from "gatsby-image";
import Flex from '../Layout/Flex'
const HeaderContainer = styled.header`
flex: 1 100%;

`
const Container = styled.section`
  display:flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  padding:0 0 6rem 0;

`
const SiteTitleContainer = styled.h1`
font-size: 3rem;
line-height: 1;
margin:0;
a {
  text-decoration: none;
}
`

const NavContainer = styled.nav`
display: flex;
margin-top: 1rem;
a {
  color: rgba(0,0,0,.54);
}
`
const Nav = styled.a`
margin-left: 0.8rem;
font-size: 1.25rem;
text-decoration: none;
:hover {
  color: rgba(0,0,0,.76);
}

`
const Title = ({ children }) => {
  return (
    <SiteTitleContainer>
      <Link
        to={`/`}
      >
        {children}
      </Link>
    </SiteTitleContainer>
  );

};

export default ({ children }) => {
  const data = useStaticQuery(query);
  const {
    avatar,
    site: {
      siteMetadata: {
        siteTitle,
        userName,
      }
    }
  } = data

  return (
    <HeaderContainer>
      <Container>
        <Flex>
          {avatar ? (
            (<Link to="/"><Image
              fixed={avatar.childImageSharp.fixed}
              alt={userName}
              css={css`
          margin-right: 1rem;
          margin-bottom: 0;
          width: 48px;
          border-radius: 50%;
          `}
            /></Link>)

          ) : null}
          <Title >{siteTitle}</Title>
        </Flex>

        <NavContainer>

        </NavContainer>
        {children}
      </Container>

    </HeaderContainer>
  );
};


const query = graphql`
  query Query {
    site {
      siteMetadata {
        userName
        siteTitle
        userDescription
      }
    }
    avatar: file(absolutePath: { regex: "/logo\\-1024.*(jpeg|jpg|gif|png)/" }) {
      childImageSharp {
        fixed(width: 48, height: 48) {
          base64
          width
          height
          src
          srcSet
        }
      }
    }
  }
`;