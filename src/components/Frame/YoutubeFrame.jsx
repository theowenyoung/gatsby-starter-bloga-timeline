import React from 'react'
import styled from "@emotion/styled"


const Container = styled.article`
  margin-bottom: 4.5rem;
  width: 100%;

`
const ContainerWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px; 
  height: 0; 
  overflow: hidden;
  iframe,object,embed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

export default function Frame({ children }) {
  return (<Container>
    <ContainerWrapper>
      {children}
    </ContainerWrapper>
  </Container>)
}