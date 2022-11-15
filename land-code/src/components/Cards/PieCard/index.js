/*
 * @Author: your name
 * @Date: 2020-07-16 13:26:12
 * @LastEditTime: 2020-08-07 09:43:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bigdata\src\components\Cards\PieCard\index.js
 */

import React from 'react'
import { Popover, Button, Card } from 'antd'

import Pie from '@/components/Charts/Pie'
import styles from './index.less'

export default function PieCard({ title, subTitle, data, total, flag, loading, hasLegend = true }) {
  const noData = !data || !data.length || data.every(item => item.y === 0)
  let subArr
  if (!noData) {
    // 数据中会出现多个相同 x 值的情况，需要先把相同的合到一起
    const map = {}
    data.forEach(({ x, y }) => {
      if (map[x]) {
        map[x] += y
      } else {
        map[x] = y
      }
    })
    data = Object.entries(map).map(([x, y]) => ({ x, y }))
    data.sort((a, b) => b.y - a.y)
    const unKnow = data.filter(function (itme) {
      return itme.x === "未知";
    });
    data = data.filter(function (itme) {
      return itme.x != "未知";
    });
    if(unKnow.length != 0){
      data.push({
        x: '其他',
        y: unKnow[0].y
      })
    }
    if (data.length > 6) {
      // 如果条目的长度超过了 6 会显示不下，所有只显示最多的前 5 个，剩下的合并到“其他”中
      subArr = data.slice(0, 5)
      const left = data.slice(5).reduce((total, item) => total + item.y, 0)
      subArr.push({
        x: '其他',
        y: left
      })
    } else subArr = data
  }

  const content = (
    <div className={styles.contentlist}>
      {data.map(item => {
        return (
          <div className={styles.list}>
            <p>{item.x}</p>
            <p>{item.y}</p>
          </div>
        )
      })}
    </div>
  )
  return (
    <Card bordered={false} style={{ marginBottom: 24, borderRadius: 20 }} loading={loading}>
      <div className={styles.header}>
        <h4 className={styles.title} >{title}</h4>
        <p className={styles.value} >
          {flag && (
            <Popover placement="bottomRight" content={content} trigger="click">
              查看更多
            </Popover>
          )}
        </p>
      </div>
      {!noData ? (
        <Pie
          subTitle={subTitle}
          hasLegend={hasLegend}
          total={() => total || data.reduce((total, item) => item.y + total, 0)}
          data={subArr}
          height={250}
        />
      ) : (
        <div style={{ height: 250 }}>暂无数据</div>
      )}
    </Card>
  )
}
