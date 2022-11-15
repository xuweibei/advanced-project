import React, { PureComponent } from 'react'
import { Card, Row, Col, DatePicker, Skeleton } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import GridContent from '@/components/PageHeaderWrapper/GridContent'
import IntroduceRowCard from '@/components/Cards/IntroduceRowCard'
import Line from '@/components/Charts/Line'
import PieCard from '@/components/Cards/PieCard'
import styles from './index.less'
import { disabledDate } from '@/utils/utils'
import monitornum from '@/assets/img/moniter_data.png'

const { MonthPicker } = DatePicker
const LINE_COLORS = ['#1890ff']
@connect(({ cameraData, loading }) => ({
  cameraData,
  loading: loading.models.cameraData,
  loadingHistory:
    loading.effects['cameraData/getCameraOpenCountByMonth'] ||
    loading.effects['cameraData/getInternetTrafficMonth'],
}))
class MonitorData extends PureComponent {
  state = {
    historyOpenMonth: moment(),
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { historyOpenMonth } = this.state
    dispatch({
      type: 'cameraData/getCameraStatisticsInfo',
    })
    dispatch({
      type: 'cameraData/getCameraOpenStatsByDate',
    })
    dispatch({
      type: 'cameraData/getInternetTraffic',
    })
    this.getOpenHistoryData(historyOpenMonth)
    this.getFlowHistoryData()
  }

  /**
   * 获取监控打开次数历史数据。按月查天
   */
  getOpenHistoryData(historyOpenMonth) {
    historyOpenMonth = historyOpenMonth.clone()
    const date = historyOpenMonth.startOf('month').format('YYYY-MM')

    const { dispatch } = this.props
    dispatch({
      type: 'cameraData/getCameraOpenCountByMonth',
      payload: {
        date,
      },
    })
  }

  /**
   * 获取流量历史数据。按月查天
   */
  getFlowHistoryData() {
    const endTime = new Date(new Date().setHours(0, 0, 0, 0))
    const startTime = endTime - 86400 * 7 * 1000
    const startDate = this.dateFormatDay(startTime)
    const endDate = this.dateFormatDay(endTime)

    const { dispatch } = this.props
    dispatch({
      type: 'cameraData/getInternetTrafficMonth',
      payload: {
        startDate,
        endDate,
      },
    })
  }

  dateFormatDay = timestamp => {
    const date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    return Y + M + D
  }

  onOpenMonthChange = historyOpenMonth => {
    this.getOpenHistoryData(historyOpenMonth)
    this.setState({
      historyOpenMonth,
    })
  }

  renderOpenLineChart() {
    const { cameraData, loadingHistory } = this.props
    if (loadingHistory) {
      return <Skeleton />
    }
    const { launchOpenTimes } = cameraData
    if (launchOpenTimes.length == 0) {
      return (
        <div className={styles.nodata}>
          <img className={styles.nodataimg} src={monitornum} />
          <p className={styles.nodatap}>暂无数据</p>
        </div>
      )
    }
    const data = [].concat(
      launchOpenTimes.map(item => ({
        x: '' + moment(item.dat).date(),
        y: item.coun,
        name: '监控打开次数',
        color: 1,
      }))
    )
    const scale = {
      x: { alias: '日期', min: 1, tickInterval: 1, max: 31, type: 'linear' },
      y: { min: 0, type: 'pow' },
    }
    return <Line data={data} scale={scale} color={['color', color => LINE_COLORS[color]]} />
  }

  renderFlowLineChart() {
    const { cameraData, loadingHistory } = this.props
    if (loadingHistory) {
      return <Skeleton />
    }
    const { registerFlow } = cameraData
    if (registerFlow.length == 0) {
      return <div className={styles.nodata}>暂无数据</div>
    }
    const data = [].concat(
      registerFlow.map(item => ({
        x: '' + moment(item.flowDate).date(),
        y: Math.round(item.flowCount / 1024 / 1024),
        name: '流量数据',
        color: 0,
      }))
    )
    const scale = {
      x: { alias: '日期', min: 1, tickInterval: 1, max: 31, type: 'linear' },
      y: { min: 0, type: 'pow' },
    }
    return <Line data={data} scale={scale} color={['color', color => LINE_COLORS[color]]} />
  }

  render() {
    const { cameraData, loading } = this.props
    const { statisticsInfo, openTimes, flow } = cameraData
    const { historyOpenMonth } = this.state
    const {
      cameraStatByCityDtos = [],
      cameraStatByProjectDtos = [],
      cameraStatByCameraModelDtos = [],
    } = statisticsInfo
    // const cityNum = cameraStatByCityDtos.
    const cityDistribution = cameraStatByCityDtos
      .filter(item => !!item.totalCameraNum)
      .map(item => ({
        x: item.cityName,
        y: item.totalCameraNum,
      }))
    const projectDistribution = cameraStatByProjectDtos.map(item => ({
      x: item.projectName,
      y: item.totalCameraNum == null ? 0 : item.totalCameraNum,
    }))
    const modelDistribution = cameraStatByCameraModelDtos.map(item => ({
      x: item.model,
      y: item.totalCameraNum == null ? 0 : item.totalCameraNum,
    }))
    return (
      <GridContent>
        <IntroduceRowCard
          loading={loading}
          data={[
            // {
            //   title: '在线监控',
            //   value: 3039
            // },
            // {
            //   title: '离线监控',
            //   value: 200
            // },
            {
              title: '今日监控打开次数',
              value: openTimes,
            },
            {
              title: '已激活监控数',
              value: statisticsInfo.activeCameraNums,
            },
          ]}
        />
        <Row gutter={24}>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="城市监控分布"
              subTitle="累计城市"
              total={cityDistribution.length}
              data={cityDistribution}
            />
          </Col>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="项目监控分布"
              subTitle="累计项目"
              total={projectDistribution.length}
              data={projectDistribution}
              flag
            />
          </Col>
        </Row>
        <Card bordered={false} style={{ marginBottom: 25, borderRadius: 20 }}>
          <div className={styles.lineChartHeader}>
            <h4 className={styles.lineCharth}>监控打开历史数据</h4>
            <MonthPicker
              placeholder="请选择月份"
              value={historyOpenMonth}
              format="YYYY年MM月"
              disabledDate={disabledDate}
              onChange={this.onOpenMonthChange}
            />
          </div>
          {this.renderOpenLineChart()}
        </Card>
      </GridContent>
    )
  }
}

export default MonitorData
