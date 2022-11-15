import { getEngineeringLogList } from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface EngineeringLogModelState {
  engineeringLogList: any
}
export interface EngineeringLogModelType {
  namespace: 'engineeringLog'
  state: EngineeringLogModelState
  effects: {
    fetch: Effect
  }
  reducers: {
    saveEngineeringLog: Reducer<EngineeringLogModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const EngineeringLogModel: EngineeringLogModelType = {
  namespace: 'engineeringLog',

  state: {
    engineeringLogList: {
      list: [],
      pagination: {},
      count: 0,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }: any) {
      const res = yield call(getEngineeringLogList, payload)
      if (res) {
        const { results, count } = res
        yield put({
          type: 'saveEngineeringLog',
          payload: {
            list: results ? results : [],
            pagination: {
              total: res.count ? res.count : 1,
              current: payload.page,
              pageSize: payload.page_size,
            },
            count: count,
          },
        })
      }
    },
  },

  reducers: {
    saveEngineeringLog(state: any, { payload }: any) {
      return { ...state, engineeringLogList: payload }
    },
  },
}

export default EngineeringLogModel
