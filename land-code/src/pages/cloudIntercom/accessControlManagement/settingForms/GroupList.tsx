import React, { useCallback, useEffect, useState } from 'react'
import { Table, Divider, Row, Col, Input, Button } from 'antd'
import StandardTable from '@/components/StandardTable'
//接口
import { queryPermissionGroup } from '@/services/api'

interface Group {
  communityId: number
  selectGroups: any
  setSelectGroups: any
}

const GroupList = (props: Group) => {
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<any>()
  const { communityId, selectGroups, setSelectGroups } = props

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 9999 }) => {
      setLoading(true)
      if (communityId) {
        let data = {
          ...pagination,
          buildingId: communityId,
        }
        queryPermissionGroup(data)
          .then(res => {
            setLoading(false)
            setData(
              res.results
            )
          })
          .catch(e => {
            console.log('获取失败', e)
          })
      }
    },
    [communityId]
  )

  useEffect(() => {
    fetch()
    // console.log(selectGroups, 'selectGroupsselectGroups')
  }, [fetch])

  const columns = [
    {
      title: '门组名称',
      dataIndex: 'groupName',
      render: (text: any) => (text ? text : '--'),
    },
  ]

  // const handleTableChange = (query: any) => {
  //   fetch({
  //     page: query.current,
  //     page_size: query.pageSize,
  //   })
  // }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      setSelectGroups(selectedRowKeys)
    },
    // getCheckboxProps: (record: any) => ({
    //   id: record.groupId, // Column configuration not to be checked
    //   name: record.groupName,
    // }),
    selectedRowKeys: selectGroups,
  }
  const onSearch = () => {
    setLoading(true)
    if (communityId) {
      let data = {
        page: 1,
        page_size: 9999,
        buildingId: communityId,
        groupName:searchText
      }
      queryPermissionGroup(data)
          .then(res => {
            setLoading(false)
            setData(
              res.results
            )
          })
          .catch(e => {
            console.log('获取失败', e)
          })
    }
    setLoading(false)
  }

  console.log(data, 'datadatadata')
  return (
    <>
      <Row>
        <Col span={19}>
          <Input onChange={e=> setSearchText(e.target.value)}></Input>
        </Col>
        <Col span={5}>
          <Button onClick={onSearch} type="primary">
            搜索
          </Button>
        </Col>
      </Row>
      {data && (
        <Table
          // loading={loading}
          rowKey={(record: any) => record.groupId}
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
        />
      )}
    </>
  )
}

export default GroupList
