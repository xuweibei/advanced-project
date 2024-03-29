/*
 * @Author: biu
 * @Date: 2020-11-20 13:42:42
 * @LastEditTime: 2020-12-03 13:22:42
 * @Description: 运行时配置
 */
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import React, { useState } from 'react'
import { history } from 'umi'
import { Settings as LayoutSettings, PageLoading, MenuDataItem } from '@ant-design/pro-layout'
import IconMap from '@/assets/menuicons'

import { getUserPermissionsByUserId, queryCurrent } from './services/api'
import defaultSettings from '../defaultSettings'
import { arrayToTree, DEFAULT_AVATAR_URL } from './utils/utils'

console.log('%c当前版本：' + VERSION, 'color:#1890ff')

window.SYS_SCENE = 'land'
localStorage.setItem('SYS_SCENE', window.SYS_SCENE)

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
}

// 根据用户角色信息获取菜单配置
const getMenuDataFromPermissions = (permissions: API.Permission[] = []): MenuDataItem[] => {
  // 处理国际化 key 和图标
  permissions.sort((a, b) => a.sort - b.sort)
  
  permissions.forEach(item => {
    item.icon = IconMap[item.icon]
    item.component = item.isLeafNode
  })
  // permissions.map(item => {
  //   item.icon = IconMap[item.icon]
  //   if (!item.pid) {
  //     // 父级菜单国际化 key 拼上行业前缀
  //     item.name = `${window.SYS_SCENE}.${item.name}`
  //   }
  //   return item
  // })
  // return arrayToTree(permissionsWithIcon, {
  //   parentKey: 'pid',
  // })
  const data = arrayToTree(permissions, {
    parentKey: 'pid',
  })

  console.log(permissions, 'permissions')
  console.log(data, 'data')
  return data
}

export const getInitialState = async (): Promise<{
  settings: LayoutSettings
  currentUser?: API.CurrentUser
  menuData?: MenuDataItem[]
  permissions?: API.Permission[]
}> => {
  const query = history.location.query || {}
  const { unitoken } = query
  let token
  if (unitoken) {
    token = unitoken
    localStorage.setItem('token', unitoken as string)
  } else {
    token = localStorage.getItem('token')
  }

  if (token && history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent()
      let permissions: API.Permission[] = []
      if (currentUser) {
        currentUser.avatar = currentUser.avatar || DEFAULT_AVATAR_URL
        localStorage.setItem('developerId', '' + currentUser.developerId)
        localStorage.setItem('roleId', '' + currentUser.roleId)
        permissions = await getUserPermissionsByUserId(currentUser.roleId)
        currentUser.permissions = permissions
          .map(permission => ({
            ...permission,
            // children: permissions.find(item => item.pid === permission.id),
            isLeafNode: permissions.every((item: any) => item.pid !== permission.id),
          }))
          .sort((a, b) => a.sort - b.sort)
      }
      return {
        currentUser,
        menuData: getMenuDataFromPermissions(currentUser.permissions),
        settings: defaultSettings,
      }
    } catch (err) {
      return {
        settings: defaultSettings,
      }
    }
  }
  return {
    settings: defaultSettings,
  }
}

// export const useQiankunStateForSlave = () => {
//   const [masterState, setMasterState] = useState({})

//   return {
//     masterState,
//     setMasterState,
//   }
// }
