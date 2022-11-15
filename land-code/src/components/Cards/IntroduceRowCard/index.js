/*
 * @Author: your name
 * @Date: 2020-07-22 14:42:35
 * @LastEditTime: 2020-08-04 14:23:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bigdata\src\components\Cards\IntroduceRowCard\index.js
 */

import React from 'react'
import { Icon, Card, Statistic } from 'antd'
import { Link } from 'umi'

import styles from './index.less'

export default function IntroduceRowCard({ data, loading }) {
  return (
    <Card bordered={false} style={{ marginBottom: 24, borderRadius: 20 }} loading={loading}>
      <div className={styles.content}>
        {data.map((item, index) => {
          if (!item.link) {
            return (
              <Statistic
                title={item.title}
                value={item.value}
                key={index}
                valueStyle={{ color: '#1F7FF7', fontSize: 35 }}
              />
            )
          } else {
            return (
              <Link to={item.link}>
                <Statistic
                  title={item.title}
                  value={item.value}
                  key={index}
                  valueStyle={{ color: '#1F7FF7', fontSize: 35 }}
                />
              </Link>
            )
          }
        })}
      </div>
    </Card>
  )
}
