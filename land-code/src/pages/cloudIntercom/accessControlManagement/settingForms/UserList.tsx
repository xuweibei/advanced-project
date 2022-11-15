import React, { useEffect, useState } from 'react'
import { Input, Tree } from 'antd'
import styles from './index.less'
//接口
import { getUserHierarchyList } from '@/services/api'
import { getStrCount } from '@/utils/utils'

const { Search } = Input

interface User {
  communityId: number
  setSelectUsers: any
  selectUsers: any
}

//处理树形结构所需数组格式
const formatTreeData = (data: any[]) => {
  let options: any[] = []
  data &&
    data.forEach((community: any) => {
      let blockArray: any[] = []
      let communityData = {
        key: community.buildingId + community.buildingName,
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
          let roomArray: any[] = []
          let unitData = {
            key: unit.id,
            title: unit.unitName,
            children: roomArray,
          }
          unitArray.push(unitData)
          //按孔冲新的数据结构，此处需要将kvjson转为数组
          const roomList =
            unit &&
            unit.roomMapUsers &&
            Object.entries(unit.roomMapUsers).map(([key, value]) => ({
              key,
              value,
            }))
          roomList &&
            roomList.forEach((room: any) => {
              let userArray: any[] = []
              let roomData = {
                key: room.key + '-' + unit.id,
                title: room.key,
                children: userArray,
              }
              roomArray.push(roomData)
              room.value.forEach((user: any) => {
                let userData = {
                  key: user.employeeNo + '-' + user.id,
                  title: user.userName,
                }
                userArray.push(userData)
              })
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

const UserList = (props: User) => {
  const [treeUsers, setTreeUsers] = useState<any[]>([])
  const [dataList, setDataList] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState<any>('')
  const [expandedKeys, setExpandedKeys] = useState<any[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const { communityId, selectUsers, setSelectUsers } = props

  console.log('selectUsers',selectUsers);
  // console.log('setSelectUsers',setSelectUsers);


  useEffect(() => {
    let data = {
      buildingId: communityId,
    }
    getUserHierarchyList(data).then(res => {
      //获取格式化后的树形数据
      const treedata = formatTreeData([res])
      setTreeUsers(treedata)
      //获取一维数组以实现搜索
      setDataList(getOneFloorData(treedata))
    })
  }, [communityId])

  //处理树形选择所需数据

  //选择业主
  const onCheck = (checkedKeys?: React.Key[], info?: any) => {
    let selectUserId: any[] = []
    const selectData = info.checkedNodesPositions
    //遍历check info，判断出业主所在层级，过滤掉所有不需要的父级
    // selectData.forEach((item: any) => {
    //   const pos = getStrCount(item.pos, '-')
    //   console.log('pos',pos);
    //   if (pos === 5) {
    //     selectUserId.push(item.node.key)
    //   }
    // })

    const ids = selectData.filter((item:any)=>{ return  (!item.node.children) ||  item.node.children && item.node.children.length == 0 }).map((item:any)=>{ return item.node.key })

    setSelectUsers(ids)
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
    const { value } = e.target;
    if (value != '') {
      const expandedKeys =
        dataList &&
        dataList
          .map(item => {
            if (item.title.indexOf(value) > -1) {
              return getParentKey(item.key, treeUsers)
            }
            return null
          })
          .filter((item, i, self) => item && self.indexOf(item) === i)
      setExpandedKeys(expandedKeys)
      setSearchValue(value)
      setAutoExpandParent(true)
    } else {
      setExpandedKeys([])
      setSearchValue('')
      setAutoExpandParent(false)
      setSelectUsers([])
    }
  }

  let mapTree = (value: any, arr: any) => {
    // console.log('value---',value,'arr---',arr);
    
    let newarr: any = [];
    arr.forEach((element: any) => {
      if (element.strTitle.indexOf(value) > -1) {
        // 判断条件
        newarr.push(element);
      } else {
        if (element.children && element.children.length > 0) {
          let redata = mapTree(value, element.children);
          if (redata && redata.length > 0) {
            let obj = {
              ...element,
              children: redata,
            };
            newarr.push(obj);
          }
        }
      }
    });
    return newarr;
  };


  //处理查询到的结果，并标红
  const loop = (data: any) =>
    {
      let crr = data.map((item: any) => {
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
          return { strTitle: item.title,title, key: item.key, children: loop(item.children) }
        }
  
        return {
          title,
          key: item.key,
          strTitle: item.title
        }
      })

      // console.log("searchValue = ", searchValue)
      let drr = mapTree(searchValue, crr);
      // console.log("drr = ", drr)
      return drr;

    }

  return (
    <>
      <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} allowClear />
      <Tree
      style={{maxHeight: 360,overflowY:'scroll'}}
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={selectUsers}
        treeData={loop(treeUsers)}
      />
    </>
  )
}

export default UserList
