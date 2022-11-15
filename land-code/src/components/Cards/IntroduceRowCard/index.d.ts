import React from 'react'
export interface IntroduceRowCardProps {
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

export default class IntroduceRowCard extends React.Component<IntroduceRowCardProps, any> {}
