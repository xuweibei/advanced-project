import React, { useRef, useLayoutEffect } from 'react'
import echarts from 'echarts'
import geoJSON from './geoData.json'
import { geoCoordMap } from './geoCoordMap'

interface Props {
  data: { name: any; value: any }[]
  className?: string
}

const colors = [
  '#18DBFD',
  '#F6FD18',
  '#FD8918',
  '#5B8FF9',
  '#FAD65F',
  '#FF9D4D',
  '#5AD8A6',
  '#BDEFDB',
  '#269A99',
  '#FF99C3',
  '#FBE5A2',
  '#F6BD16',
  '#9270CA',
  '#F6C3B7',
  '#6DC8EC',
  '#E8684A',
  '#C19030',
  '#1677FF',
  '#389E0D',
  '#00BFD0',
  '#FF6565',
]

export default function ChartMap({ className, data }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        let convertData = function(data: any) {
          let res = []
          data = data.concat()
          data.sort((a: any, b: any) => b.value - a.value)
          for (var i = 0; i < data.length; i++) {
            let geoCoord = geoCoordMap[data[i].name]
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
                itemStyle: {
                  color: i < colors.length ? colors[i] : 'greenyellow',
                },
              })
            }
          }
          return res
        }
        const convertedData = convertData(data)
        let legendData: any[] = []
        convertedData.forEach(element => {
          legendData.push(element.name)
        })
        const chartMap = echarts.init(ref.current)
        echarts.registerMap('china', geoJSON)
        chartMap.setOption({
          tooltip: {
            triggerOn: 'mousemove',
            formatter: function(params: any) {
              if (params.value[2]) {
                return params.name + '<br>主机数：' + params.value[2]
              }
              return params.name
            },
          },
          legend: {
            show: true,
            // y: 'bottom',
            // x: 'right',
            itemWidth: 15,
            data: legendData,
            textStyle: {
              color: '#fff',
            },
          },
          geo: {
            map: 'china',
            roam: false,
            zoom: 1.2,
            center: [104.29, 35.8],
            itemStyle: {
              areaColor: '#061C68',
              borderWidth: 1, //设置外层边框
              borderColor: '#24C1F7',
              shadowColor: 'rgba(10,76,139,1)',
              shadowOffsetY: 0,
              shadowBlur: 50,
            },
            emphasis: {
              itemStyle: {
                color: '#fff',
                areaColor: '#061C68',
                borderWidth: 1, //设置外层边框
                borderColor: '#24C1F7',
                shadowBlur: 5,
                shadowColor: '#4682B4',
                shadowOffsetY: 6,
              },
              label: {
                show: true,
                color: '#fff',
              },
            },
          },
          series: [
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              rippleEffect: {
                scale: 5,
              },
              label: {
                show: true,
                position: ['80%', '20%'],
                color: '#fff',
                fontFamily: 'din-bold',
                formatter: '{@value}\n{b}',
              },
              data: convertedData,
            },
          ],
          // visualMap: [
          //   {
          //     type: 'piecewise',
          //     bottom: 20,
          //     left: 20,
          //     textStyle: {
          //       color: '#FFFF',
          //     },
          //     categories: legendData,
          //     inRange: {
          //       // 每个数组项和 categories 数组项一一对应：
          //       color: colors,
          //     },
          //   },
          // ],
        })
      }
    }, 0)
  }, [data])

  return <div ref={ref} className={className} />
}
