import React, { useRef, useEffect, useLayoutEffect } from 'react'
import echarts from 'echarts'

interface Props {
  data?: any[]
  color?: any
  className?: string
  dataName: string
  dataValues: string
}

export default function Chart({ data, color = {}, className, dataName, dataValues }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current) {
      let dateName = [] // 名称
      let dataValue = [] //数值
      if (data) {
        //for循环chartsJSON
        for (var i = 0; i < data.length; i++) {
          dateName.push(data[i][dataName])
          dataValue.push(data[i][dataValues])
        }
      }

      const chart = echarts.init(ref.current)

      chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: 'category',
          data: dateName,
          axisTick: {
            interval: 0,
            alignWithLabel: true,
          },
          splitLine: {
            interval: 0,
          },
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: dataValue,
            type: 'bar',
          },
        ],
      })
    }
  }, [data, color])

  return <div ref={ref} className={className} />
}
