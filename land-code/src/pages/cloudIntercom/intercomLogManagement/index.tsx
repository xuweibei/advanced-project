import React, { useCallback, useEffect, useState } from 'react'
import { Input, Form, Row, Col, Button, Menu } from 'antd'

import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import moment from 'moment'
import { getPermission2Level, queryTalkLogs } from '@/services/api'

const FormItem = Form.Item
const { SubMenu } = Menu

const intercomLogManagement = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>({})
  const [form] = Form.useForm()

  const [currCommunityId, setCurrCommunityId] = useState<any>(null)

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          ...formdatas,
          buildingId: currCommunityId,
        }
        queryTalkLogs(data).then(res => {
          setLoading(false)
          setData({
            list: res.results,
            pagination: {
              total: res.count,
              current: pagination.page,
              pageSize: pagination.page_size,
            },
          })
        })
      }
    },
    [formdatas, currCommunityId]
  )

  useEffect(() => {
    getPermission2Level().then(res => {
      setArea(res.regions)
      setCurrCommunityId(res.regions[0].buildings[0].id)
    })
  }, [])
  useEffect(() => {
    fetch()
  }, [fetch])

  const handleSearch = (values: any) => {
    setformdatas(values)
  }

  const handelReset = () => {
    setformdatas({})
    form.resetFields()
  }

  const areaMenu = () => {
    const handleClick = (e: any) => {
      setCurrCommunityId(e.key)
    }
    const defaultArea = area && area[0]
    const defaultBuilding = defaultArea && defaultArea.buildings[0]

    return (
      <>
        {defaultArea && defaultArea.id && (
          <Menu
            onClick={v => handleClick(v)}
            defaultSelectedKeys={[`${defaultBuilding && defaultBuilding.id}`]}
            defaultOpenKeys={[`${defaultArea && defaultArea.id}`]}
            style={{ width: '100%' }}
            mode="inline"
          >
            {area.map((areaItem: any) => (
              <SubMenu key={areaItem.id} title={areaItem.name}>
                {areaItem.buildings &&
                  areaItem.buildings.map((building: any) => (
                    <Menu.Item key={building.id}>{building.name}</Menu.Item>
                  ))}
              </SubMenu>
            ))}
          </Menu>
        )}
      </>
    )
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <Row className={styles.header}>
          <Col span={6}>
            <FormItem label="主叫方" name="callingParty">
              <Input />
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="被叫方" name="calledParty">
              <Input />
            </FormItem>
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handelReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
  const handleTableChange = (query: any) => {
    fetch({
      page: query.current,
      page_size: query.pageSize,
    })
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '主叫方',
      dataIndex: 'deviceName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '被叫方',
      dataIndex: 'homeName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '通话时间',
      dataIndex: 'callTime',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '是否接通',
      dataIndex: 'connected',
      render: (text: any) => (text === 1 ? '接通' : '未接通'),
    },
  ]

  return (
    <>
      <div className={styles.owner}>
        <div className={styles.menu}>
          <div className={styles.title}>全部区域</div>
          <div className={styles.menu_content}>{areaMenu()}</div>
        </div>
        <div className={styles.content}>
          <FormContainer>{renderForm()}</FormContainer>
          <StandardTable
            loading={loading}
            showPagination={true}
            data={data}
            columns={columns}
            rowKey={(record: any, index: number) => index}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </>
  )
}
export default intercomLogManagement
