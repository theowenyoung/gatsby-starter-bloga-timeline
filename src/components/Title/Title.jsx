import React from "react";
import styled from "@emotion/styled"
const TitleContainer = styled.section`
  width: 100%;
  padding-bottom: 20px;

`
const Title = styled.h2`
font-size: 21px;
font-weight: 600;
`
export default function ({ children }) {
  return (<TitleContainer>
    <Title>{children}</Title>
  </TitleContainer>)
}