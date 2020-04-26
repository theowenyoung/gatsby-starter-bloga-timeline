import React from 'react'
import Frame from '../../Frame/PureFrame'

export default function ({ html }) {
  return (<Frame><div dangerouslySetInnerHTML={{
    __html: html
  }}></div ></Frame>)
}