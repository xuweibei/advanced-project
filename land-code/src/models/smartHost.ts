import { getHostList } from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface SmartHostModelState {
  hostList: any
}
export interface SmartHostModelType {
  namespace: 'smartHost'
  state: SmartHostModelState
  effects: {
    fetch: Effect
  }
  reducers: {
    saveSmartHost: Reducer<SmartHostModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const SmartHostModel: SmartHostModelType = {
  namespace: 'smartHost',

  state: {
    hostList: {
      list: [],
      pagination: {},
      count: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }: any) {
      const res = yield call(getHostList, payload)
      if (res) {
        const { hostArr, hostCount } = res.data
        yield put({
          type: 'saveSmartHost',
          payload: {
            list: hostArr ? hostArr : [],
            pagination: {
              total: hostCount ? hostCount : 1,
              current: payload.pageIndex,
              pageSize: payload.pageCount,
            },
            count: hostCount,
          },
        })
      }
      // yield put({
      //   type: 'saveEngineeringLog',
      //   payload: {
      //     hostList: res.data ? res.data.hostArr : [],
      //     pagination: {
      //       // total: parseInt(response.headers.get('X_TOTAL_COUNT'), 10),
      //       pageSize: page_size,
      //       current: page,
      //     },
      //   },
      // })
    },
  },

  reducers: {
    saveSmartHost(state: any, { payload }: any) {
      return { ...state, hostList: payload }
    },
  },
}

export default SmartHostModel
