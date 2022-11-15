import React, { PureComponent } from 'react'
import classnames from 'classnames'

import styles from './index.less'

export default class Item extends PureComponent {
  render() {
    const { className, title, description } = this.props
    return (
      <div className={classnames(styles.timelineItem, className)}>
        <div className={styles.line}></div>
        <div className={styles.icon}></div>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    )
  }
}
