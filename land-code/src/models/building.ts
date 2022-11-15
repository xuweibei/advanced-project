import {
  deleteBuilding,
  getBuilding,
  saveBuilding,
  selectTreeLevelPermission,
} from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface BuildingModelState {
  buildingList: any
  regions: any
}
export interface BuildingModelType {
  namespace: 'building'
  state: BuildingModelState
  effects: {
    fetch: Effect
    getTreePermission: Effect
    save: Effect
    delete: Effect
  }
  reducers: {
    saveBuildings: Reducer<BuildingModelState>
    saveRegions: Reducer<BuildingModelState>
    saveBuildingList: Reducer<BuildingModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const BuildingModel: BuildingModelType = {
  namespace: 'building',

  state: {
    buildingList: {
      list: [],
      pagination: {},
    },
    regions: [],
  },

  effects: {
    *fetch({ payload }: any, { call, put }: any) {
      const res = yield call(getBuilding, payload)
      if (res.results.length == 0 && payload.page > 1) {
        payload.page -= 1
        const new_res = yield call(getBuilding, payload)
        yield put({
          type: 'saveBuildingList',
          payload: {
            list: new_res.results,
            pagination: {
              total: new_res.count,
              current: payload.page,
              pageSize: payload.page_size,
            },
          },
        })
      } else {
        yield put({
          type: 'saveBuildingList',
          payload: {
            list: res.results,
            pagination: {
              total: res.count,
              current: payload.page,
              pageSize: payload.page_size,
            },
          },
        })
      }
    },
    *getTreePermission({ payload }: any, { call, put }: any) {
      const res = yield call(selectTreeLevelPermission, payload)
      yield put({
        type: 'saveRegions',
        payload: res.regions,
      })
    },
    *save({ payload }: any, { call, put }: any) {
      yield call(saveBuilding, payload)
    },
    *delete({ payload }: any, { call, put }: any) {
      yield call(deleteBuilding, payload)
    },
  },

  reducers: {
    saveBuildings(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      }
    },
    saveRegions(state: any, { payload }: any) {
      return {
        ...state,
        regions: payload,
      }
    },
    saveBuildingList(state: any, { payload }: any) {
      return { ...state, buildingList: payload }
    },
  },
}

export default BuildingModel
