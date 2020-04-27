/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import Image from "gatsby-image";
import styled from "@emotion/styled"
import { css } from '@emotion/core'
import BioContent from "./Bio-Bontent";
const AuthurContainer = styled.div`
display: flex;
margin-bottom: 4rem;
a {
  text-decoration: none;
}
`
const Description = styled.div`
  color: rgba(0, 0, 0, 0.54);
`
const Bio = ({ descption }) => {
  const data = useStaticQuery(bioQuery);
  const {
    site: {
      siteMetadata: { userName }
    },
    avatar
  } = data;

  return (
    <AuthurContainer>
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

      <div>
        <Link to="/"><BioContent author={userName} /></Link>
        <Description>
          {descption}
        </Description>
      </div>
    </AuthurContainer>
  );
};

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        userName
      }
    }
    avatar: file(absolutePath: { regex: "/logo.*(jpeg|jpg|gif|png)/" }) {
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

export default Bio;
