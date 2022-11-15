import React, { PureComponent } from 'react'
import { uploadXlsFile } from '@/services/api'
import { message } from 'antd'

import styles from './index.less'

const XlsUploader = () => {
  const onChange = ({ nativeEvent }: any) => {
    const file = nativeEvent.target.files[0]
    uploadXlsFile(file).then(() => {
      message.info('批量导入成功')
    })
  }

  return (
    <label htmlFor="h5FileInput" className={styles.imageSelector}>
      <input
        className={styles.hideInput}
        id="h5FileInput"
        multiple
        accept="xls/*"
        type="file"
        name="h5uploader"
        onChange={onChange}
      />
      <div className={styles.uploadButton}>Excel 批量上传</div>
    </label>
  )
}
export default XlsUploader
