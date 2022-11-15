import React, { useRef, useEffect, useLayoutEffect } from 'react'
import echarts from 'echarts'

interface Props {
  data?: any
  color?: any
  className?: string
  dataName: string
  dataValues: string
}

export default function Chart({ data, color, className, dataName, dataValues }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        let dateName = [] // 名称
        let dataValue = [] //数值
        if (data) {
          //   //for循环chartsJSON
          //   if (dataType === 'robotMonth') {
          //     let robotdata = JSON.parse(data)
          //     for (var i = 0; i < robotdata.length; i++) {
          //       dateName.push(robotdata[i].date)
          //       dataValue.push(robotdata[i].Num)
          //     }
          //   } else {
          for (var i = 0; i < data.length; i++) {
            dateName.push(data[i][dataName])
            dataValue.push(data[i][dataValues])
          }
        }
        // }
        const chart = echarts.init(ref.current)
        chart.setOption({
          grid: {
            left: '2%',
            right: '2%',
            bottom: '5%',
            top: '5%',
            containLabel: true,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#ddd',
              },
            },
            backgroundColor: 'rgba(255,255,255,1)',
            padding: [5, 10],
            textStyle: {
              color: '#7588E4',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)',
          },
          xAxis: {
            type: 'category',
            data: dateName,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: '#99A4B7',
              fontSize: 12,
            },
          },
          yAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#D8D8D8',
                opacity: 0.15,
              },
            },

            axisLine: {
              show: false,
            },
            axisLabel: {
              color: '#99A4B7',
              fontSize: 12,
            },
          },
          series: [
            {
              data: dataValue,
              type: 'bar',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: color && color.area0,
                    },
                    {
                      offset: 1,
                      color: color && color.area1,
                    },
                  ]),
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
