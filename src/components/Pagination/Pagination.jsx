import React from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'gatsby'
import styled from '@emotion/styled'

const Container = styled.section`
  a {
    text-decoration: none;
  }
`

export default function PaginationSize({ currentPageNum, pageCount, pagePrefix }) {
  const isFirstPage = currentPageNum === 1;
  const isLastPage = currentPageNum === pageCount;
  return (
    <Container>
      <Pagination page={currentPageNum} hidePrevButton={isFirstPage} hideNextButton={isLastPage} count={pageCount} size="large" renderItem={(item) => {
        if (typeof item.page === 'number' && currentPageNum !== item.page) {
          return (<Link to={item.page === 1 ? `${pagePrefix}` : `${pagePrefix}pages/${item.page}/`}><PaginationItem {...item} /></Link>)
        } else {
          return <PaginationItem {...item} />
        }

      }} />
    </Container>
  );
}