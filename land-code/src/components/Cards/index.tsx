import React from 'react'
import { Card } from 'antd'
import styles from './index.less'

function index(props: any) {
  const { title, value, img, loading, type } = props

  const getContent = (value: any) => {
    return value.map((app: any, index: any) => (
      <div key={index} style={{}}>
        <p className={styles.multiRow}>{app.appName}</p>
        <p className={styles.multiRow}>{app.appCount}</p>
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
        {type === 'multiRow' && value != '0' ? (
          <div className={styles.multiRowContent}>{getContent(value)}</div>
        ) : (
          <p className={styles.value}>{isNaN(value) ? 'N/A' : value}</p>
        )}
      </div>
    </Card>
  )
}

export default index
