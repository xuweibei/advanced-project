import React, { FC, useEffect, useState, useCallback } from 'react'
import { ConnectProps, connect, Dispatch, history } from 'umi'
import { Card, Avatar, Descriptions, Row, Col, DatePicker, Form, Button, Select } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'
import { ConnectState } from '@/models/connect'
import FormContainer from '@/components/FormContainer'
import { UserModelState } from '@/models/user'
import { getAllCity } from '@/services/api'
import { getGender, ServiceList } from '@/utils/utils'

const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

interface UserDetailProps extends ConnectProps {
  dispatch: Dispatch
  user: UserModelState
  loading: boolean
}
const UserDetail: FC<UserDetailProps> = (props: any) => {
  const { user, dispatch, loading } = props
  const [mobile, setMobile] = useState<number>()
  // const [hostTotalInfo, setHostTotalInfo] = useState<any>()
  const [hostDeviceInfo, setHostDeviceInfo] = useState<any[]>([])
  const [hostSceneInfo, setSceneDeviceInfo] = useState<any[]>([])
  const [allCities, setAllCities] = useState<any>([])

  useEffect(() => {
    getAllCity().then(res => {
      setAllCities(res)
    })
  }, [])

  useEffect(() => {
    setMobile(props.match.params.id)
  }, [props.match.params.id])
  useEffect(() => {
    if (mobile) {
      dispatch({
        type: 'user/queryUserInfo',
        payload: {
          mobile,
        },
      })
      dispatch({
        type: 'user/queryUserObtainedHostAndPermission',
        payload: {
          mobile,
          page: 1,
          pageSize: 10,
        },
      })
      dispatch({
        type: 'user/queryUserExecutionHistory',
        payload: {
          pageIndex: 1,
          pageCount: 10,
          execMobile: mobile,
        },
      })
    }
  }, [mobile])

  useEffect(() => {
    // setHostTotalInfo(user.UserHostInfo)
    user.UserHostInfo.forEach((item: any) => {
      hostDeviceInfo.push(...item.devices)
      hostSceneInfo.push(...item.scenes)
    })
    setHostDeviceInfo(hostDeviceInfo)
    setSceneDeviceInfo(hostSceneInfo)
  }, [user.UserHostInfo])

  const getLastLoginCity = (data: any) => {
    let userLastLoginCity = allCities.find(
      (city: any) => city.cityid.substr(0, 4) == data.substr(0, 4)
    )
    return userLastLoginCity && userLastLoginCity.city
  }

  const renderUserMessage = (data: any) => {
    return (
      <Row>
        <Col md={4} sm={24}>
          <Avatar
            size="large"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575614673388&di=9524a6095ca63e0d7f69cd8e9a795ea6&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170901%2Ffc6a2a3b00b54aa68f4f11174def5c75.jpeg"
          />
        </Col>
        <Col md={20} sm={24}>
          <Descriptions>
            <DescriptionItem label="姓名">{data.realName ? data.realName : '--'}</DescriptionItem>
            <DescriptionItem label="上次登录时间" span={2}>
              {data.lastLogin ? data.lastLogin : '--'}
            </DescriptionItem>
            <DescriptionItem label="手机号">{data.mobile ? data.mobile : '--'}</DescriptionItem>
            <DescriptionItem label="上次登录地址" span={2}>
              {data.city ? getLastLoginCity(data.city) : '--'}
            </DescriptionItem>
            <DescriptionItem label="生日" span={3}>
              {data.birthday ? data.birthday : '--'}
            </DescriptionItem>
            <DescriptionItem label="性别" span={3}>
              {data.gender ? getGender(data.gender) : '--'}
            </DescriptionItem>
            <DescriptionItem label="注册时间" span={3}>
              {data.createTime ? moment(data.createTime).format('YYYY-MM-DD HH:mm') : '--'}
            </DescriptionItem>
          </Descriptions>
        </Col>
      </Row>
    )
  }

  const getTypesName = (data: any) => {
    const typsList = data.split(',')
    const context: any = []
    typsList.map((item: any, index: any) => {
      const currService: any = ServiceList.find(service => service.value == item)
      context.push(currService.name)
    })
    return context.length > 0 ? context.join(',') : '--'
  }

  const renderServer = () => {
    const columns = [
      {
        title: '房间',
        render: (record: any) => record.buildingName + record.blockHomeName,
      },
      {
        title: '入住时间',
        dataIndex: 'checkTime',
        render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
      },
      {
        title: '开通功能',
        dataIndex: 'types',
        render: (text: any) => getTypesName(text),
      },
      {
        title: '操作',
        render: (text: any, record: any) => {
          if(record.hostId){
            const href = `/host-management/host/list/${record.hostId}`
            return (
              <a href={href} target="_blank">
                查看主机
              </a>
            )
          }else{
            return '--'
          }
        },
      },
    ]
    const handleTableChange = (pagination: any) => {
      dispatch({
        type: 'user/queryUserObtainedHostAndPermission',
        payload: {
          mobile,
          page: pagination.current,
          pageSize: pagination.pageSize,
        },
      })
    }
    return (
      <>
        <StandardTable
          showPagination={true}
          loading={loading}
          data={user.serviceInfo}
          columns={columns}
          rowKey={(record: any, index: any) => index}
          onChange={handleTableChange}
        />
      </>
    )
  }

  const getOperationContent = (record: any) => {

    if (!hostDeviceInfo && !hostSceneInfo) {
      if (record.deviceId) {
        return `操作设备ID：${parseInt(record.deviceId, 10)}`
      }
      if (record.patternId) {
        return `操作场景ID：${parseInt(record.patternId, 10)}`
      }
    }
    // const { devices } = hostTotalInfo
    // const { scenes } = hostTotalInfo
    if (!hostDeviceInfo && !hostSceneInfo) {
      if (record.deviceId) {
        return `操作设备ID：${parseInt(record.deviceId, 10)}`
      }
      if (record.patternId) {
        return `操作场景ID：${parseInt(record.patternId, 10)}`
      }
    }
    if (record.patternId) {
      const patternId = parseInt(record.patternId, 10)
      const homeId = record.homeId
      const pattern =
        hostSceneInfo &&
        hostSceneInfo.find((item: any) => item.PATTERN_ID === patternId && item.HOME_ID === homeId)
      if (pattern) {
        return `${pattern.PATTERN_NAME}`
      } else {
        return `操作场景ID：${parseInt(record.patternId, 10)}`
      }
    }
    if (!hostDeviceInfo || !record.deviceId) {
      if (record.deviceId) {
        return `操作设备ID：${parseInt(record.deviceId, 10)}`
      } else {
        return
      }
    }
    const homeId = record.homeId
    const deviceId = parseInt(record.deviceId, 10)
    const device = hostDeviceInfo.find(
      (item: any) => item.DEVICE_ID === deviceId && item.HOME_ID === homeId
    )
    if (!device) {
      return `操作设备ID：${parseInt(record.deviceId, 10)}`
    }
    if (record['On/Off']) {
      // 开关控制
      return `${record['On/Off'] === '1' ? '打开' : '关闭'}${device.NAME}`
    }
    if (record.Brightness) {
      // 亮度控制
      return `设置${device.NAME}亮度：${parseInt(record.Brightness, 16)}`
    }
    if (record.Stop) {
      // 停止窗帘
      return `停止${device.NAME}`
    }
    if (record['Up/Down']) {
      // 打开/关闭 窗帘
      return `${record['Up/Down'] === '1' ? '打开' : '关闭'}${device.NAME}`
    }
    if (record.SetPoint) {
      // 温度控制
      return `设置${device.NAME}温度：${parseFloat(record.SetPoint)}`
    }
    if (record.Mode) {
      // 模式控制
      const { model } = device.DESCRIPTION
      if (!model) {
        return `设置${device.NAME}模式：${record.Mode}`
      }
      const m = model.find((item: any) => item.value === record.Mode)
      if (!m) {
        return `设置${device.NAME}模式：${record.Mode}`
      }
      return `设置${device.NAME}模式：${(m && m.name) || ''}`
    }
    if (record.FanSpeed) {
      // 风速控制
      const { speed } = device.DESCRIPTION
      if (!speed) {
        return `设置${device.NAME}风速：${record.FanSpeed}`
      }
      const s = speed.find((item: any) => item.value === record.FanSpeed)
      if (!s) {
        return `设置${device.NAME}风速：${record.FanSpeed}`
      }
      return `设置${device.NAME}风速：${(s && s.name) || ''}`
    }
  }

  const operationLog = () => {
    const [form] = Form.useForm()
    const [formdatas, setFormdatas] = useState({})
    // const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 })

    const columns = [
      {
        title: '操作时间',
        dataIndex: 'time',
        ellipsis: true,
        render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:MM') : '--'),
      },
      {
        title: '操作类型',
        dataIndex: 'type',
        render: (text: any) => (text ? text : '--'),
      },
      {
        title: '内容',
        dataIndex: 'encryptedHomeId',
        render: (text: any, record: any) => getOperationContent(record),
      },
      {
        title: '房间号',
        dataIndex: 'roomNo',
        render: (text: any, record: any) => {
          return record.buildingName + record.blockHomeName
        },
      },
      {
        title: '操作设备',
        dataIndex: 'platform',
        render: (text: any) => (text ? text : '--'),
      },
    ]
    const handelSubmit = (value: any, pagination?: any) => {
      setFormdatas(value)
      let date = pagination
        ? { pageIndex: pagination.current, pageCount: pagination.pageSize }
        : { pageIndex: 1, pageCount: 10 }

      if (value.type == undefined || value.type === 1) {
        dispatch({
          type: 'user/queryUserExecutionHistory',
          payload: {
            ...date,
            execMobile: mobile,
            beginDate: value.time && value.time[0].format('YYYY-MM-DD'),
            endDate: value.time && value.time[1].format('YYYY-MM-DD'),
          },
        })
      } else if (value.type === 2) {
        dispatch({
          type: 'user/getCameraStatsInfo',
          payload: {
            mobile,
            ...date,
            beginDate: value.time && value.time[0].format('YYYY-MM-DD'),
            endDate: value.time && value.time[1].format('YYYY-MM-DD'),
          },
        })
      } else if (value.type === 3) {
        dispatch({
          type: 'user/getUserActiveToApp',
          payload: {
            mobile,
            ...date,
            beginDate: value.time && value.time[0].format('YYYY-MM-DD'),
            endDate: value.time && value.time[1].format('YYYY-MM-DD'),
          },
        })
      }
    }
    const handelReset = () => {
      form.resetFields()
      setFormdatas({})
      dispatch({
        type: 'user/queryUserExecutionHistory',
        payload: {
          pageIndex: 1,
          pageCount: 10,
          execMobile: mobile,
        },
      })
    }

    const handleLogTableChange = (pagination: any) => {
      handelSubmit(formdatas, pagination)
    }
    const renderForm = () => {
      return (
        <Form form={form} onFinish={handelSubmit} layout="inline">
          <Row className={styles.header}>
            <Col span={8}>
              <FormItem label="操作时间段" name="time">
                <RangePicker />
              </FormItem>
            </Col>
            <Col span={8} style={{ paddingLeft: 10 }}>
              <FormItem label="操作类型" name="type">
                <Select allowClear defaultValue={1}>
                  <Option key={1} value={1}>
                    智能家居
                  </Option>
                  <Option key={2} value={2}>
                    车位监控
                  </Option>
                  <Option key={3} value={3}>
                    App埋点
                  </Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={handelReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      )
    }

    return (
      <>
        <FormContainer>{renderForm()}</FormContainer>
        <StandardTable
          showPagination={true}
          data={user.UserExecutionHistory}
          columns={columns}
          rowKey={(record: any, index: any) => index}
          onChange={handleLogTableChange}
        />
      </>
    )
  }

  return (
    <>
      <Card title="用户信息" bordered={false} style={{ marginBottom: 24 }}>
        {renderUserMessage(user.userInfo)}
      </Card>
      <Card title="服务" bordered={false} style={{ marginBottom: 24 }}>
        {renderServer()}
      </Card>
      <Card title="操作日志" bordered={false} style={{ marginBottom: 24 }}>
        {operationLog()}
      </Card>
    </>
  )
}
export default connect(({ user, loading }: ConnectState) => ({
  user,
  loading: loading.models.user,
}))(UserDetail)
