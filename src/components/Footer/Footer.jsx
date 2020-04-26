import React, { Component } from "react";
import { Link } from "gatsby";
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
class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <Flex styles="justify-content:center">
          <div>
            &copy; Copyright {new Date().getFullYear()} <Link to="/">Owen Young</Link> ,
            Built with <a href="https://www.gatsbyjs.org/">
              Gatsby
            </a>,
            Based on{" "}
            <a href="https://github.com/Vagr9K/gatsby-advanced-starter">
              Gatsby Advanced Starter
            </a>
            .
          </div>
        </Flex>

      </FooterContainer>
    );
  }
}

export default Footer;
