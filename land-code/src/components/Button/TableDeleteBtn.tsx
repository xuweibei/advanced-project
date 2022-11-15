import React, { FC } from 'react'
import { Popconfirm } from 'antd'

import styles from './index.less'

interface Props {
  children?: string
  title?: string
  onDelete?: any
  colorText?:any
}

const TableDeleteBtn = ({ children = '删除', title = '是否确认删除？', onDelete ,colorText = 'red'}: Props) => {
  return (
    <Popconfirm title={title} onConfirm={onDelete} okText="是" cancelText="否">
      <a style={{color:colorText} }className={styles.tableDelete}>{children}</a>
    </Popconfirm>
  )
}
export default TableDeleteBtn
