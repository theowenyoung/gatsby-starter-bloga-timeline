import React from "react";
import styled from "@emotion/styled"

export default function ({ children, styles }) {
  styles = styles || ""
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    ${styles}
  `
  return (<Container>{children}</Container>)
}