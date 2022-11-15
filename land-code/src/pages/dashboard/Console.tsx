import React, { FC, useEffect, useState } from 'react'
import { connect, ConnectProps, ConsoleModelState, Dispatch, Link, useModel } from 'umi'
import styles from './console.less'
import moment from 'moment'
import LineChart from '@/components/eCharts/LineChart'
import ChartMap from '@/components/eCharts/MapChart'
import SmartChart from '@/components/eCharts/SmartChart'
import { ConnectState } from './models/connect'
import { event } from '@/.umi/plugin-locale/locale'

interface ConsoleProps extends ConnectProps {
  dispatch: Dispatch
  consoleDatas: ConsoleModelState
  loading: boolean
}

const Console: FC<ConsoleProps> = props => {
  const { dispatch, consoleDatas } = props
  const [userSelectValue, setUserSelectValue] = useState(5)
  const [activeUserCount, setActiveUserCount] = useState<any>([])
  const {
    todayActiveUserCount,
    // activeUserCount,
    todayNewlyAddedUserCount,
    robotsCount,
    houseWatchingCount,
    willCustomersCount,
    intelligentDeveloperCount,
    intelligentProjectCount,
    userCount,
    cameraCount,
    cameraOpenCount,
    hostCount,
    statusCount,
    activeUserHisMonth,
    projectCityCount,
    todayRepairStatistics,
  } = consoleDatas
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  useEffect(() => {
    adaptation()
    dispatch({ type: 'consoleDatas/queryTodayActiveUserCount' }) //获取今日活跃人数
    dispatch({ type: 'consoleDatas/queryTodayNewlyAddedUserCount' }) //获取今日新增人数
    dispatch({ type: 'consoleDatas/getRobotsList' }) //获取今日新增人数
    dispatch({ type: 'consoleDatas/getTotalKanFangNum' }) //获取今日看房人数
    dispatch({ type: 'consoleDatas/getWillingCustomers' }) //获取今日意向人数
    dispatch({ type: 'consoleDatas/getIntelligentDeveloperCount' }) //获取智能化社区
    dispatch({ type: 'consoleDatas/getIntelligentProjectCount' }) //获取智能化项目
    dispatch({ type: 'consoleDatas/getCameraStats' }) //获取摄像头数量
    dispatch({ type: 'consoleDatas/getCameraOpenStatsByDate' }) //获取摄像头打开次数
    dispatch({ type: 'consoleDatas/getHostCountInfo' }) //获取主机总数
    dispatch({ type: 'consoleDatas/getStatusCount' }) //获取各个状态主机数
    dispatch({ type: 'consoleDatas/getAppUserCount' }) //获取累计用户数
    dispatch({ type: 'consoleDatas/getProjectCityCount' }) //获取城市项目数
    dispatch({ type: 'consoleDatas/queryTodayRepairStatistics' }) //报修数据统计
    getHistoryMonthData(6)
  }, [])

  useEffect(() => {
    const dateObj: any = {}
    for (let i = Number(userSelectValue); i >= 0; --i) {
      const itemData = moment(new Date())
        .subtract(i, 'months')
        .format('YY-MM')
      dateObj[itemData] = 0
    }
    const userActiveData = []
    for (let key in dateObj) {
      activeUserHisMonth.map((item: any) => {
        if (item.date == key) {
          dateObj[key] = item.activeUserCount
        }
      })
    }
    for (let key in dateObj) {
      userActiveData.push({
        date: key,
        activeUserCount: dateObj[key],
      })
    }
    setActiveUserCount(userActiveData)
  }, [activeUserHisMonth])

  window.onresize = function() {
    adaptation()
  }
  // 获取第一个有权限的管理页面路由
  const premission =
    currentUser &&
    currentUser.permissions.find(
      permission => permission.isLeafNode && permission.path !== '/dashboard/console'
    )
  // rem适配
  const adaptation = () => {
    const docEl = document.documentElement
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = clientWidth / 10 + 'px'
  }

  const getHistoryMonthData = (mouth: number) => {
    let data = new Date()
    data.setMonth(data.getMonth(), 1) //获取到当前月份,设置月份
    let endMonth: any = data.getMonth() + 1
    endMonth = endMonth < 10 ? '0' + endMonth : endMonth
    const endDate = data.getFullYear() + '-' + endMonth + '-' + '31'
    data.setMonth(data.getMonth() - mouth, 1) //获取到当前月份,设置月份
    let startMonth: any = data.getMonth() + 1
    startMonth = startMonth < 10 ? '0' + startMonth : startMonth
    const startDate = data.getFullYear() + '-' + startMonth + '-' + '01'
    dispatch({
      type: 'consoleDatas/queryActiveUserCount',
      payload: {
        startDate,
        endDate,
      },
    })
  }
  const warningData = [
    { date: '第1周', activeUserCount: 20 },
    { date: '第2周', activeUserCount: 25 },
    { date: '第3周', activeUserCount: 40 },
    { date: '第4周', activeUserCount: 20 },
    { date: '第5周', activeUserCount: 90 },
    { date: '第6周', activeUserCount: 68 },
    { date: '第7周', activeUserCount: 76 },
    { date: '第8周', activeUserCount: 88 },
  ]
  const wequipmentData = [
    { date: '监控设备总数', activeUserCount: cameraCount },
    { date: '今日启动次数', activeUserCount: cameraOpenCount },
  ]
  const userActiveColor = {
    line0: '#36EAD0',
    line1: '#908538',
    area0: '#FFDD33',
    area1: '#30ECD5',
  }
  const propertyRepairColor = {
    line0: '#FA8719',
    line1: '#EAF21A',
    area0: '#ECCAA9',
    area1: '#F68519',
  }

  const smartCommunity = () => {
    return (
      <div className={styles.communityCon}>
        <div className={styles.communityItem}>
          <div>
            <img src={require('../../assets/images/home_day.png')} />
            <div>
              <h5>{todayActiveUserCount}</h5>
              <p>今日活跃用户数</p>
            </div>
          </div>
          <div>
            <img src={require('../../assets/images/home_site.png')} />
            <div>
              <h5>{todayNewlyAddedUserCount}</h5>
              <p>今日新增用户数</p>
            </div>
          </div>
        </div>
        <div className={styles.communityItem}>
          <div>
            <img src={require('../../assets/images/home_install.png')} />
            <div>
              <h5>{todayRepairStatistics}</h5>
              <p>今日报修次数</p>
            </div>
          </div>
          <div>
            <img src={require('../../assets/images/home_measure.png')} />
            <div>
              <h5>0</h5>
              <p>维保完成次数</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const marketingOperations = () => {
    const marketingItem = (
      name: string,
      r: number,
      g: number,
      b: number,
      num: number,
      width: string
    ) => {
      return (
        <div>
          <p>{name}</p>
          <div>
            <span
              className={styles.progressBar}
              style={{
                width: width,
                minWidth: '5%',
                background: `linear-gradient(to right, rgba(${r},${g},${b},0) , rgba(${r},${g},${b},1))`,
              }}
            ></span>
            <span className={styles.num}>{num}</span>
          </div>
        </div>
      )
    }
    let count = [robotsCount, houseWatchingCount, willCustomersCount]
    count.sort((a, b) => b - a)
    const maxNum = count[0]

    const percentWidth = (num: number, maxNum: number) => {
      return parseInt((num / maxNum) * 0.8 * 100) + '%'
    }
    return (
      <div className={styles.marketingOperations}>
        {marketingItem(
          '机器人设备总数',
          24,
          219,
          253,
          robotsCount,
          percentWidth(robotsCount, maxNum)
        )}
        {marketingItem(
          '今日看房次数',
          246,
          253,
          24,
          houseWatchingCount,
          percentWidth(houseWatchingCount, maxNum)
        )}
        {marketingItem(
          '今日意向客户人数',
          253,
          137,
          24,
          willCustomersCount,
          percentWidth(willCustomersCount, maxNum)
        )}
      </div>
    )
  }

  const centerData = () => {
    return (
      <div className={styles.centerData}>
        <div>
          <h3>{intelligentDeveloperCount}</h3>
          <p>智能化社区</p>
        </div>
        <img src={require('../../assets/images/C_border.png')} />
        <div>
          <h3>{intelligentProjectCount}</h3>
          <p>智能化项目</p>
        </div>
        <img src={require('../../assets/images/C_border.png')} />
        <div>
          <h3>{userCount}</h3>
          <p>累计用户</p>
        </div>
      </div>
    )
  }

  const smartHome = () => {
    const smartHomeItem = (
      title: string,
      startColor: string,
      endColor: string,
      data: number,
      dataArr: number
    ) => {
      return (
        <div>
          <div>
            <SmartChart startColor={startColor} endColor={endColor} dataArr={dataArr}></SmartChart>
            <p>{data}</p>
          </div>
          <p>{title}</p>
        </div>
      )
    }

    let count = [hostCount, statusCount[1].num, statusCount[2].num]
    count.sort((a, b) => b - a)
    const maxNum = count[0]

    const percentWidth = (num: number, maxNum: number) => {
      return parseInt((num / maxNum) * 0.8 * 100)
    }

    return (
      <div className={styles.smartHome}>
        {smartHomeItem(
          '智能主机总数',
          '#00CBFF',
          '#0090FF',
          hostCount,
          percentWidth(hostCount, maxNum)
        )}
        {smartHomeItem(
          '已安装设备数',
          '#F85D41',
          '#E58B69',
          statusCount[1].num,
          percentWidth(statusCount[1].num, maxNum)
        )}
        {smartHomeItem(
          '使用中设备数',
          '#BBF556',
          '#439422',
          statusCount[2].num,
          percentWidth(statusCount[2].num, maxNum)
        )}
      </div>
    )
  }

  const handleChange = (event: any) => {
    setUserSelectValue(event.target.value)
    getHistoryMonthData(event.target.value)
  }

  const time = moment()
  const today = new Date().getDay()
  var week = ''
  if (today == 0) {
    week = '星期日'
  } else if (today == 1) {
    week = '星期一'
  } else if (today == 2) {
    week = '星期二'
  } else if (today == 3) {
    week = '星期三'
  } else if (today == 4) {
    week = '星期四'
  } else if (today == 5) {
    week = '星期五'
  } else if (today == 6) {
    week = '星期六'
  }

  return (
    <div className={styles.contentBox}>
      <header className={styles.header}>
        <img className={styles.header_l} src={require('../../assets/images/console_h_l.png')} />
        {/* <h1>地产云互联网管理平台</h1> */}
        <h1>NewHome数字地产云管理系统</h1>
        <img className={styles.header_r} src={require('../../assets/images/console_h_r.png')} />
        <Link className={styles.backstage} to={premission ? premission.path : '/'}>
          后台管理
        </Link>
        <div className={styles.nowTime}>
          <span>{time.format('YYYY年MM月DD日')}</span>
          <span>{week}</span>
        </div>
      </header>
      <main className={styles.content}>
        <div className={styles.colLeft}>
          <div className={styles.miniChart1}>
            <h3>智慧社区运营统计数据</h3>
            <div className={styles.divider}>{smartCommunity()}</div>
          </div>
          <div className={styles.miniChart2}>
            <h3>营销运营数据统计</h3>
            <div className={styles.divider}>{marketingOperations()}</div>
          </div>
          <div className={styles.miniChart3}>
            <h3>用户活跃情况</h3>
            <div className={styles.divider}>
              <select
                value={userSelectValue}
                onChange={handleChange}
                className={styles.selectStyle}
              >
                <option value="2">3个月</option>
                <option value="5">6个月</option>
                <option value="8">9个月</option>
                <option value="11">12个月</option>
              </select>
              <LineChart
                data={activeUserCount}
                type="line"
                color={userActiveColor}
                className={styles.chartContent}
              />
            </div>
          </div>
        </div>
        <div className={styles.colCenter}>
          <div className={styles.centerDivider}>{centerData()}</div>
          <ChartMap className={styles.map} data={projectCityCount}></ChartMap>
        </div>
        <div className={styles.colRight}>
          <div className={styles.miniChart1}>
            <h3>智慧家居运营统计数据</h3>
            <div className={styles.divider}>{smartHome()}</div>
          </div>
          <div className={styles.miniChart2}>
            <h3>智能车位监控运营数据统计</h3>
            <div className={styles.divider}>
              <LineChart
                data={wequipmentData}
                type="bar"
                color={propertyRepairColor}
                className={styles.chartContent}
              />
            </div>
          </div>
          <div className={styles.miniChart3}>
            <h3>物业报修数据统计</h3>
            <div className={styles.divider}>
              <select className={styles.selectStyle}>
                <option value="audi">3个月</option>
                <option value="volvo">6个月</option>
                <option value="saab">9个月</option>
                <option value="opel">12个月</option>
              </select>
              <LineChart
                data={warningData}
                type="line"
                color={propertyRepairColor}
                className={styles.chartContent}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default connect(({ consoleDatas, loading }: ConnectState) => ({
  consoleDatas,
  loading: loading.models.user,
}))(Console)
