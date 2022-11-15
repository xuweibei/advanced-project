import {
  getHostCountInfo,
  getHostActiveInfo,
  getHostSoftwareInfo,
  getHostCityDistribution,
  getHostProjectDistribution,
  getHostHistory,
  getDavinciHostCount,
  getRepairCount,
  getStatusCount,
  getHardwardCount,
} from '@/services/api'

export default {
  state: {
    hostCountInfo: {
      total: 0,
      offline: 0,
      online: 0,
    },
    hostActiveInfo: [0, 0, 0], // 数组，分别是 总数、已激活、已绑定
    softwareInfo: [],
    hostProjects: [],
    hostCities: [],
    hostHistory: [],
    davinciHostCount: [],
    hostRepair: 0,
    statusCount: [
      { status: '出厂', num: 0 },
      { status: '激活', num: 0 },
      { status: '绑定', num: 0 },
      { status: '返修', num: 0 },
      { status: '报废', num: 0 },
    ],
    hardwardCount: {
      onLine: 0,
      lossLine: 0,
    },
  },

  effects: {
    *getHostCountInfo(_, { call, put }) {
      const res = yield call(getHostCountInfo)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveHostCountInfo',
          payload: res.data,
        })
      }
    },
    *getHostActiveInfo(_, { call, put }) {
      const res = yield call(getHostActiveInfo)
      yield put({
        type: 'saveHostActiveInfo',
        payload: res,
      })
    },
    *getHostSoftwareInfo(_, { call, put }) {
      const res = yield call(getHostSoftwareInfo)
      if (res && res.code === 'success') {
        yield put({
          type: 'saveSoftwareInfo',
          payload: res.data,
        })
      }
    },
    *getHostCityDistribution(_, { call, put }) {
      const res = yield call(getHostCityDistribution)
      yield put({
        type: 'saveHostCities',
        payload: res,
      })
    },
    *getHostProjectDistribution(_, { call, put }) {
      const res = yield call(getHostProjectDistribution)
      yield put({
        type: 'saveHostProjects',
        payload: res,
      })
    },
    *getHostHistory({ payload }, { call, put }) {
      const res = yield call(getHostHistory, payload)
      yield put({
        type: 'saveHostHistory',
        payload: res,
      })
    },
    *getDavinciHostCount(_, { call, put }) {
      let res = yield call(getDavinciHostCount)
      if (res) {
        for (let i in res) {
          if (!res[i].hardward || res[i].hardward == 'Raspberry') {
            res[i].hardward = '蜂巢'
          } else if (res[i].hardward == 'ALLWINNER') {
            res[i].hardward = 'AI MIND'
          }
        }
        res = res.reduce((obj, item) => {
          let find = obj.find(i => i.hardward == item.hardward)
          let _d = {
            ...item,
          }
          find ? (find.num += item.num) : obj.push(_d)
          return obj
        }, [])
        yield put({
          type: 'saveDavinciHostCount',
          payload: res,
        })
      }
    },
    *getRepairCount(_, { call, put }) {
      const res = yield call(getRepairCount)
      yield put({
        type: 'saveRepairCount',
        payload: res,
      })
    },
    *getStatusCount(_, { call, put }) {
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
        type: 'saveStatusCount',
        payload: allStatusCount,
      })
    },
    *getHardwardCount(_, { call, put }) {
      const res = yield call(getHardwardCount)
      yield put({
        type: 'saveHardwardCount',
        payload: {
          onLine: res.onLine ? res.onLine : 0,
          lossLine: res.lossLine ? res.lossLine : 0,
        },
      })
    },
  },

  reducers: {
    saveHostCountInfo(state, { payload }) {
      return { ...state, hostCountInfo: payload }
    },
    saveHostActiveInfo(state, { payload }) {
      return { ...state, hostActiveInfo: payload }
    },
    saveSoftwareInfo(state, { payload }) {
      return { ...state, softwareInfo: payload }
    },
    saveHostProjects(state, { payload }) {
      return { ...state, hostProjects: payload }
    },
    saveHostCities(state, { payload }) {
      return { ...state, hostCities: payload }
    },
    saveHostHistory(state, { payload }) {
      return { ...state, hostHistory: payload }
    },
    saveDavinciHostCount(state, { payload }) {
      return { ...state, davinciHostCount: payload }
    },
    saveRepairCount(state, { payload }) {
      return { ...state, hostRepair: payload }
    },
    saveStatusCount(state, { payload }) {
      return { ...state, statusCount: payload }
    },
    saveHardwardCount(state, { payload }) {
      return { ...state, hardwardCount: payload }
    },
  },
}
