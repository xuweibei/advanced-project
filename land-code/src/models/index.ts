/*
 * @Author: biu
 * @Date: 2020-11-20 13:15:20
 * @LastEditTime: 2020-11-20 14:13:59
 * @Description: Model 示例代码
 */

import { Effect, ImmerReducer, Reducer, Subscription } from 'umi'

// state 类型定义
export interface IndexModelState {
  name: string
}

// model 类型定义
export interface IndexModelType {
  state: IndexModelState
  effects: {
    query: Effect
  }
  reducers: {
    // save: Reducer<IndexModelState>

    // 启用 immer 之后
    save: ImmerReducer<IndexModelState>
  }
  subscriptions: { setup: Subscription }
}

const IndexModel: IndexModelType = {
  state: {
    name: 'World',
  },
  effects: {
    *query({ payload }, { call, put }) {},
  },
  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     ...action.payload,
    //   }
    // },

    // 启用 immer 之后
    save(state, action) {
      state.name = action.payload
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          // 进入到页面后会自动调用
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },
}
export default IndexModel
