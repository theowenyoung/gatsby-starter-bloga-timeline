import React from 'react'
import styled from "@emotion/styled"
import Title from '../Title/Title'

const Container = styled.section`
    margin-bottom: 4.5rem;    
    width: 100%;
`
const ContainerWrapper = styled.div`
  background: #fff;
  overflow: hidden;
  position: relative;
}
`
const ContentWrapper = styled.div`
color: rgba(0, 0, 0, 0.54);
font-size: 18px;
`

export default function Frame({ title, children }) {
  return (<Container>
    <ContainerWrapper>
      <Title>{title}</Title>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </ContainerWrapper>
  </Container>)
}