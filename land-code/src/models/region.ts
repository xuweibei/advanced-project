import { getRegions, saveRegions, deleteRegions } from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface RegionModelState {
  regionList: any
}
export interface RegionModelType {
  namespace: 'region'
  state: RegionModelState
  effects: {
    fetch: Effect
    save: Effect
    delete: Effect
  }
  reducers: {
    saveRegions: Reducer<RegionModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const RegionModel: RegionModelType = {
  namespace: 'region',
  state: {
    regionList: [],
  },

  effects: {
    *fetch({ payload }: any, { call, put }: any) {
      const res = yield call(getRegions,payload)
      // console.log(res)
      yield put({
        type: 'saveRegions',
        payload: {
          regionList: res ? res : [],
        },
      })
    },
    *save({ payload }: any, { call, put }: any) {
      yield call(saveRegions, payload)
      yield put({
        type: 'fetch',
      })
    },
    *delete({ payload }: any, { call, put }: any) {
      yield call(deleteRegions, payload)
      yield put({
        type: 'fetch',
      })
    },
  },

  reducers: {
    saveRegions(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default RegionModel
