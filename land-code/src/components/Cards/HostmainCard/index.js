/*
 * @Author: your name
 * @Date: 2020-07-16 13:26:12
 * @LastEditTime: 2020-08-04 18:28:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bigdata\src\components\Cards\StatisticCard\index.js
 */

import React from 'react'
import { Card, Icon, Tooltip } from 'antd'

import styles from './index.less'

export default function HostmainCard({
  title,
  value = '',
  icon,
  color,
  img,
  loading,
  counts = []
}) {
  value = isNaN(value) ? 'N/A' : value
  return (
    <Card
      bordered={false}
      style={{ borderRadius: 16, backgroundColor: color }}
      bodyStyle={{ padding: 15 }}
      loading={loading}
    >
      <div className={styles.content}>
        <img src={img} alt="chart" />
        <div className={styles.wrapper}>
          <p className={styles.title}>{title}</p>
          <p className={styles.value}>{value}</p>
        </div>
      </div>
    </Card>
  )
}
