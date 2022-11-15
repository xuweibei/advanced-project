import { Card, Tabs } from 'antd'
import React, { FC, useEffect, useState } from 'react'
// import ImageUpload from '@/components/Uploader/ImageUpload'
import { ConnectProps, ConsoleModelState, Dispatch } from 'umi'
import FormContainer from '@/components/FormContainer'
import styles from './index.less'

import Photo from './Photo'
import Video from './Video'
import Drawing from './Drawing'
import Documentation from './Documentation'

interface DigitalProps extends ConnectProps {
  dispatch: Dispatch
  consoleDatas: ConsoleModelState
  loading: boolean
}
const { TabPane } = Tabs

const DigitalRecord: FC<DigitalProps> = props => {
  const key = window.localStorage.getItem('activeTabKey')
  const defaultActiveKey = key
  window.localStorage.removeItem('activeTabKey')

  return (
    <Card>
      <Tabs type="card" defaultActiveKey={defaultActiveKey ? defaultActiveKey : '1'}>
        <TabPane tab="图片" key="1">
          <Photo />
        </TabPane>
        <TabPane tab="视频" key="2">
          <Video />
        </TabPane>
        <TabPane tab="图纸" key="3">
          <Drawing />
        </TabPane>
        <TabPane tab="文档" key="4">
          <Documentation />
        </TabPane>
      </Tabs>
    </Card>
  )
}

export default DigitalRecord
