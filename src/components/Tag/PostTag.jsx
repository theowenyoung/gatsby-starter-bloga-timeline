import React from "react";
import styled from "@emotion/styled"
import { Link } from 'gatsby'

const Tag = styled.li`
list-style: none;
margin-bottom: 0.8rem;
margin-right: 0.6rem;
a {
  font-size: 1.1rem;
  line-height:2;
  color: rgba(0, 0, 0, 0.54);
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  background: rgba(0, 0, 0, 0.05);
}
`

export default function ({
  children,
  to
}) {
  return (
    <Tag><Link to={to}>{children}</Link></Tag >
  )
}