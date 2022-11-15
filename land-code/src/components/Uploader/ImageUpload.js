import React, { useState } from 'react'
import { Upload, Icon, message } from 'antd'
import { UPLOAD_SERVICE_URL } from '@/services/api'
import styles from './index.less'

function ImageUpload(props) {
  const [loading, setLoading] = useState(false)
  const { value, img, onChange, forwardRef, onComplete } = props
  const imageUrl = value || img

  const handleChange = info => {
    const file = info.file
    if (file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (file.status === 'error') {
      setLoading(false)
      message.error('上传失败')
      return
    }
    if (file.status === 'done') {
      setLoading(false)
      onChange && onChange(file.response)
      onComplete && onComplete(file)
    }
  }

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">点击上传</div>
    </div>
  )

  const uploadImg = imageUrl => (
    <div className={styles.imgUpload}>
      <Icon type={loading ? 'loading' : ''} className={styles.imgIcon} />
      <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%' }} />
    </div>
  )

  return (
    <Upload
      ref={forwardRef}
      name="file"
      listType="picture-card"
      accept="image/png,image/jpeg,image/jpg,image/gif"
      className="avatar-uploader"
      showUploadList={false}
      action={UPLOAD_SERVICE_URL}
      onChange={handleChange}>
      {imageUrl ? uploadImg(imageUrl) : uploadButton}
      
    </Upload>
  )
}

export default React.forwardRef((props, ref) => <ImageUpload forwardRef={ref} {...props} />)
