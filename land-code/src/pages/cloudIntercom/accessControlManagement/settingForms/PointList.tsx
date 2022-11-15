import React, { useEffect, useState } from 'react'
import { Input, Tree } from 'antd'
import styles from './index.less'
//接口
import { getDeviceHierarchyList } from '@/services/api'
import { getStrCount } from '@/utils/utils'

const { Search } = Input

interface device {
  communityId: number
  setSelectPoints: any
  selectPoints: any
}

//处理树形结构所需数组格式
const formatTreeData = (data: any[]) => {
  let options: any[] = []
  data &&
    data.forEach((community: any) => {
      let blockArray: any[] = []
      let communityData = {
        key: community.buildingId,
        title: community.buildingName,
        children: blockArray,
      }
      options.push(communityData)
      community.blockList.forEach((block: any) => {
        let unitArray: any[] = []
        let blockData = {
          key: block.id,
          title: block.blockName,
          children: unitArray,
        }
        blockArray.push(blockData)
        block.unitList.forEach((unit: any) => {
          let deviceArray: any[] = []
          let unitData = {
            key: unit.id,
            title: unit.unitName,
            children: deviceArray,
          }
          unitArray.push(unitData)
          unit.nbDoorDeviceList.forEach((device: any) => {
            let deviceData = {
              key: device.id,
              title: device.deviceName,
            }
            deviceArray.push(deviceData)
          })
        })
      })
    })
  return options
}

//将四维数组format为一维数组
const getOneFloorData = (data: any[]) => {
  const dataList: any[] = []
  const getDataList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { key, title } = node
      dataList.push({ key, title: title })
      if (node.children) {
        getDataList(node.children)
      }
    }
  }
  getDataList(data)
  return dataList
}

const PointList = (props: device) => {
  const [treedevices, setTreedevices] = useState<any[]>([])
  const [dataList, setDataList] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState<any>({})
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const { communityId, selectPoints, setSelectPoints } = props

  useEffect(() => {
    let data = {
      buildingId: communityId,
    }
    getDeviceHierarchyList(data).then(res => {
      //获取格式化后的树形数据
      const treedata = formatTreeData([res])
      setTreedevices(treedata)
      //获取一维数组以实现搜索
      setDataList(getOneFloorData(treedata))
    })
  }, [communityId])

  //选择业主
  const onCheck = (checkedKeys?: React.Key[], info?: any) => {
    let selectdeviceId: any[] = []
    const selectData = info.checkedNodesPositions
    //遍历check info，判断出业主所在层级，过滤掉所有不需要的父级
    selectData.forEach((item: any) => {
      const pos = getStrCount(item.pos, '-')
      if (pos === 4) {
        selectdeviceId.push(item.node.key)
      }
    })
    setSelectPoints(selectdeviceId)
  }

  //获取查询的记录的父节点key
  const getParentKey = (key: any, tree: any): any => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item: any) => item.key === key)) {
          parentKey = node.key
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }

  //保存查询内容key
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  }

  //查询框onchange
  const onChange = (e: any) => {
    const { value } = e.target
    if (value) {
      const expandedKeys =
        dataList &&
        dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, treedevices)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(item) === i)
      setExpandedKeys(expandedKeys)
      setSearchValue(value)
      setAutoExpandParent(true)
    }
  }

  //处理查询到的结果，并标红
  const loop = (data: any) =>
    data.map((item: any) => {
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className={styles.siteTreeSearchValue}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        )
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) }
      }

      return {
        title,
        key: item.key,
      }
    })

  return (
    <>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        checkedKeys={selectPoints}
        onCheck={onCheck}
        treeData={loop(treedevices)}
      />
    </>
  )
}

export default PointList
