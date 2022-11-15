import React from 'react'
import moment from 'moment'
import HorizontalTimeline from '@/components/HorizontalTimeline'

const TimelineItem = HorizontalTimeline.Item

const HOST_LIFECYCLE = {
  INSTALL: '安装激活',
  REACTIVEINSTALL: '重置激活',
  DISMANTLE: '拆除',
  CHANGE: '更换',
  REPAIR: '报修',
  BIND: '用户绑定',
  FACTORY: '出厂',
  SCRAP: '报废',
  REPAIRING: '维修中',
  REPAIRED: '维修完成',
  REWORK: '维修中',
  UNBIND: '解散家庭组',
}

const renderLifecycle = function(lifecycle) {
  const getDescription = item => {
    const time = moment(item.createdTime).format('YYYY-MM-DD HH:mm')
    // if (item.type === 'INSTALL') {
    return (
      <div>
        {'操作人员：' + item.name}
        <div>{time}</div>
      </div>
    )
    // }
    // return time
  }

  return (
    <HorizontalTimeline>
      {lifecycle &&
        lifecycle.map((item, index) => {
          return (
            <TimelineItem
              key={index}
              title={HOST_LIFECYCLE[item.type]}
              description={getDescription(item)}
            />
          )
        })}
    </HorizontalTimeline>
  )
}

export default renderLifecycle
