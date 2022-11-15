import React, { useEffect, useState } from 'react'
import DashCard from '@/components/Cards'
import { Row, Col } from 'antd'
import {
  getHostBindCountToday,
  getHostInstallCountToday,
  getNewCustomerNumOfDate,
  getTotalKanFangNum,
  queryActiveUserCount,
  queryNewlyAddedUserCount,
} from '@/services/api'
import moment from 'moment'

const dailyBoard = () => {
  const [dailyInstallHost, setDailyInstallHost] = useState<string>('0')
  const [dailyBindHostUser, setDailyBindHostUser] = useState<string>('0')
  const [dailyAppActiveNum, setDailyAppActiveNum] = useState<string>('0')
  const [dailyAppAddNum, setDailyAppAddNum] = useState<string>('0')
  const [dailyRemoteViewingNum, setDailyRemoteViewingNum] = useState<string>('0')
  const [dailyRemoteViewingAddNum, setDailyRemoteViewingAddNum] = useState<string>('0')

  useEffect(() => {
    let data = {
      pageIndex: 1,
      pageCount: 10,
      startTime: moment().format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
    }
    getHostInstallCountToday(data).then((res: any) => {
      setDailyInstallHost(res)
    })
    getHostBindCountToday(data).then((res: any) => {
      setDailyBindHostUser(res.count)
    })
    queryActiveUserCount({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    }).then((res: any) => {
      res.code === 'success'
        ? setDailyAppActiveNum(res.data[0].activeUserCount)
        : setDailyAppActiveNum('0')
    })
    queryNewlyAddedUserCount({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    }).then((res: any) => {
      res.code === 'success'
        ? setDailyAppAddNum(res.data)
        : setDailyAppAddNum('0')
    })
    getTotalKanFangNum({ date: moment().format('YYYY-MM-DD') }).then((res: any) => {
      setDailyRemoteViewingNum(res)
    })
    getNewCustomerNumOfDate({ date: moment().format('YYYY-MM-DD') }).then((res: any) => {
      setDailyRemoteViewingAddNum(res)
    })
  }, [])
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around">
        <Col md={8} sm={24}>
          <DashCard title="今日激活主机数" value={dailyInstallHost} />
        </Col>
        <Col md={8} sm={24}>
          <DashCard title="今日绑定用户数" value={dailyBindHostUser} />
        </Col>
        <Col md={8} sm={24}>
          <DashCard title="今日APP活跃人数" value={dailyAppActiveNum} />
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around">
        <Col md={8} sm={24}>
          <DashCard title="今日APP新增用户" value={dailyAppAddNum} />
        </Col>
        <Col md={8} sm={24}>
          {/* <DashCard title="今日远程看房新增客户" value={dailyRemoteViewingNum} /> */}
        </Col>
        <Col md={8} sm={24}>
          {/* <DashCard title="今日远程看房客户" value={dailyRemoteViewingAddNum} /> */}
        </Col>
      </Row>
    </>
  )
}

export default dailyBoard
