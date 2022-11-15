import {
  getCameraStatisticsInfo,
  getCameraOpenStatsByDate,
  getInternetTraffic,
  getCameraOpenCountByMonth,
  getInternetTrafficMonth,
  getCameraOpenCountBy7Day
} from '@/services/api'
import moment from 'moment'

export default {
  state: {
    statisticsInfo: {}, // 各类统计信息
    openTimes: 0, // 打开次数
    flow: 0, // 流量
    registerFlow: [], //流量 按月查天
    launchOpenTimes: [], //打开次数 按月查天
    launchOpenTimes7Day: [], //打开次数 查7天
  },

  effects: {
    *getCameraStatisticsInfo(_, { call, put }) {
      const res = yield call(getCameraStatisticsInfo)
      yield put({
        type: 'saveStatisticsInfo',
        payload: res
      })
    },

    *getCameraOpenStatsByDate(_, { call, put }) {
      const res = yield call(getCameraOpenStatsByDate)
      yield put({
        type: 'saveOpenTimes',
        payload: res && res.total
      })
    },

    *getInternetTraffic(_, { call, put }) {
      const res = yield call(getInternetTraffic)
      yield put({
        type: 'saveFlow',
        payload: res && res.total
      })
    },

    *getCameraOpenCountByMonth({ payload }, { call, put }) {
      const res = yield call(getCameraOpenCountByMonth, payload)
      if (res) {
        const today = moment()
        yield put({
          type: 'saveCameraOpenCountByMonth',
          payload: res.filter(item => moment(item.dat).isSameOrBefore(today, 'date'))
        })
      }
    },

    *getInternetTrafficMonth({ payload }, { call, put }) {
      const res = yield call(getInternetTrafficMonth, payload)
      if (res && res.code === '200') {
        const today = moment()
        yield put({
          type: 'saveInternetTrafficMonth',
          payload: res.data.filter(item => moment(item.date).isSameOrBefore(today, 'date'))
        })
      }else{
        yield put({
          type: 'saveInternetTrafficMonth',
          payload: []
        })
      }
    },

    *getCameraOpenCountBy7Day({ payload }, { call, put }) {
      const res = yield call(getCameraOpenCountBy7Day, payload)
      if (res) {
        const today = moment()
        yield put({
          type: 'saveCameraOpenCountBy7Day',
          payload: res.filter(item => moment(item.date).isBefore(today, 'date'))
        })
      }
    },
  },

  reducers: {
    saveStatisticsInfo(state, { payload }) {
      return { ...state, statisticsInfo: payload }
    },
    saveOpenTimes(state, { payload }) {
      return { ...state, openTimes: payload }
    },
    saveFlow(state, { payload }) {
      return { ...state, flow: payload }
    },
    saveCameraOpenCountByMonth(state, { payload }) {
      return { ...state, launchOpenTimes: payload }
    },
    saveInternetTrafficMonth(state, { payload }) {
      return { ...state, registerFlow: payload }
    },
    saveCameraOpenCountBy7Day(state, { payload }) {
      return { ...state, launchOpenTimes7Day: payload }
    },
  }
}