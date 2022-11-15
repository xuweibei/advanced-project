import React from 'react'
import { Card } from 'antd'
import styles from './index.less'

function index(props: any) {
  const { title, value, img, loading } = props

  const getContent = (value: any) => {
    return value.map((item: any, index: any) => (
      <div key={index} style={{}}>
        {item.name && <p className={styles.multiRow}>{item.name}</p>}
        <p className={styles.multiRow}>{item.count}</p>
      </div>
    ))
  }
  return (
    <Card
      bordered={false}
      style={{ marginBottom: 24, borderRadius: 20 }}
      bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
      loading={loading}
    >
      <div className={styles.content}>
        <img style={{ opacity: 0.2, position: 'absolute', right: 5 }} src={img}></img>
        <p className={styles.title}>{title}</p>
        <div className={styles.multiRowContent}>{getContent(value)}</div>
      </div>
    </Card>
  )
}

export default index
