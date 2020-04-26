import React from "react";
import styled from "@emotion/styled"
import { Link } from 'gatsby'
import PostTag from './PostTag'
import kebabcase from 'lodash.kebabcase'
const Tags = styled.ul`
display: flex;
padding:1rem 0;
flex-wrap: wrap;
line-height: 1.5;
list-style: none;
list-style-image: none;
`

export default function ({
  tags
}) {
  if (!Array.isArray(tags)) {
    return null;
  }
  return (<Tags>{tags.map(tag => {
    return <PostTag to={`/tags/${kebabcase(tag)}`} key={tag}>{tag}</PostTag>
  })}</Tags>)
}