import { Settings as LayoutSettings } from '@ant-design/pro-layout'

const Settings: LayoutSettings & {
  pwa?: boolean
  logo?: string
} = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  menu: { locale: true },
  // title: '地产云互联网管理平台',
  title: 'NewHome数字地产云管理系统',
  pwa: false,
  iconfontUrl: '',
  colorWeak: false,
}

export default Settings
