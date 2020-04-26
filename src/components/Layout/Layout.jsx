import React from "react";
import Helmet from "react-helmet";
import "typeface-playfair-display";
import "typeface-lato";
import "normalize.css";
import './global.css'
import './dark.css'
import styled from "@emotion/styled"
import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import { useStaticQuery, graphql } from "gatsby";

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  align-items: center;
`;


const RootContainerWrapper = styled.div`
color: rgba(0, 0, 0, 0.84);
a {
  color: rgba(0, 0, 0, 0.84);
}
font-size: 21px;
padding: 3rem 1rem 0 1rem;
max-width: 67.5rem;
width: 100%;
min-width: 16rem;
display: flex;
flex-direction: column;
@media(max-width: 67.5rem) {
  max-width: 100vw;
}
`;

export default function MainLayout({ children, isShowHeader }) {
  const queryResult = useStaticQuery(query)
  const config = queryResult.site.siteMetadata;
  return (
    <RootContainer id="root-container">
      <Helmet>
        <meta name="description" content={config.siteDescription} />
        <html lang="en" />
      </Helmet>
      <RootContainerWrapper>
        {isShowHeader === false ? null : (<Header ></Header>)}
        {children}
        <Footer />
      </RootContainerWrapper>
    </RootContainer>

  );
}



const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        siteDescription
      }
    }
  }
`;