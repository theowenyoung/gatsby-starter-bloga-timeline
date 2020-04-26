import React from 'react';
import styled from "@emotion/styled"
import { Link } from "gatsby";

const Tag = styled.div`
a {
  margin-right: 0.625rem;
  color: #a7a7a7;
  text-decoration: none;
  line-height: 1.8;
  font-size: 18px;
  font-style: italic;
}
a:before {
  content: '#';
}
a:hover {
  color: #8c8c8c;
}
`
export default function ({
  to,
  children
}) {
  return (<Tag>
    <Link to={to}>{children}</Link>
  </Tag>)
}