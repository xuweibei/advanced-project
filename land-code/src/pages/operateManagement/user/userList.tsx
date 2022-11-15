import React, { FC, useEffect, useState } from 'react'
import { ConnectProps, connect, history, Dispatch, UserModelState } from 'umi'
import { Input, Form, Row, Col, Button, Select, DatePicker, Card } from 'antd'

import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import moment from 'moment'
import { ConnectState } from '@/models/connect'
import useLocation from '@/hooks/useLocation'
import {
  getAllCity,
  getCameraStatsInfo,
  getHostInfo,
  getUserActiveToApp,
  queryUserExecutionHistory,
  queryUserInfoByMobile,
  queryUserInfoList,
  queryUserObtainedHostAndPermissionByMobile,
  getAppUserCount,
  getUserRegisterCountToday,
  getDayActiveNum,
  getAppMonthActiveUserCount,
  getUserCityDistribution,
  getUserAppVersionDistribution,
  getAPPOpenCountOnceDay,
} from '@/services/api'

import GridContent from '@/components/PageHeaderWrapper/GridContent'
import IntroduceRowCard from '@/components/Cards/IntroduceRowCard'
// import PieCard from '@/components/Cards/PieCard/index'
import BarChart from '@/components/eCharts/BarChart'
import PieCard from '@/components/Cards/PieCard'
import lineChartBlue from '@/assets/images/line_chart_blue2.png'
import rectChartGreen from '@/assets/images/rect_chart_green2.png'
import rectChartYellow from '@/assets/images/rect_chart_yellow2.png'
import { getCityNameByCode } from '@/common/cityOptions'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const { Option } = Select
const { MonthPicker } = DatePicker

function combinCities(cities: any) {
  if (!cities || !cities.length) {
    return cities
  }
  const map = {}

  cities.forEach((item: any) => {
    map[item.x] = (map[item.x] || 0) + item.y
  })
  return Object.entries(map).map(([x, y]) => ({ x, y }))
}

interface UserListProps extends ConnectProps {
  dispatch: Dispatch
  user: UserModelState
  loading: boolean
}
const UserList: FC<UserListProps> = props => {
  const { dispatch, loading, user } = props
  const [cityOptions, setCityOptions] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>(null)
  const [form] = Form.useForm()
  const [userCount, setUserCount] = useState<number>(0)
  const [newCountToday, setNewCountToday] = useState<number>(0)
  const [dayActiveNum, setDayActiveNum] = useState<number>(0)
  const [dayOpenNum, setDayOpenNum] = useState<number>(0)
  const [monthActiveNum, setMonthActiveNum] = useState<number>(0)
  const [userCity, setUserCity] = useState<any>([])
  const [versions, setVersions] = useState<any>([])

  // const { setCity, cityOptions } = useLocation()

  const date = new Date()

  useEffect(() => {
    let monthActiveParams =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    //注册用户数
    getAppUserCount().then(res => {
      setUserCount(res.data)
    })
    //启动次数（今日）
    let data = {
      appName: 'xinzhijia',
    }
    getAPPOpenCountOnceDay(data).then(res => {
      setDayOpenNum(res.data)
    })
    //新增用户数(今日)
    getUserRegisterCountToday().then(res => {
      setNewCountToday(res.data)
    })
    //日活用户数上周7日平均
    getDayActiveNum().then(res => {
      setDayActiveNum(res)
    })
    //月活
    getAppMonthActiveUserCount(monthActiveParams).then(res => {
      setMonthActiveNum(res.data)
    })
    //用户城市分布
    getUserCityDistribution().then(res => {
      let data: any = []
      for (let key in res.data) {
        data = data.concat(res.data[key])
      }
      const cities = combinCities(
        data.map((item: any) => ({
          x: item.city === 'unknown' ? '未知' : getCityNameByCode(String(item.city).substr(0, 4)),
          y: item.userCount,
        }))
      )
      setUserCity(cities)
    })
    //版本分布
    getUserAppVersionDistribution().then(res => {
      console.log(res, 'resresresres')
      // let data: any = []
      // for (let key in res.data) {
      //   data = data.concat(res.data[key])
      // }
      // const versions = data.map((item: any) => ({
      //   x:
      //     item.version === 'unknown'
      //       ? '未知'
      //       : item.appName
      //       ? item.appName + item.appVersion
      //       : item.appVersion,
      //   y: item.userCount,
      // }))
      setVersions(res.data)
    })
  }, [])

  useEffect(() => {
    dispatch({
      type: 'user/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 10,
      },
    })
    getAllCity().then((res: any) => {
      setCityOptions(res)
    })
  }, [])

  const handleSearch = (values: any) => {
    let cityArr: any[] = []
    if (values.city) {
      cityArr.push(values.city.toString())
    }
    const data = {
      mobile: values.mobile ? values.mobile : null,
      cityArr: values.city ? cityArr : null,
      startTime: values.Time ? moment(values.Time[0]).format('YYYY-MM-DD') : null,
      endTime: values.Time ? moment(values.Time[1]).format('YYYY-MM-DD') : null,
    }
    setformdatas({
      ...data,
    })
    dispatch({
      type: 'user/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 10,
        ...data,
      },
    })
  }

  const handelReset = () => {
    setformdatas(null)
    form.resetFields()
    dispatch({
      type: 'user/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 10,
      },
    })
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <Row className={styles.header}>
          <Col span={6}>
            <FormItem label="手机号" name="mobile">
              <Input />
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="城市" name="city">
              <Select allowClear showSearch optionFilterProp="label">
                {cityOptions &&
                  cityOptions.map((item: any) => (
                    <Option key={item.id} value={item.cityid} label={item.city}>
                      {item.city}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={8} style={{ paddingLeft: 10 }}>
            <FormItem label="注册时间" name="Time">
              <RangePicker allowClear />
            </FormItem>
          </Col>
          <Col span={4} style={{ textAlign: 'center' }}>
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
    let cityArr: any[] = []
    if (formdatas && formdatas.cityArr && formdatas.cityArr.length > 0) {
      cityArr = formdatas.cityArr
    }
    const data = {
      mobile: formdatas && formdatas.mobile ? formdatas.mobile : '',
      building: formdatas && formdatas.building ? formdatas.building : '',
      openRole: formdatas && formdatas.openRole ? formdatas.openRole : '',
      cityArr: formdatas && formdatas.cityArr && formdatas.cityArr.length > 0 ? cityArr : '',
      startTime: formdatas && formdatas.startTime ? formdatas.startTime : null,
      endTime: formdatas && formdatas.endTime ? formdatas.endTime : null,
      pageIndex: query.current,
      pageCount: query.pageSize,
    }
    dispatch({
      type: 'user/fetch',
      payload: data,
    })
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'realName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '房间数',
      dataIndex: 'houseNum',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '注册时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },

    {
      title: '操作',
      render: (text: any, record: any) =>
        record.types == 'cwjk' ? (
          ''
        ) : (
          <>
            <a href={`/operate-management/user/list/${record.mobile}`} target="_blank">
              查看详情
            </a>
          </>
        ),
    },
  ]

  return (
    <>
      <GridContent>
        <IntroduceRowCard
          loading={loading}
          data={[
            {
              title: '真实用户数',
              value: userCount,
            },
            {
              title: '新增用户数(今日)',
              value: newCountToday,
            },
            {
              title: '日活用户数（上周7日平均）',
              value: dayActiveNum,
            },
            {
              title: '月活用户数（上个月）',
              value: monthActiveNum,
            },
            {
              title: '启动次数（今日）',
              value: dayOpenNum,
            },
          ]}
        />
        <label>注：仅统计有房间的用户数据，不包含仅注册的用户</label>
        <Card bordered={false}>
          <h3>版本分布({versions[0] && versions[0].appName ? versions[0].appName : ''})</h3>
          <BarChart
            data={versions}
            className={styles.chartContent}
            dataName={'appVersion'}
            dataValues={'userCount'}
          />
        </Card>
      </GridContent>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        loading={loading}
        // showPagination={true}
        data={user.userList}
        columns={columns}
        rowKey={(record: any, index: number) => index}
        onChange={handleTableChange}
      />
    </>
  )
}
export default connect(({ user, loading }: ConnectState) => ({
  user,
  loading: loading.models.user,
}))(UserList)
