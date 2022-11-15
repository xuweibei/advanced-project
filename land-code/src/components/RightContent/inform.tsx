import React, { useCallback, useEffect, useState } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { history, useModel } from 'umi'
import { Badge, Dropdown, Tabs, Menu, message, notification, Button } from 'antd'
import { stringify } from 'querystring'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
import NoticeIcon from '../NoticeIcon'
import { getSelectMessage, unreadRecord, unreadAll } from '@/services/api'
import moment from 'moment'

const { TabPane } = Tabs

const Inform = (props: any) => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}
  const [unreadMsg, setUnreadMsg] = useState<any>({ notification: 4, message: 8 })
  // const [webSocket, setWebSocket] = useState<any>(null)
  const [allCount, setAllCount] = useState<any>(0)
  const [noticeData, setNoticeData] = useState<any>({})
  const { noticeState } = useModel('useNotice', model => ({
    noticeState: model.noticeState,
  }))

  useEffect(() => {
    if (currentUser) {
      getNoticeData()
    }
  }, [noticeState, currentUser])

  useEffect(() => {
    if (!currentUser) {
      return
    }
    let url = `${WEBSOCKET_URL}/newhomewss/ws/${currentUser?.id}`
    getNoticeData()
    // setWebSocket (new WebSocket(url))
    let webSocket = new WebSocket(url)

    webSocket.onopen = () => {
      console.log('websocket连接成功')
    }
    webSocket.onclose = () => {
      webSocket.close()
      console.log('websocket连接已关闭')
    }
    webSocket.onmessage = (res: any) => {
      if (res.data.indexOf('成功') != 2) {
        getNoticeData()
        openNotification(JSON.parse(res.data))
      }
    }
    webSocket.onerror = (res: any) => {
      console.log('websocket连接失败')
      // 打印失败的数据
      console.log(res)
    }
    return () => {
      webSocket.close()
    }
  }, [currentUser])

  const openNotification = (data: any) => {
    const key = `open${Date.now()}`
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => {
          // await unreadAll({
          //   actionId: data.actionId,
          //   actionType: data.actionType,
          //   receiverId: data.receiver,
          // })
          notification.close(key)
        }}
      >
        我知道了
      </Button>
    )
    const args: any = {
      message: data.content,
      description: '',
      duration: 6,
      key,
      btn,
      closeIcon: <></>,
      onClick: () => {
        // await unreadAll({
        //   receiverId: data.receiver,
        //   actionId: data.actionId,
        //   actionType: data.actionType,
        // })
        notification.close(key)
      },
      onClose: async () => {
        await getNoticeData()
      },
    }
    switch (data.actionType) {
      case 'MESSAGE_ACTION_HOME_ADD_AUDIT':
        // console.log(inform, 'informinforminform')
        // args.icon = <InfoCircleOutlined style={{ color: '#009BFF' }} />
        // args.description = (
        //   <div>
        //     <div>主题：{inform.appointmentTopic}</div>
        //     <div>
        //       时间：{moment(inform.appointmentStartTime).format('M月D日')}-
        //       {moment(inform.appointmentEndTime).format('HH:mm')}
        //     </div>
        //     <div>地点：{inform.meetingRoomName}</div>
        //   </div>
        // )
        break
    }
    notification.open(args)
  }

  const getNoticeData = async () => {
    let res = await getSelectMessage({
      pageIndex: 1,
      pageCount: 999,
      userId: currentUser?.id,
      sender: 'home',
      type: 3,
      readStatus: false,
    })

    setAllCount(res.count)
    let notificationList: Array<any> = []
    let messageList: Array<any> = []
    res.results.forEach((item: any) => {
      switch (item.type) {
        case 1:
          item.avater = require('../../assets/images/message.png')
          messageList.push(handleData(item))
          break
        case 3:
          item.avater = currentUser?.faceUrl
            ? currentUser?.faceUrl
            : require('../../assets/images/default_avatar.png')
          notificationList.push(handleData(item))
          break
      }
    })
    setNoticeData({ notification: [...notificationList], message: [...messageList] })
  }

  const handleData = (data: any) => {
    let res: any = []
    res.id = data.id
    res.actionId = data.actionId
    res.type = data.type
    res.actionType = data.actionType
    res.avatar = data.avater
    let inform = JSON.parse(data.actionParam)
    res.receiver = data.receiver
    res.buildingId = inform.buildingId
    res.regionId = inform.regionId

    let time = moment().valueOf() - moment(data.createdTime).valueOf()
    if (time < 1000 * 60 * 60 * 24) {
      time < 1000 * 60 * 60
        ? (res.datetime = `${Math.floor(time / (1000 * 60))}分钟前`)
        : (res.datetime = `${Math.floor(time / (1000 * 60 * 60))}小时前`)
    } else {
      res.datetime = `${Math.floor(time / (1000 * 60 * 60 * 24))}天前`
    }

    switch (data.actionType) {
      case 'MESSAGE_ACTION_HOME_ADD_AUDIT':
        res.title = `房屋认领`
        res.description = `认领人：${inform.phone}`
        res.content = `认领房屋：${inform.homeInfo}`
        res.timeRange = `认领时间：${data.createdTime}`
        break
    }
    return res
  }
  const handleNoticeClear = async (title: string, key: string) => {
    let items = { ...noticeData }

    if (key == 'notification') {
      await unreadAll({ sender: 'home', userId: currentUser?.id })
      items.notification = []
      setNoticeData(items)
    }
    if (key == 'message') {
      await unreadAll({ sender: 'home', userId: currentUser?.id })
      items.message = []
      setNoticeData(items)
    }
    getNoticeData()
    message.success(`${'清空了'} ${title}`)
  }
  const changeReadState = async (clickedItem: any): void => {
    await unreadRecord({
      id: clickedItem.id,
      readStatus: true,
    })
    if (clickedItem.type == 3)
      history.push(
        `/property-management/housingAudit?buildingId=${clickedItem.buildingId}&regionId=${clickedItem.regionId}`
      )
    getNoticeData()
  }

  return (
    <NoticeIcon
      className={styles.action}
      count={allCount}
      onItemClick={item => {
        changeReadState(item)
      }}
      clearText="清空"
      onClear={handleNoticeClear}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={noticeData.notification?.length || 0}
        list={noticeData.notification}
        title="通知"
        emptyText="你已查看所有通知"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={noticeData.message?.length || 0}
        list={noticeData.message}
        title="消息"
        emptyText="您已读完所有消息"
        showViewMore
      />
    </NoticeIcon>
  )
}

export default Inform
