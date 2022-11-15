import {
  getHostDetail,
  getHostLifecycle,
  queryPackageHistoryByHomeId,
  addProject,
} from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface HostModelState {
  hostDetail: any
  lifecycle: any
  VersionLog: any
}
export interface HostModelType {
  namespace: 'host'
  state: HostModelState
  effects: {
    getHost: Effect
    getLifecycle: Effect
    getVersionLog: Effect
  }
  reducers: {
    saveHost: Reducer<HostModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const HostModel: HostModelType = {
  namespace: 'host',

  state: {
    hostDetail: {},
    lifecycle: [],
    VersionLog: [],
  },

  effects: {
    *getHost({ payload }: any, { call, put }: any) {
      const res = yield call(getHostDetail, payload)
      yield put({
        type: 'saveHost',
        payload: {
          hostDetail: res ? res.data : {},
        },
      })
    },
    *getLifecycle({ payload }: any, { call, put }: any) {
      const res = yield call(getHostLifecycle, payload)
      yield put({
        type: 'saveHost',
        payload: {
          lifecycle: res ? res : [],
        },
      })
    },
    *getVersionLog({ payload }: any, { call, put }: any) {
      const res = yield call(queryPackageHistoryByHomeId, payload)
      yield put({
        type: 'saveHost',
        payload: {
          VersionLog: res ? res.results : [],
        },
      })
    },
  },

  reducers: {
    saveHost(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default HostModel
