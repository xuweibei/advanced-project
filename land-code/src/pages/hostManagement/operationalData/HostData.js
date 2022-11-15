import React, { PureComponent } from 'react'
import { Row, Col, DatePicker, Card, Skeleton } from 'antd'
import { connect } from 'dva'
import moment from 'moment'

import GridContent from '@/components/PageHeaderWrapper/GridContent'
import HostmainCard from '@/components/Cards/HostmainCard'
import PieCard from '@/components/Cards/PieCard'
import Line from '@/components/Charts/Line'
import unlivehost from '@/assets/images/host_unlived.png'
import onlinehost from '@/assets/images/host_online.png'
import outlinehost from '@/assets/images/host_outline.png'
import livehost from '@/assets/images/host_lived.png'
import bindhost from '@/assets/images/host_binded.png'
import { disabledDate } from '@/utils/utils'
import styles from './index.less'

const { MonthPicker } = DatePicker

@connect(({ hostData, loading }) => ({
  hostData,
  loading:
    loading.effects['hostData/getHostCountInfo'] ||
    loading.effects['hostData/getHostActiveInfo'] ||
    loading.effects['hostData/getHostSoftwareInfo'] ||
    loading.effects['hostData/getHostProjectDistribution'] ||
    loading.effects['hostData/getHostCityDistribution'] ||
    loading.effects['hostData/getDavinciHostCount'] ||
    loading.effects['hostData/getStatusCount'] ||
    loading.effects['hostData/getHardwardCount'],
  loadingHistory: loading.effects['hostData/getHostHistory'],
}))
class HostData extends PureComponent {
  state = {
    historyMonth: moment(),
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { historyMonth } = this.state
    dispatch({
      type: 'hostData/getHostCountInfo',
    })
    dispatch({
      type: 'hostData/getHostActiveInfo',
    })
    dispatch({
      type: 'hostData/getHostSoftwareInfo',
    })
    dispatch({
      type: 'hostData/getHostProjectDistribution',
    })
    dispatch({
      type: 'hostData/getHostCityDistribution',
    })
    dispatch({
      type: 'hostData/getDavinciHostCount',
    })
    dispatch({
      type: 'hostData/getStatusCount',
    })
    dispatch({
      type: 'hostData/getHardwardCount',
    })
    this.getHistoryData(historyMonth)
  }

  /**
   * 获取主机维修、报废历史数据
   */
  getHistoryData(historyMonth) {
    historyMonth = historyMonth.clone()
    const startTime = historyMonth.startOf('month').format('YYYY-MM-DD')
    const endTime = historyMonth.endOf('month').format('YYYY-MM-DD')

    const { dispatch } = this.props
    dispatch({
      type: 'hostData/getHostHistory',
      payload: {
        startTime,
        endTime,
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
    const { hostData, loadingHistory } = this.props
    if (loadingHistory) {
      return <Skeleton />
    }
    const { hostHistory } = hostData
    if (hostHistory.length == 0) {
      return <div style={{ height: 250 }}>暂无数据</div>
    }
    const data = []
    hostHistory.forEach(item => {
      const x = moment(item.createdTime).date()
      data.push({
        x,
        y: item.repairNum,
        name: '维修中',
      })
      data.push({
        x,
        y: item.scrapNum,
        name: '报废',
      })
    })

    const scale = {
      x: { alias: '日期', min: 1, tickInterval: 1, max: 31, type: 'linear' },
      y: { min: 0, type: 'pow' },
    }
    return <Line data={data} scale={scale} />
  }

  render() {
    const { hostData, loading } = this.props
    const { historyMonth } = this.state
    const {
      hostCountInfo = {},
      hostActiveInfo,
      softwareInfo,
      hostProjects,
      hostCities,
      davinciHostCount,
      hardwardCount = {},
      statusCount = [
        { status: '出厂', num: 0 },
        { status: '激活', num: 0 },
        { status: '绑定', num: 0 },
        { status: '返修', num: 0 },
        { status: '报废', num: 0 },
      ],
    } = hostData

    // 主机所在项目分布情况
    const projectDistribution = hostProjects.map(item => ({
      x: item.projectName,
      y: item.hostCount,
    }))
    // 主机所在城市分布情况
    const cityDistribution = hostCities.map(item => ({ x: item.cityName, y: item.cityCount }))
    // 主机硬件型号分布情况
    const davinciHostType = davinciHostCount.map(item => ({ x: item.hardward, y: item.num }))
    // 主机软件版本分布情况
    const softwareInfoDistribution = softwareInfo.map(item => ({
      x:
        item.hostVersion === 'unknown' || item.hostVersion === '20171103'
          ? '未知'
          : item.hostVersion,
      y: item.count,
    }))
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={24} style={{ position: 'relative' }}>
            <Card
              bordered={false}
              style={{ marginBottom: 24, borderRadius: 20 }}
              loading={loading}
              //title="主机数量"
              value={hostCountInfo.total}
              //img={lineChartBlue}
              counts={davinciHostCount}
            >
              <div className={styles.hostNum}>
                <h4 className={styles.hostitle}>主机数量</h4>
                <p className={styles.hosp}>
                  <span style={{ fontSize: 30, color: '#333333' }}>{hostCountInfo.total} </span>(
                  {davinciHostCount.map(count => (
                    <span style={{ fontSize: 20, color: '#999999' }}>
                      {count.hardward.toUpperCase()}:{count.num}
                      {'  '}
                    </span>
                  ))}
                  )
                </p>
              </div>

              <div className={styles.hostmain}>
                <div className={styles.hostsub}>
                  <HostmainCard
                    loading={loading}
                    title="在线主机"
                    color="#1790FF"
                    value={hardwardCount.onLine}
                    img={onlinehost}
                  />
                </div>
                <div className={styles.hostsub}>
                  <HostmainCard
                    title="离线主机"
                    color="#FFC641"
                    loading={loading}
                    value={hardwardCount.lossLine}
                    img={outlinehost}
                  />
                </div>

                {/* <div className={styles.hostsub}>
                  <HostmainCard
                    loading={loading}
                    title="未激活"
                    color="#FF5400"
                    value={hostCountInfo.total - statusCount[1].num - statusCount[2].num}
                    img={unlivehost}
                  />
                </div> */}
                <div className={styles.hostsub}>
                  <HostmainCard
                    loading={loading}
                    title="已激活"
                    color="#2EC4B6"
                    value={statusCount[1].num}
                    img={livehost}
                  />
                </div>
                <div className={styles.hostsub}>
                  <HostmainCard
                    loading={loading}
                    title="已绑定使用"
                    color="#7B2CBF"
                    value={statusCount[2].num}
                    img={bindhost}
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="主机城市分布"
              subTitle="累计城市"
              total={cityDistribution.length}
              data={cityDistribution}
            />
          </Col>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="主机项目分布"
              subTitle="累计项目"
              total={hostProjects.length}
              data={projectDistribution}
              flag
            />
          </Col>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="主机硬件型号分布"
              subTitle="累计版本"
              total={davinciHostCount.length}
              data={davinciHostType}
            />
          </Col>
          <Col lg={12}>
            <PieCard
              loading={loading}
              title="主机软件版本号分布"
              subTitle="累计版本"
              total={softwareInfoDistribution.length}
              data={softwareInfoDistribution}
              flag
            />
          </Col>
        </Row>
        <Card bordered={false} style={{ borderRadius: 20 }}>
          <div className={styles.lineChartHeader}>
            <h4 style={{ fontSize: 18, color: '#333333' }}>主机历史数据</h4>
            <MonthPicker
              placeholder="请选择月份"
              value={historyMonth}
              format="YYYY年MM月"
              disabledDate={disabledDate}
              onChange={this.onMonthChange}
            />
          </div>
          {this.renderLineChart()}
        </Card>
      </GridContent>
    )
  }
}

export default HostData
