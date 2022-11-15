import React, { useState, useMemo, useCallback } from 'react'
import { Upload, Button, Modal } from 'antd'
import { UploadOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons'
import { UPLOAD_SERVICE_URL, upload, delPhoto } from '@/services/api'
import ImageCapture from '@/components/react-image-data-capture'

import styles from './index.less'

export default function FaceUpload(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const { value, onChange, mobile } = props
  const config = useMemo(() => ({ video: true }), [])

  const handleUploadChange = info => {
    console.log("handleUploadChange",info);
    const file = info.file
    if (file.status === 'uploading') {
      // setLoading(true)
      return
    }
    if (file.status === 'error') {
      // setLoading(false)
      message.error('上传失败')
      return
    }
    if (file.status === 'done') {
      // setLoading(false)
      onChange && onChange(file.response)
    }
  }

  const deletePhoto = async () => {
    console.log(mobile)
    if (mobile) {
      const res = await delPhoto(mobile)
    }
    onChange && onChange()
  }

  const onCapture = async imageData => {
    const file = imageData.file
    const formData = new FormData()
    formData.append('file', file)
    const res = await upload(formData)
    setModalVisible(false)
    onChange && onChange(res)
  }

  const onError = useCallback(error => {
    console.log(error)
  }, [])

  return (
    <div className={styles.faceupload}>
      <div className={styles.preview}>
        {value ? (
          <img src={value} alt="avatar" style={{ width: '100%', height: '100%' }} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.buttons}>
        <Upload
          name="file"
          accept="image/*"
          showUploadList={false}
          action={UPLOAD_SERVICE_URL}
          onChange={handleUploadChange}
        >
          <Button icon={<UploadOutlined />} className={styles.button} />
        </Upload>
        <Button
          icon={<CameraOutlined />}
          className={styles.button}
          onClick={() => setModalVisible(true)}
        />
        <Button icon={<DeleteOutlined />} className={styles.button} onClick={deletePhoto} />
      </div>
      <Modal visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)}>
        <div className={styles.imageCaptureContainer}>
          <ImageCapture
            className={styles.imageCapture}
            onCapture={onCapture}
            onError={onError}
            userMediaConfig={config}
          />
        </div>
      </Modal>
    </div>
  )
}
