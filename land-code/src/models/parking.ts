import { removeParkings, queryParkingInfo, addParking, updateParking } from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface ParkingModelState {
  list: any
  pagination: any
}
export interface ParkingModelType {
  namespace: 'parking'
  state: ParkingModelState
  effects: {
    fetch: Effect
    create: Effect
    update: Effect
    remove: Effect
  }
  reducers: {
    saveBuildings: Reducer<ParkingModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const ParkingModel: ParkingModelType = {
  namespace: 'parking',
  state: {
    list: [],
    pagination: {},
  },

  effects: {
    *fetch({ payload = {} }, { call, put }) {
      const res = yield call(queryParkingInfo, payload)
      const { page, page_size } = payload
      const { data, response } = res
      yield put({
        type: 'save',
        payload: {
          list: data,
          pagination: {
            total: parseInt(response.headers.get('X_TOTAL_COUNT'), 10),
            pageSize: page_size || 10,
            current: page || 1,
          },
        },
      })
    },

    *create({ payload }, { call, put }) {
      yield call(addParking, payload)
      yield put({
        type: 'fetch',
      })
    },

    *update({ payload }, { call, put }) {
      const { id, update } = payload
      yield call(updateParking, id, update)
      yield put({
        type: 'fetch',
      })
    },

    *remove({ payload }, { call, put }) {
      yield call(removeParkings, payload)
      yield put({
        type: 'fetch',
      })
    },
  },

  reducers: {
    saveBuildings(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default ParkingModel
