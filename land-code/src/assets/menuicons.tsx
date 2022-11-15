/*
 * @Author: biu
 * @Date: 2020-11-22 14:03:44
 * @LastEditTime: 2021-08-03 15:38:18
 * @Description: 菜单栏图标
 */
import React, { ReactNode } from 'react'
import {CommodityManagementSvg,OrderSvg,AccountManagementSvg } from './svg/svg'
import {
  UserOutlined,
  DashboardOutlined,
  HddOutlined,
  VideoCameraOutlined,
  SnippetsOutlined,
  ContactsOutlined,
  SettingOutlined,
  PhoneOutlined,
  SolutionOutlined,
} from '@ant-design/icons'

const ICON_MAP: { [icon: string]: ReactNode } = {
  dashboard: <DashboardOutlined />,
  information: <SnippetsOutlined />,
  operate: <ContactsOutlined />,
  parking: <VideoCameraOutlined />,
  account: <UserOutlined />,
  host: <HddOutlined />,
  setting: <SettingOutlined />,
  cloudIntercom: <PhoneOutlined />,
  construction:<PhoneOutlined />,
  property: <SolutionOutlined />,
  commodity:<CommodityManagementSvg/>,
  order:<OrderSvg/>,
  report:<AccountManagementSvg/>
}
export default ICON_MAP
