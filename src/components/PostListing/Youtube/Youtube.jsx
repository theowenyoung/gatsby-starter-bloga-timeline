import React from 'react'
import Frame from '../../Frame/YoutubeFrame'

export default function () {
  return (<Frame><div dangerouslySetInnerHTML={{
    __html: `<iframe width="1058" height="595" src="https://www.youtube.com/embed/9z_Jmg2x2XM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  }}></div ></Frame>)
}