import React, { useRef, useEffect, useLayoutEffect } from 'react'
import echarts from 'echarts'

interface Props {
  data?: any
  color?: any
  className?: string
}

export default function Chart({ data, color, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        const chart = echarts.init(ref.current)
        chart.setOption({
          tooltip: {
            trigger: 'item',
          },
          color: ['#5B8FF9', '#F6BD16'],
          series: [
            {
              // name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        })
      }
    })
  }, [data, color])

  return <div ref={ref} className={className} />
}
