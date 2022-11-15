import React, { Component } from 'react'
import { Chart, Geom, Coord, Label, Tooltip as ChartTooltip } from 'bizcharts'
import { Tooltip } from 'antd'
import { DataView } from '@antv/data-set'
import classNames from 'classnames'
import ReactFitText from 'react-fittext'
import Debounce from 'lodash-decorators/debounce'
import Bind from 'lodash-decorators/bind'
import styles from './index.less'
import autoHeight from '../autoHeight'

/* eslint react/no-danger:0 */
@autoHeight()
class Pie extends Component {
  state = {
    height: 0,
    legendData: [],
    legendBlock: false
  }

  componentDidUpdate(preProps) {
    const { data } = this.props
    if (data !== preProps.data) {
      // because of charts data create when rendered
      // so there is a trick for get rendered time
      this.getLegendData()
    }
  }

  getG2Instance = chart => {
    this.chart = chart
    requestAnimationFrame(() => {
      this.getLegendData()
    })
  }

  // for custom lengend view
  getLegendData = () => {
    if (!this.chart) return
    const geom = this.chart.getAllGeoms()[0] // 获取所有的图形
    if (!geom) return
    const items = geom.get('dataArray') || [] // 获取图形对应的

    const legendData = items.map(item => {
      /* eslint no-underscore-dangle:0 */
      const origin = item[0]._origin
      origin.color = item[0].color
      origin.checked = true
      return origin
    })

    this.setState({
      legendData
    })
  }

  handleRoot = n => {
    this.root = n
  }

  handleLegendClick = (item, i) => {
    const newItem = item
    newItem.checked = !newItem.checked

    const { legendData } = this.state
    legendData[i] = newItem

    const filteredLegendData = legendData.filter(l => l.checked).map(l => l.x)

    if (this.chart) {
      this.chart.filter('x', val => filteredLegendData.indexOf(val) > -1)
    }

    this.setState({
      legendData
    })
  }

  // for window resize auto responsive legend
  @Bind()
  @Debounce(300)
  resize() {
    console.log('resize')
    const { hasLegend } = this.props
    const { legendBlock } = this.state
    if (!hasLegend || !this.root) {
      window.removeEventListener('resize', this.resize)
      return
    }
    if (this.root.parentNode.clientWidth <= 380) {
      if (!legendBlock) {
        this.setState({
          legendBlock: true
        })
      }
    } else if (legendBlock) {
      this.setState({
        legendBlock: false
      })
    }
  }

  render() {
    const {
      valueFormat,
      subTitle,
      total,
      hasLegend = false,
      className,
      style,
      height,
      inner = 0.75,
      animate = true,
      lineWidth = 1
    } = this.props

    const { legendData, height: stateHeight, legendBlock } = this.state
    const pieClassName = classNames(styles.pie, className, {
      [styles.hasLegend]: true,
      [styles.legendBlock]: legendBlock
    })

    const { data, selected: propsSelected = true, tooltip: propsTooltip = true } = this.props

    let selected = propsSelected
    let tooltip = propsTooltip

    selected = selected || true
    tooltip = tooltip || true

    const scale = {
      x: {
        type: 'cat',
        range: [0, 1]
      },
      y: {
        min: 0
      },
      percent: {
        formatter: val => (val * 100).toFixed(2) + '%'
      }
    }

    // 计算百分比
    const sum = data.reduce((sum, item) => sum + item.y, 0)
    const dv = data.slice(0, data.length - 1).map(item => ({
      x: item.x,
      y: item.y,
      percent: Number((item.y / sum).toFixed(4))
    }))
    const leftItem = data[data.length - 1]
    dv.push({
      x: leftItem.x,
      y: leftItem.y,
      percent: Number((1 - dv.reduce((total, item) => total + item.percent, 0)).toFixed(4))
    })

    return (
      <div ref={this.handleRoot} className={pieClassName} style={style}>
        <ReactFitText maxFontSize={25}>
          <div className={styles.chart}>
            <Chart
              scale={scale}
              height={height || stateHeight}
              data={dv}
              padding={[12, 0, 12, 0]}
              animate={animate}
              onGetG2Instance={this.getG2Instance}
              forceFit
            >
              {!!tooltip && <ChartTooltip showTitle={false} />}
              <Coord type="theta" innerRadius={inner} radius={0.8} />
              <Geom
                style={{ lineWidth, stroke: '#fff' }}
                type="intervalStack"
                position="percent"
                color={['x']}
                selected={selected}
              >
                <Label
                  content="percent"
                  labelLine={{
                    lineWidth: 1, // 线的粗细
                    //stroke: ['x'], // 线的颜色
                    lineDash: [2, 1] // 虚线样式
                  }}
                />
              </Geom>
            </Chart>

            {(subTitle || total) && (
              <div className={styles.total}>
                {subTitle && <h4 className={styles.piesubtitle}>{subTitle}</h4>}
                {/* eslint-disable-next-line */}
                {total && (
                  <div className={styles.piestat}>{typeof total === 'function' ? total() : total}</div>
                )}
              </div>
            )}
          </div>
        </ReactFitText>
        {hasLegend && (
          <ul className={styles.legend}>
            {legendData.map((item, i) => (
              <li key={item.x} onClick={() => this.handleLegendClick(item, i)}>
                <span
                  className={styles.dot}
                  style={{
                    backgroundColor: !item.checked ? '#aaa' : item.color
                  }}
                />
                <Tooltip placement="topLeft" title={item.x} arrowPointAtCenter>
                  <span className={styles.legendTitle}>{item.x}</span>
                </Tooltip>
                <span className={styles.value}>{valueFormat ? valueFormat(item.y) : item.y}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
}

export default Pie
