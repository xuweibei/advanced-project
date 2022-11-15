import React from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import next from '../../../assets/images/nextArrow.png'
import prev from '../../../assets/images/lastArrow.png'

export const SimpleNextArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <img
      src={next}
      className={className}
      style={{ ...style, width: '0.625vw', height: '2.0313vw' }}
      onClick={onClick}
    />
  )
}
export const SimplePrevArrow = (props: any) => {
  const { className, style, onClick } = props
  return (
    <img
      src={prev}
      className={className}
      style={{ ...style, width: '0.625vw', height: '2.0313vw' }}
      onClick={onClick}
    />
  )
}
