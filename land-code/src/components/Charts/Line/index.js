import React, { PureComponent } from 'react'
import { Chart, Tooltip, Geom, Axis, Legend } from 'bizcharts'

export default class LineChart extends PureComponent {
  render() {
    const { data, scale } = this.props
    return (
      <Chart
        height={500}
        data={data}
        scale={scale}
        forceFit
      >
        <Legend />
        <Axis name="x" />
        <Axis name="y" />
        <Tooltip />
        <Geom
          type="line"
          style={{
            lineWidth: 3
          }}
          position="x*y"
          shape="smooth"
          color="name"
          tooltip={['x*y*name', (x, y, name) => ({
            name,
            title: x + '日',
            value: y
          })]}
        />
        <Geom type="point" position="x*y" color="name" />
      </Chart>
    )
  }
}
