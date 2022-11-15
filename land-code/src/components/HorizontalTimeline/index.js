import React, { PureComponent } from 'react'
import { Empty, Icon } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import classnames from 'classnames'

import styles from './index.less'
import Item from './Item'

// TODO:添加翻页功能，不使用滚动条
class HorizontalTimeline extends PureComponent {
  constructor() {
    super()
    this.state = {
      defaultLeft: 0,
      showButton: false,
      cursorLeft: false,
      cursorRight: true,
      opacityLeft: true,
      opacityRight: false,
      count: 0,
    }
  }
  render() {
    let styleObj = {
      left: this.state.defaultLeft + 'px',
    }
    const { children } = this.props
    if (!children || !children.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }

    const itemsCount = React.Children.count(children)
    const items = React.Children.map(children, (ele, index) => {
      return React.cloneElement(ele, {
        className: classnames(ele.props.className, {
          [styles.lastItem]: index === itemsCount - 1,
        }),
      })
    })
    return (
      <div className={styles.timeline}>
        <div style={styleObj} className={styles.styleObj}>
          {items}
        </div>
      </div>
    )
  }
}

HorizontalTimeline.Item = Item
export default HorizontalTimeline
