/*
 * @Author: your name
 * @Date: 2020-08-04 13:15:33
 * @LastEditTime: 2020-12-18 13:14:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /bigdata/src/pages/HostManager/HostDetail/VersionLog.js
 */
import React, { useEffect, useCallback, useState } from 'react'
import StandardTable from '@/components/StandardTable'
import useApiLoading from '@/hooks/useApiLoading'
import { queryPackageHistoryByHomeId } from '@/services/api'

export default function VersionLog(homeId: any) {
  const [versionRecords, setversionRecords] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 10 })
  const { api, loading } = useApiLoading(queryPackageHistoryByHomeId)

  useEffect(() => {
    var args = { ...pagination, ...homeId }
    api(args).then(res => {
      setversionRecords({
        list: res.results,
        pagination: {
          total: res.count,
          current: pagination.pageIndex,
          pageSize: pagination.pageSize,
        },
      })
    })
  }, [pagination])

  const onTableChange = useCallback((pagination: any) => {
    setPagination({ pageIndex: pagination.current, pageSize: pagination.pageSize })
  }, [])
  const columns = [
    {
      title: '升级前版本号',
      dataIndex: 'beforeVersion',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '升级后版本号',
      dataIndex: 'afterVersion',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '操作人',
      dataIndex: 'createUserName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '升级途径',
      dataIndex: 'upgradeWay',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '升级时间',
      dataIndex: 'time',
      render: (text: any) => (text ? text : '--'),
    },
    // {
    //   title: '备注',
    //   dataIndex: 'reason',
    //   render: (text:any) => text ? text : '--'
    // }
  ]

  return (
    <div>
      <StandardTable
        rowKey={(record: any, index: number) => `complete${record.id}${index}`}
        loading={loading}
        data={versionRecords}
        columns={columns}
        onChange={onTableChange}
      />
    </div>
  )
}
