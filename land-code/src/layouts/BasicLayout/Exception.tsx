import React from 'react'
import { Result, Button } from 'antd'
import { history, useModel, Redirect } from 'umi'
import { pathToRegexp } from 'path-to-regexp'
import { havePermission } from '@/utils/utils'

import { formatMessage } from './intl'

function backToHome() {
  history.push('/')
}

const Exception404 = () => (
  <Result
    status="404"
    title="404"
    subTitle={formatMessage({ id: 'layout.global.error.404' })}
    extra={
      <Button type="primary" onClick={backToHome}>
        {formatMessage({ id: 'layout.global.backhome' })}
      </Button>
    }
  />
)

const Exception500 = () => (
  <Result
    status="500"
    title="500"
    subTitle={formatMessage({ id: 'layout.global.error.500' })}
    extra={
      <Button type="primary" onClick={backToHome}>
        {formatMessage({ id: 'layout.global.backhome' })}
      </Button>
    }
  />
)

const Exception403 = () => (
  <Result
    status="403"
    title="403"
    subTitle={formatMessage({ id: 'layout.global.error.403' })}
    extra={
      <Button type="primary" onClick={backToHome}>
        {formatMessage({ id: 'layout.global.backhome' })}
      </Button>
    }
  />
)

/**
 * 异常路由处理组件
 * - 无权限
 * - 404
 */
const WithExceptionOpChildren: React.FC<{
  pathname: string
  children: any
}> = props => {
  const { children, pathname } = props
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  if (!currentUser) {
    // 没有登录
    return <Redirect to="/user/login" />
  }
  if (pathname === '/') {
    // 重定向第一个有权限的子路由
    const premission = currentUser.permissions.find(permission => !!permission.pid)
    return premission ? <Redirect to={premission.path} /> : null
  }

  if (pathname === '/personal') {
    return children
  }

  // const permission = havePermission(currentUser.permissions, pathname)

  // if (!permission) {
  //   return <Exception404 />
  // }

  return children
}

export { Exception404, Exception403, Exception500, WithExceptionOpChildren }
