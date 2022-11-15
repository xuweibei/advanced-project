import {
  getCameraStatsInfo,
  getHostInfo,
  getUserActiveToApp,
  queryUserExecutionHistory,
  queryUserInfoByMobile,
  queryUserInfoList,
  queryUserObtainedHostAndPermissionByMobile,
} from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface UserModelState {
  userList: any
  userInfo: any
  serviceInfo: any
  UserExecutionHistory: any
  UserHostInfo: any
}
export interface UserModelType {
  namespace: 'user'
  state: UserModelState
  effects: {
    fetch: Effect
    queryUserInfo: Effect
    queryUserObtainedHostAndPermission: Effect
    queryUserExecutionHistory: Effect
    getUserActiveToApp: Effect
    getCameraStatsInfo: Effect
  }
  reducers: {
    saveUserList: Reducer<UserModelState>
    saveUser: Reducer<UserModelState>
    saveUserExecutionHistory: Reducer<UserModelState>
    saveUserHostInfo: Reducer<UserModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    userList: {
      list: [],
      pagination: {},
      count: 0,
    },
    userInfo: {},
    serviceInfo: [],
    UserExecutionHistory: {
      list: [],
      pagination: {},
      count: 0,
    },
    UserHostInfo: [],
  },

  effects: {
    *fetch({ payload }: any, { call, put }: any) {
      const res = yield call(queryUserInfoList, payload)
      if (res) {
        const { results, count } = res
        yield put({
          type: 'saveUserList',
          payload: {
            list: results ? results : [],
            pagination: {
              total: res.count ? res.count : 1,
              current: payload.pageIndex,
              pageSize: payload.pageCount,
            },
            count: res.count,
          },
        })
      }
    },
    *queryUserInfo({ payload }: any, { call, put }: any) {
      const res = yield call(queryUserInfoByMobile, payload)
      if (res) {
        yield put({
          type: 'saveUser',
          payload: {
            userInfo: res.data,
          },
        })
      }
    },
    *queryUserObtainedHostAndPermission({ payload }: any, { call, put }: any) {
      const res = yield call(queryUserObtainedHostAndPermissionByMobile, payload)
      if (res.code == 'success') {
        let PermissionData = JSON.parse(res.data)

        PermissionData.results.forEach((item: any) => {
          if (item.pmobile) {
            item.isManager = 1
          } else {
            item.isManager = 0
          }
        })
        yield put({
          type: 'saveUser',
          payload: {
            serviceInfo: {
              list: PermissionData.results,
              pagination: {
                total: PermissionData.count,
                current: payload.page,
                pageSize: payload.pageSize,
              },
              count: PermissionData.count,
            },
          },
        })

        let homeId: any[] = []
        PermissionData.results.map((item: any) => {
          const serves = item.types.split(',')
          if (serves.find((item: any) => item === 'SmartHome')) {
            homeId.push(item.hostId)
          }
        })
        let allHostInfo: any[] = []
        for (var i = 0; i < homeId.length; i++) {
          if (homeId[i]) {
            allHostInfo[i] = yield call(getHostInfo, homeId[i])
          }
        }
        yield put({
          type: 'saveUserHostInfo',
          payload: allHostInfo,
        })
      }
    },
    *queryUserExecutionHistory({ payload }, { call, put }) {
      try {
        const res = yield call(queryUserExecutionHistory, payload)
        if (res && res.code === 'success') {
          const { data } = res
          data.recordArr.forEach((item: any) => {
            item.type = '智能家居'
          })
          yield put({
            type: 'saveUserExecutionHistory',
            payload: {
              list: data.recordArr,
              pagination: {
                total: data.recordCount,
                current: payload.pageIndex,
                pageSize: payload.pageCount,
              },
              count: data.recordCount,
            },
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    *getUserActiveToApp({ payload }: any, { call, put }: any) {
      const res = yield call(getUserActiveToApp, payload)
      const data = res.results
      data.map((item: any) => {
        item.type = 'App埋点'
        item.operation = '打开星智家'
      })
      if (res) {
        yield put({
          type: 'saveUserExecutionHistory',
          payload: {
            list: data,
            pagination: {
              total: res.count,
              current: payload.pageIndex,
              pageSize: payload.pageCount,
            },
            count: res.count,
          },
        })
      }
    },
    *getCameraStatsInfo({ payload }: any, { call, put }: any) {
      const res = yield call(getCameraStatsInfo, payload)
      const data = res.results
      data.map((item: any) => {
        item.type = '车位监控'
        item.operation = '打开车位监控'
      })
      if (res) {
        yield put({
          type: 'saveUserExecutionHistory',
          payload: {
            list: data,
            pagination: {
              total: res.count,
              current: payload.pageIndex,
              pageSize: payload.pageCount,
            },
            count: res.count,
          },
        })
      }
    },
  },

  reducers: {
    saveUserList(state: any, { payload }: any) {
      return { ...state, userList: payload }
    },
    saveUser(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      }
    },
    saveUserExecutionHistory(state: any, { payload }: any) {
      return { ...state, UserExecutionHistory: payload }
    },
    saveUserHostInfo(state: any, { payload }: any) {
      let allHostlInfo = []
      for (var i = 0; i < payload.length; i++) {
        let totalInfo = {
          groups: [],
          devices: [],
          scenes: [],
        }
        let groups: any = []
        let devices: any = []
        let scenes: any = []
        let homeId = ''
        if (payload[i].homeConfig && payload[i].homeConfig.data) {
          const { DEVICE_GROUP, PATTERN, HOME_ID } = payload[i].homeConfig.data
          homeId = HOME_ID
          if (PATTERN && PATTERN.length) {
            scenes = PATTERN // 全局场景
          }
          if (DEVICE_GROUP) {
            DEVICE_GROUP.forEach((group: any) => {
              devices = devices.concat(group.DEVICE)
              scenes = scenes.concat(group.PATTERN)
              delete group.DEVICE
              delete group.PATTERN
              groups.push(group)
            })
          }
        }
        totalInfo.groups = groups
        totalInfo.devices = devices
        totalInfo.scenes = scenes
        allHostlInfo.push(totalInfo)
      }
      return { ...state, UserHostInfo: allHostlInfo }
    },
  },
}

export default UserModel
