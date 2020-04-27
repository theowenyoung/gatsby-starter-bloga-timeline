import React, { Component } from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import styled from '@emotion/styled'
import Flex from '../Layout/Flex'
const FooterContainer = styled.footer`
 width: 100%;
 padding: 3rem 0;
 color: rgba(0,0,0,0.54);
 font-size: 18px;
 a {
  color: rgba(0,0,0,0.54);
  text-decoration: underline;
 }
`
export default function Footer() {
  const data = useStaticQuery(query);
  const config = data.site.siteMetadata;
  return (
    <FooterContainer>
      <Flex styles="justify-content:center">
        <div>
          {config.copyright} ,
            Built with <a href="https://www.gatsbyjs.org/">
            Gatsby
            </a>
            .
          </div>
      </Flex>

    </FooterContainer>
  );

}

const query = graphql`
  query FooterQuery {
    site {
      siteMetadata {
        copyright
      }
    }
  }
`;