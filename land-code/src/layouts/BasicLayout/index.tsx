/*
 * @Author: fuRan NgeKaworu@gmail.com
 * @Date: 2022-10-26 11:22:14
 * @LastEditors: fuRan NgeKaworu@gmail.com
 * @LastEditTime: 2022-10-27 14:24:13
 * @FilePath: /newhome-web/src/layouts/BasicLayout/index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by fuRan NgeKaworu@gmail.com, All Rights Reserved.
 */
import React from 'react'
import ProLayout, { BasicLayoutProps, PageContainer, MenuDataItem } from '@ant-design/pro-layout'
import { Link, useModel, history } from 'umi'
import RightContent from '@/components/RightContent'
import Footer from '@/components/Footer'
import { formatMessage } from './intl'
import ErrorBoundary from './ErrorBoundary'
import { WithExceptionOpChildren } from './Exception'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export default function BasicLayout(props: any) {
  const { children, route, location, ...restProps } = props
  const { initialState, loading } = useModel('@@initialState')
  // const { setMasterState } = useModel('@@qiankunStateForSlave')
  const currentUser = initialState?.currentUser

  // useEffect(() => {
  //   setMasterState(data => ({ ...data, currentUser }))
  // }, [currentUser])

  const layoutRestProps: BasicLayoutProps & {
    rightContentRender?:
      | false
      | ((props: BasicLayoutProps, dom: React.ReactNode, config: any) => React.ReactNode)
  } = {
    // itemRender: route => <Link to={route.path}>{route.breadcrumbName}</Link>,
    ...initialState?.settings,
    ...restProps,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ProLayout
        location={location}
        route={route}
        loading={loading}
        onMenuHeaderClick={e => {
          e.stopPropagation()
          e.preventDefault()
          history.push('/')
        }}
        rightContentRender={() => <RightContent />}
        footerRender={() => <Footer />}
        formatMessage={formatMessage}
        menuDataRender={(menuData: MenuDataItem[]) => initialState?.menuData || menuData}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom
          }
          if (menuItemProps.path) {
            return <Link to={menuItemProps.path}>{defaultDom}</Link>
          }
          return defaultDom
        }}
        breadcrumbRender={(routers = []) => {
          return [
            {
              path: '/',
              breadcrumbName: '首页',
              component: true,
            },
            ...routers,
          ]
        }}
        itemRender={(route: any) =>
          route.component ? (
            <Link to={route.path}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          )
        }
        {...layoutRestProps}
        menuHeaderRender={(logo, title) => (
          <div
            id="customize_menu_header"
            style={{ display: 'flex', height: 45, flexDirection: 'row' }}
          >
            {logo}
            {title}
          </div>
        )}
      >
        <ErrorBoundary>
          <WithExceptionOpChildren pathname={location.pathname}>
            <PageContainer>{children}</PageContainer>
          </WithExceptionOpChildren>
        </ErrorBoundary>
      </ProLayout>
    </QueryClientProvider>
  )
}
