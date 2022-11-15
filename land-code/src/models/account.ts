import { saveUser, queryUserList, removeUser } from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface AccountModelState {
  data: {
    list: any
    pagination: any
  }
}
export interface AccountModelType {
  namespace: 'account'
  state: AccountModelState
  effects: {
    fetch: Effect
    remove: Effect
    create: Effect
    update: Effect
  }
  reducers: {
    saveUser: Reducer<AccountModelState>
  }
}

const AccountModel: AccountModelType = {
  namespace: 'account',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload = { page: 1, page_size: 10 } }, { call, put }: any) {
      const res = yield call(queryUserList, payload)
      const { page, page_size } = payload
      yield put({
        type: 'saveUser',
        payload: {
          list: res.results.filter((item: any) => item.id !== 1),
          pagination: {
            total: res.count,
            pageSize: page_size,
            current: page,
          },
        },
      })
    },

    *remove({ payload }: any, { call, put }: any) {
      yield call(removeUser, payload)
      yield put({
        type: 'fetch',
      })
    },
    //弃用
    // *create({ payload }: any, { call, put }: any) {
    //   yield call(saveUser, payload)
    //   yield put({
    //     type: 'fetch',
    //   })
    // },

    // *update({ payload }: any, { call, put }: any) {
    //   yield call(saveUser, payload)
    //   yield put({
    //     type: 'fetch',
    //   })
    // },
  },

  reducers: {
    saveUser(state: any, { payload }: any) {
      return {
        ...state,
        data: payload,
      }
    },
  },
}

export default AccountModel
