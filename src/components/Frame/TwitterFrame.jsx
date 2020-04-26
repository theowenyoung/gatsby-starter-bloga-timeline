import React from 'react'
import styled from "@emotion/styled"


const Container = styled.article`
  margin-bottom: 3.875rem;
  width: 100%;
`
const ContainerWrapper = styled.div`
  margin-top: -10px;
  position: relative;
`

export default function Frame({ children }) {
  return (<Container>
    <ContainerWrapper>
      {children}
    </ContainerWrapper>
  </Container>)
}