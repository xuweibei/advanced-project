/*
 * @Author: your name
 * @Date: 2020-07-16 13:26:12
 * @LastEditTime: 2020-08-04 15:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bigdata\src\components\Cards\StatisticCard\index.js
 */ 
import React from 'react'
import { Popover,Card,Icon,Tooltip } from 'antd'

import styles from './index.less'

export default function StatisticCard({ title, value = '', icon,text,img, loading, counts=[]}) {
  value = isNaN(value) ? 'N/A' : value
  const subtext=(
    <div>   
      <p className={styles.p1}>{title}</p>
      <p className={styles.p2}>{text}</p>
    </div>
  )

  return (
    <Card
      bordered={false}
      style={{ marginBottom: 24, borderRadius: 20}}
      bodyStyle={{ padding:0,position:'relative',display:'flex',align_items:'center'}}
      loading={loading}
    >
      <div className={styles.content}>
        <div className={styles.worldstyle}>
          <div className={styles.wrapper}>
            <p >
              {title }
              {icon && ( 
                <Popover placement="bottomLeft"  content={subtext} trigger="hover">
                  <Icon type="question-circle" className={styles.icon}/>
                </Popover>
              )}
            </p>

            <p className={styles.value}>
              {value}
            </p>
          </div>
        </div>
        <div className={styles.imagestyle}>
          <img src={img} alt="chart" />
        </div>
      </div>
    </Card>
  )
}
