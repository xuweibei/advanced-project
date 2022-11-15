import React from 'react'
export interface IPieCardProps {
  title?: any
  loading?: boolean
  subTitle?: any
  data?: any
  total?: React.ReactNode | number | (() => React.ReactNode | number)
  flag?: any
  hasLegend?: boolean
  padding?: [number, number, number, number]
  percent?: number
  tooltip?: boolean
  valueFormat?: (value: string) => string | React.ReactNode
}

export default class PieCard extends React.Component<IPieCardProps, any> {}
