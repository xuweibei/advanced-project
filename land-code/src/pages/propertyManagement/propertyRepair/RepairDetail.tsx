import React, { useEffect, useCallback, useState, BaseSyntheticEvent } from 'react'
import { Card, Form, message, Input, Button, Descriptions, Modal, List } from 'antd'
import { connect } from 'dva'
import useApiLoading from '@/hooks/useApiLoading'
import {
  queryRepairById,
} from '@/services/api'

import styles from './index.less'


export default function RepairDetail(props: any) {
  const [repairDetail, setRepairDetail] = useState<any>({})
  const { api, loading } = useApiLoading(queryRepairById)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [previewImg, setPreviewImg] = useState()

  const fetchUserMSG = useCallback(() => {
    api(props.match.params.id).then(res => {
      setRepairDetail(res[0])
    })
  }, [props.match.params.id])

  useEffect(() => {
    fetchUserMSG()
  }, [])


  // 预览，设置查看的当前图片，设置弹框为展开
  const handleModalVisible = (flag: boolean, item: any) => {
    setModalVisible(!!flag)
    setPreviewImg(item)
  }

  return (
    <>
      <Card className={styles.cards} title="报修人" loading={loading}>
        <Descriptions>
          <Descriptions.Item label="报修人">
            {repairDetail.nickName ? repairDetail.nickName : '--'}
          </Descriptions.Item>
          <Descriptions.Item label="报修人手机号">
            {repairDetail.contactPersonPhone ? repairDetail.contactPersonPhone : '--'}
          </Descriptions.Item>
          <Descriptions.Item label="报修房屋">
            {repairDetail.address ? repairDetail.address : '--'}
          </Descriptions.Item>
          <Descriptions.Item label="报修时间">
            {repairDetail.createdTime ? repairDetail.createdTime : '--'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="报修内容" bordered={false} className={styles.cards} loading={loading}>
        <Descriptions>
          <Descriptions.Item label="报修描述">
            {repairDetail.repairReason ? repairDetail.repairReason : '--'}
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item label="报修截图">
            {repairDetail.faultPhotos
              ? repairDetail.faultPhotos
                .split(',')
                .map((item: any, index: any) => (
                  <img
                    key={index}
                    onClick={() => handleModalVisible(true, item)}
                    src={item}
                    style={{ height: 150, marginLeft: 20 }}
                    alt="chart"
                  />
                ))
              : '--'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal footer={null} visible={modalVisible} onCancel={() => handleModalVisible(false, '')}>
        <img alt="chart" style={{ width: '100%' }} src={previewImg} />
      </Modal>
    </>
  )
}
