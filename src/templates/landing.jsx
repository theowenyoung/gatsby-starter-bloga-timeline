import React from "react";
import Helmet from "react-helmet";
import Layout from "../components/Layout/Layout";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";

class Landing extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;
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
}

export default Landing;


