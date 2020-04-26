import React from 'react'
import styled from "@emotion/styled"
import { css } from "@emotion/core"
const Container = styled.article`
   margin-bottom: 4.5rem;
   width: 100%;


`
const ContainerWrapper = styled.div`
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
`

export default function Frame({ children }) {
  return (<Container>
    <ContainerWrapper>
      {children}
    </ContainerWrapper>
  </Container>)
}