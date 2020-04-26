import React from "react";
import Helmet from "react-helmet";
import Layout from "../components/Layout/Layout";
import Now from "../components/Now/Now";
import { graphql } from "gatsby";

export default function NowPage({
  data
}) {
  const config = data.site.siteMetadata
  return (
    <Layout>
      <div className="about-container">
        <Helmet title={`Now | ${config.siteTitle}`} />
        <Now />
      </div>
    </Layout>
  );
}

export const query = graphql`
  query NowQuery {
    site {
      siteMetadata {
        siteTitle
      }
    }
  }
`
