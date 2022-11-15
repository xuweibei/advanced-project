import React, { useRef, useEffect } from 'react'
import echarts from 'echarts'

interface Props {
  data: any[]
  color: any
  type: string
  className?: string
}

export default function Chart({ data, color = {}, type, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        let dateName = [] // 名称
        let dataValue = [] //数值
        //for循环chartsJSON
        for (var i = 0; i < data.length; i++) {
          dateName.push(data[i].date)
          dataValue.push(data[i].activeUserCount)
        }

        const chart = echarts.init(ref.current)
        if (type === 'line') {
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
                fontFamily: 'din-bold',
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
                type: 'line',
                symbol: 'circle',
                symbolSize: 0,
                data: dataValue,
                hoverAnimation: false,
                lineStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: color.line0, // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: color.line1, // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: color.area0, // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: color.area1, // 100% 处的颜色
                      },
                    ],

                    global: false, // 缺省为 false
                  },
                  opacity: 0.3,
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10,
                },
              },
            ],
          })
        }
        if (type === 'bar') {
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
                fontFamily: 'din-bold',
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
                type: 'bar',
                barWidth: '30%',
                label: {
                  show: true,
                  position: 'top',
                  color: '#fff',
                  fontFamily: 'din-bold',
                },
                itemStyle: {
                  barBorderRadius: [5, 5, 0, 0],
                },
                data: [
                  {
                    value: dataValue[0],
                    itemStyle: {
                      color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                          {
                            offset: 0,
                            color: '#3D9CE5', // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: '#0094FF', // 100% 处的颜色
                          },
                        ],
                        global: false, // 缺省为 false
                      },
                    },
                  },
                  {
                    value: dataValue[1],
                    itemStyle: {
                      color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                          {
                            offset: 0,
                            color: '#4BAF9D', // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: '#ACEA53', // 100% 处的颜色
                          },
                        ],
                        global: false, // 缺省为 false
                      },
                    },
                  },
                ],
              },
            ],
          })
        }
      }
    })
  }, [data, color])

  return <div ref={ref} className={className} />
}
