import { queryRoles, removeRole, addRole, updateRole } from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface RoleModelState {
  list: any
}
export interface RoleModelType {
  namespace: 'role'
  state: RoleModelState
  effects: {
    fetch: Effect
    remove: Effect
    create: Effect
    update: Effect
  }
  reducers: {
    saveRoles: Reducer<RoleModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const RoleModel: RoleModelType = {
  namespace: 'role',

  state: {
    list: [],
  },

  effects: {
    *fetch(_: any, { call, put }: any) {
      const res = yield call(queryRoles)
      yield put({
        type: 'saveRoles',
        payload: res,
      })
    },
    *remove({ payload }: any, { call, put }: any) {
      yield call(removeRole, payload)
      yield put({
        type: 'fetch',
      })
    },
    *create({ payload }: any, { call, put }: any) {
      yield call(addRole, payload)
      yield put({
        type: 'fetch',
      })
    },
    *update({ payload }: any, { call, put }: any) {
      const { id, values } = payload
      yield call(updateRole, id, values)
      yield put({
        type: 'fetch',
      })
    },
  },

  reducers: {
    saveRoles(state: any, { payload }: any) {
      return {
        ...state,
        list: payload,
      }
    },
  },
}

export default RoleModel
