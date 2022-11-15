import React, { useCallback, useEffect, useState } from 'react'
import { Form, Menu, Tabs } from 'antd'

import styles from './index.less'
import { getPermission2Level } from '@/services/api'

import AccessControlGroup from './AccessControlGroup'
import AccessControlSetting from './AccessControlSetting'

const { SubMenu } = Menu
const { TabPane } = Tabs

const index = () => {
  const [area, setArea] = useState<any[]>([])
  const [currCommunityId, setCurrCommunityId] = useState<any>(null)

  useEffect(() => {
    getPermission2Level().then(res => {
      setArea(res.regions)
      setCurrCommunityId(res.regions[0].buildings[0].id)
    })
  }, [])

  //切换社区
  const areaMenu = () => {
    const handleClick = (e: any) => {
      setCurrCommunityId(e.key)
    }
    const defaultArea = area && area[0]
    const defaultBuilding = defaultArea && defaultArea.buildings[0]

    return (
      <>
        {defaultArea && defaultArea.id && (
          <Menu
            onClick={v => handleClick(v)}
            defaultSelectedKeys={[`${defaultBuilding && defaultBuilding.id}`]}
            defaultOpenKeys={[`${defaultArea && defaultArea.id}`]}
            style={{ width: '100%' }}
            mode="inline"
          >
            {area.map((areaItem: any) => (
              <SubMenu key={areaItem.id} title={areaItem.name}>
                {areaItem.buildings &&
                  areaItem.buildings.map((building: any) => (
                    <Menu.Item key={building.id}>{building.name}</Menu.Item>
                  ))}
              </SubMenu>
            ))}
          </Menu>
        )}
      </>
    )
  }

  return (
    <>
      <div className={styles.owner}>
        <div className={styles.menu}>
          <div className={styles.title}>全部区域</div>
          <div className={styles.menu_content}>{areaMenu()}</div>
        </div>
        <div className={styles.content}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="门禁分组" key="1">
              <AccessControlGroup currCommunity={currCommunityId} />
            </TabPane>
            <TabPane tab="门禁配置" key="2">
              <AccessControlSetting currCommunity={currCommunityId} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  )
}
export default index
