import React from "react";
import Helmet from "react-helmet";
import Layout from "../components/Layout/Layout";
import SEO from "../components/SEO/SEO";
import { graphql, useStaticQuery } from "gatsby";

export default function Landing() {
  const data = useStaticQuery(query)
  const config = data.site.siteMetadata;
  return (
    <Layout>
      <div className="landing-container">
        <div className="posts-container">
          <Helmet title={config.siteTitle} />
          <SEO />
          <h2>Coming soon.</h2>
        </div>
      </div>
    </Layout>
  );

}

const query = graphql`
  query LandingQuery {
    site {
      siteMetadata {
        siteTitle
      }
    }
  }
`
