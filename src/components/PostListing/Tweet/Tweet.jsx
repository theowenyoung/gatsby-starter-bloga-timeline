

import React from "react"
import PureFrame from '../../Frame/TwitterFrame'


const Tweet = ({
  html
}) => {


  return (
    <PureFrame><div dangerouslySetInnerHTML={{ __html: html }} /></PureFrame>
  )
}

export default Tweet
