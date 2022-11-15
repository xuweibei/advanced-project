import {
  getAppUserCount,
  getUserRegisterCountToday,
  getUserRegisterCountIn7days,
  getAppTodayLaunchTimes,
  getAppTodayActiveUserCount,
  getAppMonthActiveUserCount,
  getUserCityDistribution,
  getUserAppVersionDistribution,
  getUserRegisterDistribution,
  getAppLaunchTimeDistribution,
  getActiveUserDistribution,
  getActiveUserDistribution7month,
  getActiveUserDistribution7day,
  getAPPUserCityCount,
  getBindHost,
} from '../services/api.ts'
import moment from 'moment'

export default {
  state: {
    userCount: 0, // 累计用户数
    newCountToday: 0, // 今日新增用户
    newCount7day: 0, // 七日新增用户
    launchTimes: 0, // 今日启动次数
    activeCountToday: 0, // 日活
    activeCountMonth: 0, // 月活
    cities: [],
    appVersions: [],
    registerHis: [],
    launchTimeHis: [],
    activeUserHis: [],
    activeUserHis7month: [],
    activeUserHis7day: [],
    APPCityDistribution: [],
    APPCityCount: [
      { name: '', num: 0 },
      { name: '', num: 0 },
      { name: '', num: 0 },
    ],
    totalNum: 0,
    activeUserHis7dayTotal: 0,
    bindHostList: {
      list: [],
      pagination: {},
    },
    bindHostCount: 0,
  },

  effects: {
    *getAppUserCount(_, { call, put }) {
      const res = yield call(getAppUserCount)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveUserCount',
          payload: res.data,
        })
      }
    },
    *getUserRegisterCountToday(_, { call, put }) {
      const res = yield call(getUserRegisterCountToday)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveNewCountToday',
          payload: res.data,
        })
      }
    },
    *getUserRegisterCountIn7days(_, { call, put }) {
      const res = yield call(getUserRegisterCountIn7days)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveNewCount7day',
          payload: res.data,
        })
      }
    },
    *getAppTodayLaunchTimes(_, { call, put }) {
      const res = yield call(getAppTodayLaunchTimes)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveLaunchTimes',
          payload: res.data,
        })
      }
    },
    *getAppTodayActiveUserCount(_, { call, put }) {
      const res = yield call(getAppTodayActiveUserCount)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveActiveCountToday',
          payload: res.data,
        })
      }
    },
    *getAppMonthActiveUserCount({ payload }, { call, put }) {
      const res = yield call(getAppMonthActiveUserCount, payload)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveActiveCountMonth',
          payload: res.data,
        })
      }
    },

    *getUserCityDistribution(_, { call, put }) {
      const res = yield call(getUserCityDistribution)
      if (res && res.code === 'success') {
        let data = []
        for (let key in res.data) {
          data = data.concat(res.data[key])
        }
        yield put({
          type: 'saveCities',
          payload: data,
        })
      }
    },

    *getUserAppVersionDistribution(_, { call, put }) {
      const res = yield call(getUserAppVersionDistribution)
      if (res && res.code === 'success') {
        let data = []
        for (let key in res.data) {
          data = data.concat(res.data[key])
        }
        yield put({
          type: 'saveAppVersions',
          payload: data,
        })
      }
    },

    *getUserRegisterDistribution({ payload }, { call, put }) {
      const res = yield call(getUserRegisterDistribution, payload)
      if (res && res.code === 'success') {
        const today = moment()
        yield put({
          type: 'saveRegisterHis',
          payload: res.data.filter(item => moment(item.date).isSameOrBefore(today, 'date')),
        })
      }
    },

    *getAppLaunchTimeDistribution({ payload }, { call, put }) {
      const res = yield call(getAppLaunchTimeDistribution, payload)
      if (res && res.code === 'success') {
        const today = moment()
        yield put({
          type: 'saveLaunchTimeHis',
          payload: res.data.filter(item => moment(item.date).isSameOrBefore(today, 'date')),
        })
      }
    },

    *getActiveUserDistribution7month({ payload }, { call, put }) {
      const res = yield call(getActiveUserDistribution7month, payload)
      yield put({
        type: 'saveActiveUserHis7month',
        payload: res,
      })
    },

    *getActiveUserDistribution({ payload }, { call, put }) {
      const res = yield call(getActiveUserDistribution, payload)
      if (res && res.code === 'success') {
        const today = moment()
        yield put({
          type: 'saveActiveUserHis',
          payload: res.data.filter(item => moment(item.date).isSameOrBefore(today, 'date')),
        })
      }
    },

    *getActiveUserDistribution7day({ payload }, { call, put }) {
      const res = yield call(getActiveUserDistribution7day, payload)
      if (res && res.code === 'success') {
        const today = moment()
        const activeUserCountTotal = res.data.reduce(
          (total, item) => total + item.activeUserCount,
          0
        )
        yield put({
          type: 'saveActiveUserHis7day',
          payload: res.data.filter(item => moment(item.date).isSameOrBefore(today, 'date')),
        })
        yield put({
          type: 'saveActiveUserHis7dayTotal',
          payload: Math.round(activeUserCountTotal / 7),
        })
      }
    },

    *getAPPUserCityCount(_, { call, put }) {
      const res = yield call(getAPPUserCityCount)
      var APPCityDistribution = []
      var APPUserCityCount = []
      var totalNum = 0
      for (let key in res) {
        if (res[key].city) {
          var name = res[key].city.replace('市', '')
          APPCityDistribution.push({
            name: name,
            num: res[key].num,
          })
        }
        totalNum = totalNum + res[key].num
      }
      for (let v in APPCityDistribution) {
        if (v < 3) {
          APPUserCityCount.push({
            name: APPCityDistribution[v].name,
            num: APPCityDistribution[v].num,
          })
        }
      }
      yield put({
        type: 'saveAPPDistribution',
        payload: APPCityDistribution,
      })
      yield put({
        type: 'saveAPPUserCityCount',
        payload: APPUserCityCount,
      })
      yield put({
        type: 'saveAPPUserCityCountTotal',
        payload: totalNum,
      })
    },

    *getBindHostList({ payload }, { call, put }) {
      const res = yield call(getBindHost, payload)
      if (res) {
        const { results } = res
        yield put({
          type: 'saveBindHostList',
          payload: {
            list: results ? results : [],
            pagination: {
              total: res.count ? res.count : 1,
              current: payload.pageIndex,
              pageSize: payload.pageCount,
            },
          },
        })
      }
    },

    *getBindHostByTime({ payload }, { call, put }) {
      const res = yield call(getBindHost, payload)
      if (res) {
        const { count } = res
        yield put({
          type: 'saveBindHostCount',
          payload: count,
        })
      }
    },
  },

  reducers: {
    saveUserCount(state, { payload }) {
      return { ...state, userCount: payload }
    },
    saveNewCountToday(state, { payload }) {
      return { ...state, newCountToday: payload }
    },
    saveNewCount7day(state, { payload }) {
      return { ...state, newCount7day: payload }
    },
    saveLaunchTimes(state, { payload }) {
      return { ...state, launchTimes: payload }
    },
    saveActiveCountToday(state, { payload }) {
      return { ...state, activeCountToday: payload }
    },
    saveActiveCountMonth(state, { payload }) {
      return { ...state, activeCountMonth: payload }
    },
    saveCities(state, { payload }) {
      return { ...state, cities: payload }
    },
    saveAppVersions(state, { payload }) {
      return { ...state, appVersions: payload }
    },
    saveRegisterHis(state, { payload }) {
      return { ...state, registerHis: payload }
    },
    saveLaunchTimeHis(state, { payload }) {
      return { ...state, launchTimeHis: payload }
    },
    saveActiveUserHis(state, { payload }) {
      return { ...state, activeUserHis: payload }
    },
    saveActiveUserHis7month(state, { payload }) {
      return { ...state, activeUserHis7month: payload }
    },
    saveActiveUserHis7day(state, { payload }) {
      return { ...state, activeUserHis7day: payload }
    },
    saveActiveUserHis7dayTotal(state, { payload }) {
      return { ...state, activeUserHis7dayTotal: payload }
    },
    saveAPPDistribution(state, { payload }) {
      return { ...state, APPCityDistribution: payload }
    },
    saveAPPUserCityCount(state, { payload }) {
      return { ...state, APPCityCount: payload }
    },
    saveAPPUserCityCountTotal(state, { payload }) {
      return { ...state, totalNum: payload }
    },
    saveBindHostList(state, { payload }) {
      return { ...state, bindHostList: payload }
    },
    saveBindHostCount(state, { payload }) {
      return { ...state, bindHostCount: payload }
    },
  },
}
