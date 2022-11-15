import {
  getActiveUserDistributionMonth,
  getAppUserCount,
  getCameraOpenStatsByDate,
  getCameraStats,
  getHostCountInfo,
  getIntelligentDeveloperCount,
  getIntelligentProjectCount,
  getProjectCityCount,
  getRobotsList,
  getStatusCount,
  getTotalKanFangNum,
  getWillingCustomersByTimes,
  queryActiveUserCount,
  queryNewlyAddedUserCount,
  queryRepairStatistics,
} from '@/services/api'
import moment from 'moment'

import { Effect, Reducer } from 'umi'
export interface ConsoleModelState {
  todayActiveUserCount: number //今日活跃用户数
  activeUserCount: any //时间段内用户活跃数
  todayNewlyAddedUserCount: number //今日新增用户数
  robotsCount: number //机器人总数
  houseWatchingCount: number //今日看房人数
  willCustomersCount: number //今日意向看房人数
  intelligentDeveloperCount: number //智能化社区
  intelligentProjectCount: number //智能化项目
  userCount: number // 累计用户数
  cameraCount: number //摄像头数量
  cameraOpenCount: number //摄像头打开次数
  hostCount: number // 主机总数
  statusCount: any // 各个状态主机数
  activeUserHisMonth: any // 某几个月内用户活跃数
  projectCityCount: any // 城市项目数
  todayRepairStatistics: any // 今日报修数据统计
}
export interface ConsoleModelType {
  namespace: 'consoleDatas'
  state: ConsoleModelState
  effects: {
    queryTodayActiveUserCount: Effect
    queryActiveUserCount: Effect
    queryTodayNewlyAddedUserCount: Effect
    getRobotsList: Effect
    getTotalKanFangNum: Effect
    getWillingCustomers: Effect
    getIntelligentDeveloperCount: Effect
    getIntelligentProjectCount: Effect
    getCameraStats: Effect
    getCameraOpenStatsByDate: Effect
    getHostCountInfo: Effect
    getStatusCount: Effect
    getAppUserCount: Effect
    getProjectCityCount: Effect
    queryTodayRepairStatistics: Effect
  }
  reducers: {
    saveConsoleData: Reducer<ConsoleModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const ConsoleModel: ConsoleModelType = {
  namespace: 'consoleDatas',

  state: {
    todayActiveUserCount: 0,
    activeUserCount: [],
    todayNewlyAddedUserCount: 0,
    robotsCount: 0,
    houseWatchingCount: 0,
    willCustomersCount: 0,
    intelligentDeveloperCount: 0,
    intelligentProjectCount: 0,
    userCount: 0,
    cameraCount: 0,
    cameraOpenCount: 0,
    hostCount: 0,
    statusCount: [
      { status: '出厂', num: 0 },
      { status: '激活', num: 0 },
      { status: '绑定', num: 0 },
      { status: '返修', num: 0 },
      { status: '报废', num: 0 },
    ],
    activeUserHisMonth: [],
    projectCityCount: [],
    todayRepairStatistics: 0,
  },

  effects: {
    //获取今日活跃用户数
    *queryTodayActiveUserCount(_: any, { call, put }: any) {
      const payload = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }
      const res = yield call(queryActiveUserCount, payload)
      yield put({
        type: 'saveConsoleData',
        payload: {
          todayActiveUserCount: res.code === 'success' ? res.data[0].activeUserCount : 0,
        },
      })
    },
    //获取时间段内活跃用户数量
    *queryActiveUserCount({ payload }: any, { call, put }: any) {
      const res = yield call(getActiveUserDistributionMonth, payload)
      yield put({
        type: 'saveConsoleData',
        payload: {
          activeUserHisMonth: res ? res : [],
        },
      })
    },
    //获取今日新增用户数
    *queryTodayNewlyAddedUserCount(_: any, { call, put }: any) {
      const payload = {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }
      const res = yield call(queryNewlyAddedUserCount, payload)
      yield put({
        type: 'saveConsoleData',
        payload: {
          todayNewlyAddedUserCount: res.code === 'success' ? res.data : 0,
        },
      })
    },

    //获取报修数据统计
    *queryTodayRepairStatistics(_: any, { call, put }: any) {
      const payload = {
        developerId: localStorage.getItem('developerId'),
      }
      const res = yield call(queryRepairStatistics, payload)
      console.log('resres', res.todayCount)
      yield put({
        type: 'saveConsoleData',
        payload: {
          todayRepairStatistics: res.todayCount,
        },
      })
    },
    //获取机器人总数
    *getRobotsList(_: any, { call, put }: any) {
      const developerId = localStorage.getItem('developerId')
      const res = yield call(getRobotsList, developerId)
      yield put({
        type: 'saveConsoleData',
        payload: {
          robotsCount: res ? res.length : 0,
        },
      })
    },
    //获取今日看房量
    *getTotalKanFangNum(_: any, { call, put }: any) {
      const payload = { date: moment().format('YYYY-MM-DD') }
      const res = yield call(getTotalKanFangNum, payload)
      yield put({
        type: 'saveConsoleData',
        payload: {
          houseWatchingCount: res ? res : 0,
        },
      })
    },
    //获取今日意向客户数
    *getWillingCustomers(_: any, { call, put }: any) {
      const payload = { date: moment().format('YYYY-MM-DD'), times: 3 }
      const res = yield call(getWillingCustomersByTimes, payload)
      yield put({
        type: 'saveConsoleData',
        payload: {
          willCustomersCount: res ? res : 0,
        },
      })
    },
    //获取智能化社区
    *getIntelligentDeveloperCount(_: any, { call, put }: any) {
      const res = yield call(getIntelligentDeveloperCount)
      yield put({
        type: 'saveConsoleData',
        payload: {
          intelligentDeveloperCount: res.code === 'success' ? res.data : 0,
        },
      })
    },
    //获取智能化项目
    *getIntelligentProjectCount(_: any, { call, put }: any) {
      const res = yield call(getIntelligentProjectCount)
      yield put({
        type: 'saveConsoleData',
        payload: {
          intelligentProjectCount: res.code === 'success' ? res.data : 0,
        },
      })
    },
    //获取摄像头数量
    *getCameraStats(_: any, { call, put }: any) {
      const res = yield call(getCameraStats)
      yield put({
        type: 'saveConsoleData',
        payload: {
          cameraCount: res ? res.activeCameraNums : 0,
        },
      })
    },
    //获取摄像头打开次数
    *getCameraOpenStatsByDate(_: any, { call, put }: any) {
      const payload = { date: moment().format('YYYY-MM-DD') }
      const res = yield call(getCameraOpenStatsByDate, payload)
      yield put({
        type: 'saveConsoleData',
        payload: {
          cameraOpenCount: res ? res.total : 0,
        },
      })
    },
    //获取主机总数
    *getHostCountInfo(_: any, { call, put }: any) {
      const res = yield call(getHostCountInfo)
      yield put({
        type: 'saveConsoleData',
        payload: {
          hostCount: res.code === 'success' ? res.data.total : 0,
        },
      })
    },
    //获取主机激活、绑定数
    *getStatusCount(_: any, { call, put }: any) {
      const res = yield call(getStatusCount)
      var allStatusCount = [
        { status: '出厂', num: 0 },
        { status: '激活', num: 0 },
        { status: '绑定', num: 0 },
        { status: '返修', num: 0 },
        { status: '报废', num: 0 },
      ]
      for (let key in res) {
        if (res[key].status == 'FACTORY') {
          allStatusCount[0].num = res[key].num
        } else if (res[key].status == 'INSTALL') {
          allStatusCount[1].num = res[key].num
        } else if (res[key].status == 'BIND') {
          allStatusCount[2].num = res[key].num
        } else if (res[key].status == 'REWORK') {
          allStatusCount[3].num = res[key].num
        } else if (res[key].status == 'SCRAP') {
          allStatusCount[4].num = res[key].num
        }
      }
      yield put({
        type: 'saveConsoleData',
        payload: {
          statusCount: allStatusCount,
        },
      })
    },
    //获取累计用户数
    *getAppUserCount(_: any, { call, put }: any) {
      const res = yield call(getAppUserCount)
      if (res) {
        yield put({
          type: 'saveConsoleData',
          payload: {
            userCount: res.data,
          },
        })
      }
    },
    //获取城市项目数
    *getProjectCityCount(_: any, { call, put }: any) {
      const res = yield call(getProjectCityCount)
      let data: { name: any; value: any }[] = []
      res &&
        res.map((item: any) => {
          if (item.cityName) {
            data.push({
              name: item.cityName,
              value: item.cityCount,
            })
          }
        })
      yield put({
        type: 'saveConsoleData',
        payload: {
          projectCityCount: data,
        },
      })
    },
  },

  reducers: {
    saveConsoleData(state: any, { payload }: any) {
      return { ...state, ...payload }
    },
  },
}

export default ConsoleModel
