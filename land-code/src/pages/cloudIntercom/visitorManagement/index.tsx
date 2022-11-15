import React, { useCallback, useEffect, useState } from 'react'
import { Menu, Form, Row, Col, Button, Input, DatePicker, Select } from 'antd'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'
import { getPermission2Level, queryInvitationRecords } from '@/services/api'
import FormContainer from '@/components/FormContainer'

const FormItem = Form.Item
const { SubMenu } = Menu
const { Option } = Select

const VisitorManagement = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>({})
  const [currCommunityId, setCurrCommunityId] = useState<any>(null)
  const [form] = Form.useForm()

  const fetch = useCallback(
    (pagination: any = { pageNum: 1, pageSize: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          ...formdatas,
          buildingId: currCommunityId,
        }
        queryInvitationRecords(data).then(res => {
          setLoading(false)
          setData({
            list: res.results,
            pagination: {
              total: res.count,
              current: pagination.pageNum,
              pageSize: pagination. pageSize,
            },
          })
        })
      }
    },

    [currCommunityId, formdatas]
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

  const areaMenu = () => {
    const handleClick = (e: any) => {
      form.resetFields()
      setformdatas({})
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

  //重置查询
  const handelReset = () => {
    setformdatas({})
    form.resetFields()
  }

  //查询
  const search = () => {
    form
      .validateFields()
      .then(res => {
        setformdatas(res)
      })
      .catch(e => {
        console.log(e, '获取searchform值错误')
      })
  }

  const renderForm = () => {
    return (
      <Form form={form} layout="inline">
        <Row>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem label="访客姓名" name="visitorName">
              <Input placeholder="请输入访客姓名" />
            </FormItem>
          </Col>

          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem label="预约人" name="employeeName">
              <Input placeholder="请输入预约人姓名" />
            </FormItem>
          </Col>

          <Col span={6} style={{ marginRight: 5 }}>
            <Button type="primary" onClick={search}>
              查询
            </Button>
            <Button type="primary" onClick={handelReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  const handleTableChange = (query: any) => {
    fetch({
      pageNum: query.current,
      pageSize: query.pageSize,
    })
  }

  const columns = [
    {
      title: '访客姓名',
      dataIndex: 'visitorName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '性别',
      dataIndex: 'visitorSex',
      render: (text: any) => ((text || text == 0) ? (text === 1 ? '男' : '女') : '--'),
    },
    {
      title: '手机号',
      dataIndex: 'visitorMobile',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '邀约时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '预约来访时间',
      dataIndex: 'beginTime',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '预约离开时间',
      dataIndex: 'endTime',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '预约人',
      dataIndex: 'employeeName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '预约房屋',
      dataIndex: 'blockHomeName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '来访事由',
      dataIndex: 'remark',
      render: (text: any) => (text ? text : '--'),
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
export default VisitorManagement
