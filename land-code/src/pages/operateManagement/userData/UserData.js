import React, { PureComponent } from 'react'
import { Card, Row, Col, DatePicker, Skeleton } from 'antd'
import { connect } from 'dva'
import moment from 'moment'

import GridContent from '@/components/PageHeaderWrapper/GridContent'
import StatisticCard from '@/components/Cards/StatisticCard'
import IntroduceRowCard from '@/components/Cards/IntroduceRowCard'
import PieCard from '@/components/Cards/PieCard'
import Line from '@/components/Charts/Line'
import lineChartBlue from '@/assets/images/line_chart_blue2.png'
import rectChartGreen from '@/assets/images/rect_chart_green2.png'
import rectChartYellow from '@/assets/images/rect_chart_yellow2.png'
import styles from './index.less'
import { getCityNameByCode } from '../../../common/cityOptions'

const { MonthPicker } = DatePicker

const LINE_COLORS = ['#1F7FF7', '#74D640', '#FFB700']

function combinCities(cities) {
  if (!cities || !cities.length) {
    return cities
  }
  const map = {}

  cities.forEach(item => {
    map[item.x] = (map[item.x] || 0) + item.y
  })
  return Object.entries(map).map(([x, y]) => ({ x, y }))
}

@connect(({ userData, loading }) => ({
  userData,
  loading:
    loading.effects['userData/getAppUserCount'] ||
    loading.effects['userData/getUserRegisterCountIn7days'] ||
    loading.effects['userData/getUserCityDistribution'] ||
    loading.effects['userData/getUserAppVersionDistribution'] ||
    loading.effects['userData/getBindHostByTime'],
  loadingHistory:
    loading.effects['userData/getUserRegisterDistribution'] ||
    loading.effects['userData/getAppLaunchTimeDistribution'] ||
    loading.effects['userData/getActiveUserDistribution'],
}))
class UserData extends PureComponent {
  state = {
    historyMonth: moment(),
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { historyMonth } = this.state
    const date = new Date()
    dispatch({ type: 'userData/getAppUserCount' })
    dispatch({ type: 'userData/getUserRegisterCountToday' })
    dispatch({ type: 'userData/getUserRegisterCountIn7days' })
    dispatch({ type: 'userData/getAppTodayLaunchTimes' })
    dispatch({ type: 'userData/getAppTodayActiveUserCount' })
    dispatch({
      type: 'userData/getAppMonthActiveUserCount',
      payload:
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
    })
    dispatch({ type: 'userData/getUserCityDistribution' })
    dispatch({ type: 'userData/getUserAppVersionDistribution' })
    dispatch({
      type: 'userData/getBindHostByTime',
      payload: {
        pageIndex: 1,
        pageCount: 10,
        startTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
      },
    })
    this.getHistoryData(historyMonth)
  }

  /**
   * 获取新增用户、启动次数、活跃用户的历史数据。按月查天
   */
  getHistoryData(historyMonth) {
    historyMonth = historyMonth.clone()
    const startDate = historyMonth.startOf('month').format('YYYY-MM-DD')
    const endDate = historyMonth.endOf('month').format('YYYY-MM-DD')

    const { dispatch } = this.props
    dispatch({
      type: 'userData/getUserRegisterDistribution',
      payload: {
        startDate,
        endDate,
      },
    })
    dispatch({
      type: 'userData/getAppLaunchTimeDistribution',
      payload: {
        startDate,
        endDate,
      },
    })
    dispatch({
      type: 'userData/getActiveUserDistribution',
      payload: {
        startDate,
        endDate,
      },
    })
  }

  onMonthChange = historyMonth => {
    this.getHistoryData(historyMonth)
    this.setState({
      historyMonth,
    })
  }

  renderLineChart() {
    const { userData, loadingHistory } = this.props
    if (loadingHistory) {
      return <Skeleton />
    }
    const { registerHis, launchTimeHis, activeUserHis } = userData
    const data = [].concat(
      registerHis.map(item => ({
        x: '' + moment(item.date).date(),
        y: item.userCreateCount,
        name: '新增用户',
        color: 0,
      })),
      launchTimeHis.map(item => ({
        x: '' + moment(item.date).date(),
        y: item.launchTime,
        name: '启动次数',
        color: 1,
      })),
      activeUserHis.map(item => ({
        x: '' + moment(item.date).date(),
        y: item.activeUserCount,
        name: '活跃用户',
        color: 2,
      }))
    )
    const scale = {
      x: { alias: '日期', min: 1, tickInterval: 1, max: 31, type: 'linear' },
      y: { min: 0, type: 'pow' },
    }
    return <Line data={data} scale={scale} color={['color', color => LINE_COLORS[color]]} />
  }

  render() {
    const { userData, loading } = this.props
    const { historyMonth } = this.state

    const cities = combinCities(
      userData.cities.map(item => ({
        x: item.city === 'unknown' ? '未知' : getCityNameByCode(String(item.city).substr(0, 4)),
        y: item.userCount,
      }))
    )
    const versions = userData.appVersions.map(item => ({
      x:
        item.version === 'unknown'
          ? '未知'
          : item.appName
          ? item.appName + item.appVersion
          : item.appVersion,
      y: item.userCount,
    }))

    return (
      <GridContent>
        <IntroduceRowCard
          loading={loading}
          data={[
            {
              title: '注册用户数',
              value: userData.userCount,
            },
            {
              title: '新增用户数(今日)',
              value: userData.newCountToday,
              //link: '/app/dashboard/new-user',
            },
            {
              title: '今日绑定主机用户',
              value: userData.bindHostCount,
              //link: '/app/dashboard/new-bind',
            },
            // {
            //   title: 'App新增用户（7日）',
            //   value: userData.newCount7day
            // }
          ]}
        />
        <Row gutter={24}>
          <Col lg={8}>
            <StatisticCard
              loading={loading}
              title="APP今日启动次数"
              value={userData.launchTimes}
              img={lineChartBlue}
            />
          </Col>
          <Col lg={8}>
            <StatisticCard
              loading={loading}
              title="App日活跃用户数"
              value={userData.activeCountToday}
              icon //add by wzl
              text="当日用户打开APP并登录记录为一个活跃用户。"
              img={rectChartGreen}
            />
          </Col>
          <Col lg={8}>
            <StatisticCard
              loading={loading}
              title="App月活跃用户数"
              value={userData.activeCountMonth}
              icon //add by wzl
              text="当月用户打开APP并登录记录为一个活跃用户。"
              img={rectChartYellow}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="用户城市分布"
              subTitle="累计城市"
              total={cities.length}
              data={cities}
              flag
            />
          </Col>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="App版本分布"
              subTitle="累计版本"
              total={versions.length}
              data={versions}
              flag
            />
          </Col>
        </Row>
        <Card bordered={false} style={{ borderRadius: 20 }}>
          <div className={styles.lineChartHeader}>
            <h4 className={styles.lineCharth}>用户历史数据</h4>
            <MonthPicker
              disabledDate={currentDate => currentDate.isAfter(moment(), 'month')}
              placeholder="请选择月份"
              value={historyMonth}
              format="YYYY年MM月"
              onChange={this.onMonthChange}
            />
          </div>
          {this.renderLineChart()}
        </Card>
      </GridContent>
    )
  }
}

export default UserData
