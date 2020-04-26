import React from "react";
import styled from "@emotion/styled"
import './content.css'
const ContentContainer = styled.section`
padding-bottom: 2rem;
font-weight: 400;
font-size: 21px;
line-height: 1.58;
h1,
h2,
p,
i,
a {
  text-rendering: optimizeLegibility;
}
a.anchor.before {
  display: inline !important;
}

h1 {
  font-size: 2.2rem;
  margin-top: 1.95em;
  margin-bottom: 1em;
  font-weight: 600;
  letter-spacing: -0.022em;
  line-height: 1.2;
}

h2 {
  font-size: 1.8rem;
  font-weight: 700;
  padding: 0;
  margin-top: 1.95em;
  margin-bottom: 1em;  
  line-height: 1.2;
  letter-spacing: -0.022em;
}

p, i, a {
  margin-top: 21px;
  letter-spacing: -0.03px;
  line-height: 1.58;
}

a {
  text-decoration: underline;
}

blockquote {
  margin-left: -20px;
  padding-left: 23px;
  box-shadow: inset 3px 0 0 0 rgba(0, 0, 0, 0.84);

}
ol, ul {
  padding: 0;
  list-style: none;
  list-style-image: none;
}

li {
  margin-top: 2em;
  margin-left: 30px;
  margin-bottom: -0.46em;
}

ul > li {
  list-style-type: disc
}

ol > li {
  list-style-type: decimal;
}
`

export default ContentContainer;