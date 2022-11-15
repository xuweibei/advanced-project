import React, { FC, useEffect, useState } from 'react'
import { ConnectProps, connect, Dispatch } from 'umi'
import { Card, Descriptions } from 'antd'

import OperationLog from './operationLog'
import VersionLog from './versionLog'
import renderLifecycle from './lifecycle.js'
import { ConnectState } from '@/models/connect'
import { HostModelState } from '@/models/host'
import StandardTable from '@/components/StandardTable'

const DescriptionItem = Descriptions.Item

interface roomDetailProps extends ConnectProps {
  dispatch: Dispatch
  host: HostModelState
  loading: boolean
}

const roomDetail: FC<roomDetailProps> = (props: any) => {
  const { dispatch, host, loading } = props
  const [hostId, setHostId] = useState()
  const [activeTabKey, setActiveTabKey] = useState('tab1')

  useEffect(() => {
    setHostId(props.match.params.id)
  }, [])
  useEffect(() => {
    if (hostId) {
      dispatch({
        type: 'host/getHost',
        payload: {
          hostId,
        },
      })
      dispatch({
        type: 'host/getLifecycle',
        payload: {
          hostId,
        },
      })
      dispatch({
        type: 'host/getVersionLog',
        payload: {
          homeId: hostId,
          pageIndex: 1,
          pageSize: 10,
        },
      })
    }
  }, [hostId])

  const renderContent = (data: any) => {
    return (
      <Descriptions>
        <DescriptionItem label="设备ID">{hostId}</DescriptionItem>
        <DescriptionItem label="硬件型号">
          {data.hardward
            ? data.hardward == 'ALLWINNER'
              ? 'AI MIND'
              : data.hardward == 'Raspberry'
              ? '蜂巢'
              : data.hardward
            : '蜂巢'}
        </DescriptionItem>
        <DescriptionItem label="当前版本号">
          {data.hostVersion ? data.hostVersion : '--'}
        </DescriptionItem>
        <DescriptionItem label="出厂版本号">
          {data.testHostVersion ? data.testHostVersion : '--'}
        </DescriptionItem>
        <DescriptionItem label="出厂时间">
          {data.latestTestTime ? data.latestTestTime.trim().split(/\s+/)[0] : '--'}
        </DescriptionItem>
        <DescriptionItem label="当前状态">
          {data.status
            ? data.status == 'FACTORY'
              ? '出厂'
              : data.status == 'SCRAP'
              ? '报废'
              : data.status == 'REWORK'
              ? '返修'
              : data.status == 'INSTALL'
              ? '激活'
              : data.status == 'BIND'
              ? '绑定'
              : '--'
            : '--'}
        </DescriptionItem>
        <DescriptionItem label="在线情况">{data.online ? '在线' : '离线'}</DescriptionItem>
      </Descriptions>
    )
  }
  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '手机',
      dataIndex: 'mobile',
      ellipsis: true,
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '绑定时间',
      dataIndex: 'bindTime',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '用户详情 ',
      render: (record: any) => (
        <span>
          <a href={`/operate-management/user/list/${record.mobile}`} target="_blank">
            查看
          </a>
        </span>
      ),
    },
  ]
  const tabList = [
    {
      key: 'tab1',
      tab: '家庭操作日志',
    },
    {
      key: 'tab2',
      tab: '主机版本日志',
    },
  ]
  const contentList: any = {
    tab1: <OperationLog homeId={hostId} />,
    tab2: <VersionLog homeId={hostId} />,
  }
  return (
    <>
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <h1>房间信息：{host.hostDetail.blockHomeName}</h1>
      </Card>
      <Card title="主机信息" bordered={false} style={{ marginBottom: 24 }}>
        {renderContent(host.hostDetail)}
      </Card>
      <Card title="生命周期" bordered={false} style={{ marginBottom: 24 }}>
        {renderLifecycle(host.lifecycle)}
      </Card>
      <Card title="用户信息" bordered={false}>
        <StandardTable
          loading={loading}
          showPagination={true}
          data={{ list: host.hostDetail.userArr }}
          columns={columns}
          rowKey={(record: any) => record.id}
        />
      </Card>
      <Card
        bordered={false}
        style={{ width: '100%', marginBottom: 24 }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={key => setActiveTabKey(key)}
      >
        {contentList[activeTabKey]}
      </Card>
    </>
  )
}
export default connect(({ host, loading }: ConnectState) => ({
  host,
  loading: loading.models.host,
}))(roomDetail)
