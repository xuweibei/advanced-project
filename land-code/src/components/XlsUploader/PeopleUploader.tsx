import React, { PureComponent } from 'react'
import { updatePeopleList } from '@/services/api'
import { message } from 'antd'

import styles from './PeopleUploader.less'

const PeopleUploader = (props: any) => {
  const onChange = ({ nativeEvent }: any) => {
    const file = nativeEvent.target.files[0]
    const { buildingId, fetch } = props
    updatePeopleList(buildingId, file)
      .then(() => {
        message.info('批量导入成功')
        fetch()
        nativeEvent.target.value = ''
      })
      .catch(e => {
        nativeEvent.target.value = ''
        console.log(e, 'e')
        // message.error(e)
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
      <div className={styles.uploadButton}>
        <p className={styles.text}>批量导入</p>
      </div>
    </label>
  )
}
export default PeopleUploader
