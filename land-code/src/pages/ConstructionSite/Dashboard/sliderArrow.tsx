import React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import next from '../../../assets/images/nextArrow.png'
import prev from '../../../assets/images/lastArrow.png'

export const SampleNextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <img
      src={next}
      className={className}
      style={{
        ...style,
        width: '0.625vw',
        height: '2.0313vw',
        right: '-0.6771vw',
        marginTop: '-15px',
      }}
      onClick={onClick}
    />
  )
}
export const SamplePrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <img
      src={prev}
      className={className}
      style={{
        ...style,
        width: '0.625vw',
        height: '2.0313vw',
        left: '-5.6771vw',
        marginTop: '-14px',
      }}
      onClick={onClick}
    />
  )
}
