/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
/* eslint-disable */

import { extend } from 'umi-request'
import { notification, message } from 'antd'
import isPlainObject from 'lodash/isPlainObject'
import { history } from 'umi'

const codeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '请求参数错误',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response = {}, data } = error
  const status: number = response.status
  const errortext = codeMessage[status] || response.statusText

  if (status === 401 || status === 403) {
    notification.warn({
      message: '身份验证失败',
      description: '未登录或登录信息已过期，请重新登录。',
    })
    history.push('/user/login')
    localStorage.removeItem('token')
    throw error
  }

  message.error(data ? data.message : errortext || '请求出错')
  throw error
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  timeout:180000,
  credentials: 'same-origin', // 默认请求是否带上cookie
})

request.interceptors.request.use((url, options: any) => {
  const newOptions = {
    ...options,
    headers: {
      // Platform: 'ROBOT',
      // PROJECT_ID: PROJECT_ID,
    },
    interceptors: true,
  }

  newOptions.headers.Authorization = localStorage.getItem('token')
  const developerId = localStorage.getItem('developerId')
  const roleId = localStorage.getItem('roleId')
  if (options.headers.autoDeveloperID !== '0') {
    if (newOptions.params) {
      newOptions.params.developerId = developerId
      newOptions.params.roleId = roleId
    }
    if (isPlainObject(newOptions.data)) {
      newOptions.data.developerId = developerId
      newOptions.data.roleId = roleId
    }
  }
  return { options: newOptions }
})

export default request
