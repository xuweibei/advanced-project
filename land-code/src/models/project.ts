import {
  deleteProject,
  getProjectList,
  getProjectDetailByProjectId,
  getHostListByProjectId,
  addProject,
  updateProject,
} from '@/services/api'

import { Effect, Reducer } from 'umi'
export interface ProjectModelState {
  projectPagList: any
  projectDetail: any
  hostList: any
}
export interface ProjectModelType {
  namespace: 'project'
  state: ProjectModelState
  effects: {
    fetch: Effect
    getProject: Effect
    delete: Effect
    save: Effect
    update: Effect
    getHostList: Effect
  }
  reducers: {
    saveProject: Reducer<ProjectModelState>
    saveProjectPagList: Reducer<ProjectModelState>
    // 启用 immer 之后
    // save: ImmerReducer<IndexModelState>;
  }
}

const ProjectModel: ProjectModelType = {
  namespace: 'project',

  state: {
    projectPagList: {
      list: [],
      pagination: {},
    },
    projectDetail: {},
    hostList: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }: any, { call, put }: any) {
      const res = yield call(getProjectList, payload)
      yield put({
        type: 'saveProjectPagList',
        payload: {
          list: res.results,
          pagination: {
            total: res.count,
            current: payload.pageIndex,
            pageSize: payload.pageCount,
          },
        },
      })
    },
    *getProject({ payload }: any, { call, put }: any) {
      const res = yield call(getProjectDetailByProjectId, payload)
      yield put({
        type: 'saveProject',
        payload: {
          projectDetail: res ? res : {},
        },
      })
    },
    *save({ payload }: any, { call, put }: any) {
      yield call(addProject, payload)
      yield put({
        type: 'fetch',
        payload: {
          pageIndex: 1,
          pageCount: 12,
        },
      })
    },
    *update({ payload }: any, { call, put }: any) {
      yield call(updateProject, payload)
      yield put({
        type: 'fetch',
        payload: {
          pageIndex: 1,
          pageCount: 12,
        },
      })
    },
    *getHostList({ payload }: any, { call, put }: any) {
      const res = yield call(getHostListByProjectId, payload)
      yield put({
        type: 'saveProject',
        payload: {
          hostList: {
            list: res.results,
            pagination: {
              total: res.count,
              current: payload.page,
              pageSize: payload.page_size,
            },
          },
        },
      })
    },
    *delete({ payload }: any, { call, put }: any) {
      yield call(deleteProject, payload)
      yield put({
        type: 'fetch',
        payload: {
          pageIndex: 1,
          pageCount: 12,
        },
      })
    },
  },

  reducers: {
    saveProject(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      }
    },
    saveProjectPagList(state: any, { payload }: any) {
      return { ...state, projectPagList: payload }
    },
  },
}

export default ProjectModel
