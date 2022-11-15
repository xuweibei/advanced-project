import React, { useRef, useEffect } from 'react'
import echarts from 'echarts'

interface Props {
  type?: string
  data1: any
  data2: any
  className?: string
}

export default function Chart({ type, data1, data2, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        let propertyData: any[] = []
        let businessData: any[] = []
        let xAxisData: any[] = []
        data1.forEach((item: any) => {
          propertyData.push(item.value)
          xAxisData.push(item.date)
        })
        data2.forEach((item: any) => {
          businessData.push(item.value)
        })

        const chart = echarts.init(ref.current)
        if (type === 'line') {
          chart.setOption({
            tooltip: {
              trigger: 'axis',
              backgroundColor: '#999',
              formatter: '{b0}<br /> 计划日期：{c1}<br />实际日期：{c0}',
              // axisPointer: {
              //   type: 'cross',
              //   crossStyle: {
              //     color: '#999',
              //   },
              // },
            },
            grid: {
              top: '10%',
              bottom: '5%',
              left: '10%',
              right: '10%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: xAxisData,
              axisLabel: {
                // rotate: 30, //轴线刻度旋转角度
                color: '#FFF',
              },
              axisTick: {
                show: false, //标轴轴刻度
              },
              splitLine: {
                show: false, //坐标轴分隔线
              },
              axisPointer: {
                type: 'shadow', //指示器类型
              },
              axisLine: {
                show: true, //是否显示轴线
                lineStyle: {
                  color: '#fff',
                },
              },
            },

            yAxis: {
              // name:'月份',
              type: 'time',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: 8,
              },
              splitLine: {
                show: false,
                lineStyle: {
                  type: 'solid',
                  color: '#D8D8D8',
                },
              },
              axisTick: {
                show: false, //标轴轴刻度
              },
              minInterval: 1,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#fff',
                },
              },
              axisLabel: {
                //rotate: 30, //轴线刻度旋转角度
                color: '#FFF',
              },
            },
            series: [
              {
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                data: propertyData,
                hoverAnimation: true,
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
                        color: '#FFCE5A', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#FF831C', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
              {
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                data: businessData,
                hoverAnimation: true,
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
                        color: '#F85D41', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#F85D41', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            ],
          })
        } else {
          chart.setOption({
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                crossStyle: {
                  color: '#999',
                },
              },
            },
            grid: {
              top: '5%',
              bottom: '5%',
              left: '10%',
              right: '10%',
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: xAxisData,
              axisLabel: {
                rotate: 30, //轴线刻度旋转角度
                color: '#32C5FF',
              },
              axisTick: {
                show: false, //标轴轴刻度
              },
              splitLine: {
                show: false, //坐标轴分隔线
              },
              axisPointer: {
                type: 'shadow', //指示器类型
              },
              axisLine: {
                show: true, //是否显示轴线
                lineStyle: {
                  color: '#fff',
                },
              },
            },

            yAxis: {
              splitLine: {
                show: false,
                lineStyle: {
                  type: 'solid',
                  color: '#D8D8D8',
                },
              },
              axisTick: {
                show: false, //标轴轴刻度
              },
              minInterval: 1,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#fff',
                },
              },
              axisLabel: {
                //rotate: 30, //轴线刻度旋转角度
                color: '#32C5FF',
              },
            },
            series: [
              {
                type: 'bar',
                barWidth: '20%',
                label: {
                  show: false, //柱条上面的数值
                  position: 'top',
                  color: '#fff',
                  fontFamily: 'din-bold',
                },
                // itemStyle: {
                //   barBorderRadius: [5, 5, 0, 0],
                // },
                data: propertyData,

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
                        color: '#45F048', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#4C8D0A', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
              {
                type: 'bar',
                barWidth: '20%',
                label: {
                  show: false, //柱条上面的数值
                  position: 'top',
                  color: '#fff',
                  fontFamily: 'din-bold',
                },
                data: businessData,
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
                        color: '#5FD5FA', // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#0A1F7A', // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            ],
          })
        }
      }
    })
  }, [data1, data2])

  return <div ref={ref} className={className} />
}
