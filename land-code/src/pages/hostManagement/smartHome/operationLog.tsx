import React, { useEffect, useState } from 'react'

import StandardTable from '@/components/StandardTable'
import { getHostInfo, queryExecutionHistoryByHomeId } from '@/services/api'
import moment from 'moment'

const OperationLog = (props: any) => {
  const { homeId } = props
  const [recordArrList, setRecordArrList] = useState<any>()
  const [hostTotalInfo, setHostTotalInfo] = useState<any>()

  useEffect(() => {
    if (homeId) {
      getHostInfo(homeId).then((res: any) => {
        saveTotalInfo(res.homeConfig.data)
      })
    }
  }, [homeId])

  useEffect(() => {
    if (homeId) {
      queryExecutionHistoryByHomeId({ homeId, pageIndex: 1, pageCount: 10 }).then((res: any) => {
        if (res.code === 'err') {
          setRecordArrList({
            list: [],
            pagination: {
              total: 0,
              current: 1,
              pageSize: 10,
            },
          })
        } else {
          setRecordArrList({
            list: res.data.recordArr,
            pagination: {
              total: res.data.recordCount,
              current: 1,
              pageSize: 10,
            },
          })
        }
      })
    }
  }, [hostTotalInfo])
  const handleTableChange = (page: any) => {
    queryExecutionHistoryByHomeId({
      homeId,
      pageIndex: page.current,
      pageCount: page.pageSize,
    }).then((res: any) => {
      setRecordArrList({
        list: res.data.recordArr,
        pagination: {
          total: res.data.recordCount,
          current: page.current,
          pageSize: page.pageSize,
        },
      })
    })
  }

  const saveTotalInfo = (payload: any) => {
    let totalInfo = {
      groups: [],
      devices: [],
      scenes: [],
    }
    let groups: any = []
    let devices: any = []
    let scenes: any = []

    if (payload) {
      const { DEVICE_GROUP, PATTERN } = payload
      if (PATTERN && PATTERN.length) {
        scenes = PATTERN // 全局场景
      }
      if (DEVICE_GROUP) {
        DEVICE_GROUP.forEach((group: any) => {
          devices = devices.concat(group.DEVICE)
          scenes = scenes.concat(group.PATTERN)
          delete group.DEVICE
          delete group.PATTERN
          groups.push(group)
        })
      }
    }
    totalInfo.groups = groups
    totalInfo.devices = devices
    totalInfo.scenes = scenes

    setHostTotalInfo(totalInfo)
  }

  const getOperationContent = (record: any) => {
    if (!hostTotalInfo) {
      if (record.deviceId) {
        return `操作设备ID：${parseInt(record.deviceId, 10)}`
      }
      if (record.patternId) {
        return `操作场景ID：${parseInt(record.patternId, 10)}`
      }
    }
    const { devices } = hostTotalInfo
    const { scenes } = hostTotalInfo
    if (!devices && !scenes) {
      if (record.deviceId) {
        return `操作设备ID：${parseInt(record.deviceId, 10)}`
      }
      if (record.patternId) {
        return `操作场景ID：${parseInt(record.patternId, 10)}`
      }
    }
    if (record.patternId) {
      const patternId = parseInt(record.patternId, 10)
      const pattern = scenes && scenes.find((item: any) => item.PATTERN_ID === patternId)
      if (pattern) {
        return `${pattern.PATTERN_NAME}`
      } else {
        return `操作场景ID：${parseInt(record.patternId, 10)}`
      }
    }
    if (!devices || !record.deviceId) {
      if (record.deviceId) {
        return `操作设备ID：${parseInt(record.deviceId, 10)}`
      } else {
        return
      }
    }
    const deviceId = parseInt(record.deviceId, 10)
    const device = devices.find((item: any) => item.DEVICE_ID === deviceId)
    
    if (!device) {
      return `操作设备ID：${parseInt(record.deviceId, 10)}`
    }
    if (device.DEVICE_TYPE_ID == 73) {
      return `操作：${device.NAME}`
    }
    if (record['On/Off']) {
      // 开关控制
      return `${record['On/Off'] === '1' ? '打开' : '关闭'}${device.NAME}`
    }
    if (record.Brightness) {
      // 亮度控制
      return `设置${device.NAME}亮度：${parseInt(record.Brightness, 16)}`
    }
    if (record.Stop) {
      // 停止窗帘
      return `停止${device.NAME}`
    }
    if (record['Up/Down']) {
      // 打开/关闭 窗帘
      return `${record['Up/Down'] === '1' ? '打开' : '关闭'}${device.NAME}`
    }
    if (record.SetPoint) {
      // 温度控制
      return `设置${device.NAME}温度：${parseFloat(record.SetPoint)}`
    }
    if (record.Mode) {
      // 模式控制
      const { model } = device.DESCRIPTION
      if (!model) {
        return `设置${device.NAME}模式：${record.Mode}`
      }
      const m = model.find((item: any) => item.value === record.Mode)
      if (!m) {
        return `设置${device.NAME}模式：${record.Mode}`
      }
      return `设置${device.NAME}模式：${(m && m.name) || ''}`
    }
    if (record.FanSpeed) {
      // 风速控制
      const { speed } = device.DESCRIPTION
      if (!speed) {
        return `设置${device.NAME}风速：${record.FanSpeed}`
      }
      const s = speed.find((item: any) => item.value === record.FanSpeed)
      if (!s) {
        return `设置${device.NAME}风速：${record.FanSpeed}`
      }
      return `设置${device.NAME}风速：${(s && s.name) || ''}`
    }
    return `操作设备ID：${parseInt(record.deviceId, 10)}`
  }

  const columns = [
    {
      title: '操作人',
      dataIndex: 'execMobile',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '操作时间',
      dataIndex: 'time',
      ellipsis: true,
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '内容',
      dataIndex: 'encryptedHomeId',
      render: (text: any, record: any) => getOperationContent(record),
    },
    {
      title: '操作设备',
      dataIndex: 'platform',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: 'App 版本号',
      dataIndex: 'appVersion',
      render: (appVersion: any, record: any) =>
        appVersion ? `${record.appName || ''}${appVersion}` : '--',
    },
  ]
  return (
    <>
      <StandardTable
        showPagination={true}
        data={recordArrList}
        columns={columns}
        rowKey={(record: any, index: any) => index}
        onChange={handleTableChange}
      />
    </>
  )
}
export default OperationLog
