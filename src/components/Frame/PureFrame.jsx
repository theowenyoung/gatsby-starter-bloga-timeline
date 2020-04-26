import React from 'react'
import styled from "@emotion/styled"
const Container = styled.article`
    margin-bottom: 4.5rem;
    width: 100%;
`
const ContainerWrapper = styled.div`
}
`

export default function Frame({ children }) {
  return (<Container>
    <ContainerWrapper>
      {children}
    </ContainerWrapper>
  </Container>)
}