import React from 'react'
import { DefaultFooter } from '@ant-design/pro-layout'
import styles from './index.less'

export default () => (
  <>
    <DefaultFooter copyright=" Since 2020 上海新柏石智能科技股份有限公司" links={false} />
    <div className={styles.version}>
      <label>当前版本:{VERSION}</label>
    </div>
  </>
)
