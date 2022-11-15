import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Select, Card, Radio, DatePicker } from 'antd'
import {
  getALlBuildingByDeveloperId,
  queryHomeStatistics,
  queryToDoAudit,
  queryRepairStatistics,
  queryDeviceStatistics,
  queryHostTodayStatusNum,
  getCameraCount,
  getUserRegisterDistribution, //今日新增
  getAppMonthActiveUserCount, //月活
  getDayActiveNum, //7日平均
  getAppTodayLaunchTimes, //今日启动次数
  getAppUserCount, //注册用户数
  queryOpenDoorStatistics,
  getHourData,
} from '@/services/api'
import moment from 'moment'
import styles from './workbench.less'

import BarChart from '@/components/eCharts/BarChart'

import HouseNumPieChart from '../../components/eCharts/HouseNumPieChart'

const { Option } = Select
const allCommunities = [
  {
    address: '全部',
    id: 0,
    name: '全部社区',
  },
]

const dateMap = [
  {
    name: '今日',
    value: 'today',
  },
  {
    name: '昨日',
    value: 'yesterday',
  },
]

const Workbench = () => {
  const [allBuildings, setAllBuildings] = useState<any>([])
  const [date, setDate] = useState<any>({
    startTime: moment()
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment()
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss'),
  })
  const [selectDate, setSelectDate] = useState<any>(moment())
  const [hourData, setHourData] = useState<any[]>([])
  const [selectBuilding, setSelectBuilding] = useState<any>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [homeCount, setHomeCount] = useState<number>(0)
  const [userCount, setUserCount] = useState<number>(0)
  const [checkIn, setCheckIn] = useState<number>(0)
  const [unCheckIn, setUnCheckIn] = useState<number>(0)
  const [userTotalCount, setUserTotalCount] = useState<number>(0)
  const [userTodayCount, setUserTodayCount] = useState<number>(0)
  const [repairTotalCount, setRepairTotalCount] = useState<number>(0)
  const [repairTodayCount, setRepairTodayCount] = useState<number>(0)

  const [hostOfflineCount, setHostOfflineCount] = useState<number>(0)
  const [hostOnlineCount, setHostOnlineCount] = useState<number>(0)
  const [hostTotalCount, setHostTotalCount] = useState<number>(0)

  const [cloudOfflineCount, setCloudOfflineCount] = useState<number>(0)
  const [cloudOnlineCount, setCloudOnlineCount] = useState<number>(0)
  const [cloudTotalCount, setCloudTotalCount] = useState<number>(0)

  const [cameraTotalCount, setCameraTotalCount] = useState<number>(0)

  const [registerUser, setRegisterUser] = useState<number>(0) //注册用户数
  const [todayAddUser, setTodayAddUser] = useState<number>(0) //今日新增
  const [todayAppOpen, setTodayAppOpen] = useState<number>(0) //今日启动次数
  const [appWeekOpen, setAppWeekOpen] = useState<number>(0) //7日平均
  const [appMonthOpen, setAppMonthOpen] = useState<number>(0) //月活

  const [openDoorInfo, setOpenDoorInfo] = useState<any>() //开门结构
  const [callingInfo, setCallingInfo] = useState<any>() //呼叫结构

  const initHourData = useCallback(async () => {
    if (selectDate) {
      let params = {
        appName: localStorage.getItem('developerId') == '1' ? 'xingzhijia' : 'newbest',
        dayDate: moment(selectDate).format('YYYY-MM-DD'),
      }
      getHourData(params).then(res => {
        setHourData(res.data)
      })
    }
  }, [selectDate])

  useEffect(() => {
    initHourData()
  }, [initHourData])

  const changeSelBuilding = (value: any) => {
    setSelectBuilding(value)
  }

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day')
  }
  //切换表
  const checkTag = (e: any) => {
    console.log(e.target.value, 'e.target.value')
    let value = e.target.value

    if (value === 'today') {
      const startDate = moment()
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDate = moment()
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      setDate({ startTime: startDate, endTime: endDate })
    } else {
      const startDate = moment()
        .startOf('day')
        .subtract(1, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
      const endDate = moment()
        .endOf('day')
        .subtract(1, 'days')
        .format('YYYY-MM-DD HH:mm:ss')
      setDate({ startTime: startDate, endTime: endDate })
    }
  }
  useEffect(() => {
    let data
    if (selectBuilding != 0) {
      data = {
        ...date,
        buildingId: selectBuilding,
      }
    } else {
      data = {
        ...date,
      }
    }
    queryOpenDoorStatistics(data)
      .then(res => {
        console.log('11111', res)
        setOpenDoorInfo(res.eventInfo)
        setCallingInfo(res.videoCallInfo)
      })
      .catch(e => {
        console.log('error', e)
      })
  }, [selectBuilding, date])

  useEffect(() => {
    getALlBuildingByDeveloperId().then(res => {
      let data = allCommunities.concat(res)
      setAllBuildings(data)
    })
    //注册用户数
    getAppUserCount()
      .then(res => {
        setRegisterUser(res.data)
      })
      .catch(e => {
        console.log('error', e)
      })
    //今日新增
    const startDate = moment().format('YYYY-MM-DD')
    const endDate = moment().format('YYYY-MM-DD')
    getUserRegisterDistribution({ startDate, endDate })
      .then(res => {
        setTodayAddUser(res.data)
      })
      .catch(e => {
        console.log('error', e)
      })
    const monthData = new Date()
    //月活
    getAppMonthActiveUserCount(
      monthData.getFullYear() +
        '-' +
        (monthData.getMonth() + 1 < 10
          ? '0' + (monthData.getMonth() + 1)
          : monthData.getMonth() + 1)
    )
      .then(res => {
        setAppMonthOpen(res.data)
      })
      .catch(e => {
        console.log('error', e)
      })

    //7日平均
    getDayActiveNum()
      .then(res => {
        setAppWeekOpen(res)
      })
      .catch(e => {
        console.log('error', e)
      })

    //今日启动次数
    getAppTodayLaunchTimes()
      .then(res => {
        setTodayAppOpen(res.data)
      })
      .catch(e => {
        console.log('error', e)
      })
    setLoading(false)
  }, [])

  useEffect(() => {
    let data
    if (selectBuilding != 0) {
      data = {
        buildingId: selectBuilding,
      }
    }
    queryHomeStatistics(data)
      .then(res => {
        setHomeCount(res.homeCount)
        setUserCount(res.userCount)
        setCheckIn(res.checkIn)
        setUnCheckIn(res.unCheckIn)
      })
      .catch(e => {
        console.log('error', e)
      })

    queryToDoAudit(data)
      .then(res => {
        setUserTotalCount(res.totalCount)
        setUserTodayCount(res.todayCount)
      })
      .catch(e => {
        console.log('error', e)
      })

    queryRepairStatistics(data)
      .then(res => {
        setRepairTotalCount(res.totalCount)
        setRepairTodayCount(res.todayCount)
      })
      .catch(e => {
        console.log('error', e)
      })

    queryHostTodayStatusNum(data)
      .then(res => {
        setHostOfflineCount(res.offlineCount)
        setHostOnlineCount(res.onlineCount)
        setHostTotalCount(res.totalCount)
      })
      .catch(e => {
        console.log('error', e)
      })

    queryDeviceStatistics(data)
      .then(res => {
        setCloudOfflineCount(res.offlineCount)
        setCloudOnlineCount(res.onlineCount)
        setCloudTotalCount(res.totalCount)
      })
      .catch(e => {
        console.log('error', e)
      })

    getCameraCount(data)
      .then(res => {
        setCameraTotalCount(res)
      })
      .catch(e => {
        console.log('error', e)
      })
  }, [selectBuilding])
  console.log('allBuildings', allBuildings)
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: 10 }}>
        <Col lg={24}>
          <label>选择社区：</label>
          <Select
            style={{ width: '30%' }}
            value={selectBuilding}
            onChange={v => changeSelBuilding(v)}
          >
            {allBuildings.map((item: any, index: any) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around">
        <Col md={12} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.title}>
                <div className={styles.titleIcon} />
                <text className={styles.titleContent}>社区概况</text>
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.itemContainer}>
                  <img
                    className={styles.numIcon}
                    src={require('../../assets/images/buildingsNum.png')}
                  />
                  <div className={styles.numContent}>
                    <text className={styles.numtext}>
                      {allBuildings.length && allBuildings.length - 1}
                    </text>
                    <text className={styles.numTitletext}>社区总数</text>
                  </div>
                </div>
                <div className={styles.division} />
                <div className={styles.itemContainer}>
                  <img
                    className={styles.numIcon}
                    src={require('../../assets/images/housesNum.png')}
                  />
                  <div className={styles.numContent}>
                    <text className={styles.numtext}>{homeCount}</text>
                    <text className={styles.numTitletext}>房屋总数</text>
                  </div>
                </div>
                <div className={styles.division} />
                <div className={styles.itemContainer}>
                  <img
                    className={styles.numIcon}
                    src={require('../../assets/images/humanNum.png')}
                  />
                  <div className={styles.numContent}>
                    <text className={styles.numtext}>{userCount}</text>
                    <text className={styles.numTitletext}>住户总数</text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={6} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.title}>
                <div className={styles.titleIcon}></div>
                <text className={styles.titleContent}>房屋统计</text>
              </div>
              <div className={styles.houseNumContainer}>
                <HouseNumPieChart
                  className={styles.houseNumPieChart}
                  data={[
                    { name: '入住率', value: checkIn * 100 },
                    { name: '空置率', value: unCheckIn * 100 },
                  ]}
                />
                <div className={styles.numContent}>
                  <text className={styles.houseTitletext}>入住率</text>
                  <text className={styles.houseintext}>{(checkIn * 100).toFixed(0)}%</text>
                  <text className={styles.houseTitletext}>空置率</text>
                  <text className={styles.houseouttext}>{(unCheckIn * 100).toFixed(0)}%</text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={6} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.title}>
                <div className={styles.titleIcon}></div>
                <text className={styles.titleContent}>待办事项</text>
              </div>
              <div className={styles.needDoContainer}>
                <div className={styles.needDoItemContainer}>
                  <text className={styles.needDoTitle}>待审核业主</text>
                  <div className={styles.needDoContent}>
                    <text className={styles.needDoCountNum}>{userTotalCount}</text>
                    <text className={styles.needDoitem}>共计</text>
                  </div>
                  <div className={styles.needDoContent}>
                    <text className={styles.needDoTodayNum}>{userTodayCount}</text>
                    <text className={styles.needDoitem}>今日</text>
                  </div>
                </div>
                <div className={styles.needDoItemContainer}>
                  <text className={styles.needDoTitle}>物业报修</text>
                  <div className={styles.needDoContent}>
                    <text className={styles.needDoCountNum}>{repairTotalCount}</text>
                    <text className={styles.needDoitem}>共计</text>
                  </div>
                  <div className={styles.needDoContent}>
                    <text className={styles.needDoTodayNum}>{repairTodayCount}</text>
                    <text className={styles.needDoitem}>今日</text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around">
        <Col md={12} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.title}>
                <div className={styles.titleIcon} />
                <text className={styles.titleContent}>设备统计</text>
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.deviceContainer}>
                  <div className={styles.deviceTitleContainer}>
                    <text className={styles.deviceTitle}>智能主机</text>
                  </div>
                  <text className={styles.deviceTotalNum}>{hostTotalCount}</text>
                  <div className={styles.deviceNumContainer}>
                    <div className={styles.onlineContainer}>
                      <img
                        className={styles.onlineIcon}
                        src={require('../../assets/images/online.png')}
                      />
                      <text className={styles.onlineContent}>在线:{hostOnlineCount}</text>
                    </div>
                    <div className={styles.offlineContainer}>
                      <img
                        className={styles.offlineIcon}
                        src={require('../../assets/images/offline.png')}
                      />
                      <text className={styles.offlineContent}>离线:{hostOfflineCount}</text>
                    </div>
                  </div>
                </div>
                <div className={styles.division} />
                <div className={styles.deviceContainer}>
                  <div className={styles.deviceTitleContainer}>
                    <text className={styles.deviceTitle}>云对讲设备</text>
                  </div>
                  <text className={styles.deviceTotalNum}>{cloudTotalCount}</text>
                  <div className={styles.deviceNumContainer}>
                    <div className={styles.onlineContainer}>
                      <img
                        className={styles.onlineIcon}
                        src={require('../../assets/images/online.png')}
                      />
                      <text className={styles.onlineContent}>在线:{cloudOnlineCount}</text>
                    </div>
                    <div className={styles.offlineContainer}>
                      <img
                        className={styles.offlineIcon}
                        src={require('../../assets/images/offline.png')}
                      />
                      <text className={styles.offlineContent}>离线:{cloudOfflineCount}</text>
                    </div>
                  </div>
                </div>

                <div className={styles.division} />

                <div className={styles.deviceContainer}>
                  <div className={styles.deviceTitleContainer}>
                    <text className={styles.deviceTitle}>云监控设备</text>
                  </div>
                  <text className={styles.deviceTotalNum}>{cameraTotalCount}</text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={12} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.title}>
                <div className={styles.titleIcon} />
                <text className={styles.titleContent}>平台用户数据统计</text>
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.userNumTitleContainer}>
                  <text className={styles.deviceTotalNum}>{registerUser}</text>
                  <text className={styles.registerUserFont}>注册用户数</text>
                </div>
                <div className={styles.division} />
                <div className={styles.registerContainer}>
                  <div className={styles.registerItemContainer}>
                    <div className={styles.registerContentContainer}>
                      <text className={styles.registerYellowNum}>{todayAddUser}</text>
                      <text className={styles.registerUserFont}>今日新增用户</text>
                    </div>
                    <img
                      className={styles.chartIcon}
                      src={require('../../assets/images/yellowChart.png')}
                    />
                  </div>
                  <div className={styles.transverseDivision} />
                  <div className={styles.registerItemContainer}>
                    <div className={styles.registerContentContainer}>
                      <text className={styles.registerYellowNum}>{todayAppOpen}</text>
                      <text className={styles.registerUserFont}>今日APP启动次数</text>
                    </div>
                    <img
                      className={styles.chartIcon}
                      src={require('../../assets/images/yellowChart.png')}
                    />
                  </div>
                </div>

                <div className={styles.division} />

                <div className={styles.registerContainer}>
                  <div className={styles.registerItemContainer}>
                    <div className={styles.registerContentContainer}>
                      <text className={styles.registerGreenNum}>{appWeekOpen}</text>
                      <text className={styles.registerUserFont}>
                        日活
                        <text className={styles.registerUserSecFont}>(上周七日平均)</text>
                      </text>
                    </div>
                    <img
                      className={styles.chartIcon}
                      src={require('../../assets/images/greenChart.png')}
                    />
                  </div>
                  <div className={styles.transverseDivision} />
                  <div className={styles.registerItemContainer}>
                    <div className={styles.registerContentContainer}>
                      <text className={styles.registerGreenNum}>{appMonthOpen}</text>
                      <text className={styles.registerUserFont}>
                        月活
                        <text className={styles.registerUserSecFont}>(上月)</text>
                      </text>
                    </div>
                    <img
                      className={styles.chartIcon}
                      src={require('../../assets/images/greenChart.png')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around">
        <Col md={10} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.openDoorTitle}>
                <div className={styles.openDoorTitleContainer}>
                  <div className={styles.titleIcon} />
                  <text className={styles.titleContent}>开门统计</text>
                </div>
                <Radio.Group
                  onChange={e => checkTag(e)}
                  defaultValue={'today'}
                  buttonStyle="solid"
                  style={{ marginBottom: 5, marginRight: 12 }}
                >
                  {dateMap.map((item: any, index: number) => (
                    <Radio.Button key={index} value={item.value}>
                      {item.name}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <div className={styles.contentContainer}>
                <div className={styles.userNumTitleContainer}>
                  <text className={styles.deviceTotalNum}>
                    {openDoorInfo && openDoorInfo.totalCount}
                  </text>
                  <text className={styles.registerUserFont}>开门次数</text>
                </div>
                <div className={styles.openDoorContainer}>
                  {openDoorInfo &&
                    openDoorInfo.eventEntities.map((item: any, index: any) => {
                      return (
                        <div className={styles.openDoorItem} key={index}>
                          <text className={styles.openDoorContent}>{item.eventDesc}</text>
                          <text className={styles.openDoorCount}>{item.count}</text>
                          <text className={styles.openDoorRate}>
                            {(item.rate * 100).toFixed(0)}%
                          </text>
                        </div>
                      )
                    })}
                </div>

                <div className={styles.division} />

                <div className={styles.userNumTitleContainer}>
                  <text className={styles.callingNum}>{callingInfo && callingInfo.totalCount}</text>
                  <text className={styles.registerUserFont}>呼叫次数</text>
                </div>
                <div className={styles.openDoorContainer}>
                  <div className={styles.openDoorItem}>
                    <text className={styles.openDoorContent}>APP接通</text>
                    <text className={styles.openDoorCount}>
                      {callingInfo && callingInfo.connectedCount}
                    </text>
                    <text className={styles.openDoorRate}>
                      {callingInfo && (callingInfo.connectedRate * 100).toFixed(0)}%
                    </text>
                  </div>
                  <div className={styles.openDoorItem}>
                    <text className={styles.openDoorContent}>未接通</text>
                    <text className={styles.openDoorCount}>
                      {callingInfo && callingInfo.unConnectedCount}
                    </text>
                    <text className={styles.openDoorRate}>
                      {callingInfo && (callingInfo.unConnectedRate * 100).toFixed(0)}%
                    </text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col md={14} sm={24}>
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: 0, position: 'relative', display: 'flex', alignItems: 'center' }}
            loading={loading}
          >
            <div className={styles.content}>
              <div className={styles.openDoorTitle}>
                <div className={styles.openDoorTitleContainer}>
                  <div className={styles.titleIcon} />
                  <text className={styles.titleContent}>分时数据</text>
                </div>
                <div style={{ marginBottom: 5, marginRight: 12 }}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                    defaultValue={selectDate}
                    onChange={v => setSelectDate(v)}
                  />
                </div>
              </div>
              <BarChart
                data={hourData}
                className={styles.chartContent}
                dataName={'time'}
                dataValues={'count'}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Workbench
