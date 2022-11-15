import React, { useRef, useEffect } from 'react'
import echarts from 'echarts'

interface Props {
  startColor: string
  endColor: string
  dataArr: number
  className?: string
}

export default function Chart({ startColor, endColor,dataArr, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        const chart = echarts.init(ref.current)
        chart.setOption({
          series: [
            {
              name: '内部进度条',
              type: 'gauge',
              radius: '80%',
              splitNumber: 10,
              startAngle: 180,
              endAngle: 0,
              axisLine: {
                show: true,
                lineStyle: {
                  width: 5,
                  color: [
                    [
                      dataArr / 100,
                      new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        {
                          offset: 0,
                          color: startColor,
                        },
                        {
                          offset: 1,
                          color: endColor,
                        },
                      ]),
                    ],
                    [1, '#262B5A'], //底层环形颜色
                  ],
                },
              },
              // axisLine: {
              //   lineStyle: {
              //     color: [
              //       [dataArr / 100, colorSet.color],
              //       [1, '#262B5A'], //底层环形颜色
              //     ],
              //     width: 5, //环宽度
              //   },
              // },
              axisLabel: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
              },
              pointer: {
                show: false,
              },
              detail: {
                show: false,
              },
            },
          ],
        })
      }
    }, 0)
  }, [dataArr])

  return <div ref={ref} className={className} />
}
