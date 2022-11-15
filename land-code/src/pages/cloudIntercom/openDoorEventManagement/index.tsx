import React, { useCallback, useEffect, useState } from 'react'
import { Menu, Form, Row, Col, Button, Input, DatePicker, Select } from 'antd'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'
import { getPermission2Level, queryDoorLogs, getDeviceList } from '@/services/api'
import FormContainer from '@/components/FormContainer'

const FormItem = Form.Item
const { SubMenu } = Menu
const { Option } = Select

const OpenDoorEventManagement = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>({})
  const [value, setValue] = useState<any>()
  const [currCommunityId, setCurrCommunityId] = useState<any>(null)
  const [deviceList, setDeviceList] = useState<any[]>([])
  const [form] = Form.useForm()

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          beginTime: moment()
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment()
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
          ...formdatas,
          buildingId: currCommunityId,
        }
        queryDoorLogs(data).then(res => {
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
        let params = {
          buildingId: currCommunityId,
        }
        getDeviceList(params).then(res => {
          setDeviceList(res)
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
        let data = {
          ...res,
          beginTime: moment(res.date)
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(res.date)
            .endOf('day')
            .format('YYYY-MM-DD HH:mm:ss'),
        }
        console.log(data, 'datadatadata')
        setformdatas(data)
      })
      .catch(e => {
        console.log(e, '获取searchform值错误')
      })
  }

  const disabledDate = (current: any) => {
    return current && current > moment().endOf('day')
  }

  const renderForm = () => {
    return (
      <Form form={form} layout="inline">
        <Row>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem
              label="对讲设备"
              name="deviceSerial"
              rules={[{ required: true, message: '请选择设备！' }]}
            >
              <Select allowClear style={{ width: '100%' }}>
                {deviceList.map((item: any) => (
                  <Option key={item.id} value={item.doorDeviceNo}>
                    {item.deviceName}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem label="手机号" name="phoneNumber">
              <Input placeholder="输入手机号搜索" />
            </FormItem>
          </Col>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem label="开门时间" name="date">
              <DatePicker
                disabledDate={disabledDate}
                allowClear={false}
                defaultValue={moment()}
                onChange={val => setValue(val)}
              />
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
      page: query.current,
      page_size: query.pageSize,
    })
  }

  const columns = [
    {
      title: '对讲设备',
      dataIndex: 'deviceName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '事件类型',
      dataIndex: 'eventDescription',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '开门时间',
      dataIndex: 'dateTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
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
export default OpenDoorEventManagement
