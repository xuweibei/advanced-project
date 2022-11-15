import { iconList } from '@/utils/utils'
import PlusOutlined from '@ant-design/icons/lib/icons/PlusOutlined'
import { Col, Modal, Row } from 'antd'
import React, { useState } from 'react'
import styles from '../ImagePicker/index.less'
const ImagePicker = (props: any) => {
  const { onChange, value } = props
  const [visible, setVisible] = useState(false)
  const UploadButton = () => {
    return (
      <div className={styles.uploadButton}>
        <PlusOutlined />
      </div>
    )
  }
  return (
    <>
      <Modal visible={visible} title="选择图标" width={800} onCancel={() => setVisible(false)}>
        <Row>
          {iconList &&
            iconList.map((item: any) => {
              return (
                <Col
                  span={6}
                  style={{ marginBottom: '20px' }}
                  onClick={() => {
                    onChange(item)
                    setVisible(false)
                  }}
                >
                  <img src={item.url} />
                </Col>
              )
            })}
        </Row>
      </Modal>
      <div onClick={() => setVisible(true)}>
        {value ? (
          <img
            style={{
              width: '60px',
              height: '60px',
              marginRight: '20px',
            }}
            src={value.url}
          />
        ) : (
          <UploadButton />
        )}
      </div>
    </>
  )
}

export default ImagePicker
