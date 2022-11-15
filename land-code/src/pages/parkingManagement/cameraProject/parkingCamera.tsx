import React, { PureComponent, useState, useEffect, useCallback, FC } from 'react'
import { Input, Button, List, Checkbox, Alert, DatePicker, Modal, message } from 'antd'
import { connect } from 'dva'
import { Link } from 'umi'
import moment from 'moment'
import styles from './parkingCamera.less'
import EZUIPlayer from '../../../components/YSPlayer/EZUIPlayer'
import { getParkingDetailById, getMovingMonitorRecords } from '../../../services/api'

const { RangePicker } = DatePicker

const parkingCamera = (props: any) => {
  const [parkingDetail, setParkingDetail] = useState<any>()
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [total, setTotal] = useState<number>()
  const [begin, setBegin] = useState<any>()
  const [end, setEnd] = useState<any>()
  const [recordList, setRecordList] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<any>([moment().startOf('day'), moment()])
  const [queryData, setQueryData] = useState<any>({
    dateRange: [moment().startOf('day'), moment()],
  })
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 8 })
  const currParkingId = props.match.params.id

  useEffect(() => {
    const initParkingDetail = async (id: any) => {
      await getParkingDetailById(id)
        .then(res => {
          setParkingDetail(res)
        })
        .catch(e => {
          message.error('获取当前项目详情失败', e)
        })
    }
    if (currParkingId) {
      initParkingDetail(currParkingId)
    }
  }, [currParkingId])

  useEffect(() => {
    setLoadingStatus(true)
    if (parkingDetail) {
      let data = {
        deviceSerial: parkingDetail.monitorNo,
        beginDate: queryData.dateRange[0].valueOf(),
        endDate: queryData.dateRange[1].valueOf(),
        page: pagination.current,
        pageSize: pagination.pageSize,
      }
      getMovingMonitorRecords(data)
        .then(res => {
          setLoadingStatus(false)
          setRecordList(res.results)
          setTotal(res.count)
        })
        .catch(e => {
          console.log('获取列表出错', e)
        })
    }
  }, [queryData, parkingDetail, pagination])

  const onPaginationChange = (pages: number, pageSize: number) => {
    setPagination({ current: pages, pageSize: pageSize })
    setQueryData({ ...queryData })
  }

  const onClickRecord = (item: any) => {
    setBegin(item.startTimeMillis)
    setEnd(item.endTimeMillis)
    setShowModal(true)
  }

  const renderRecordItem = (item: any) => {
    // 总时长毫秒
    const duration = (item.endTimeMillis - item.startTimeMillis) / 1000
    const formatText = parseInt(duration / 60) + ':' + ('' + (duration % 60)).padStart(2, '0')
    return (
      <List.Item>
        <div className={styles.record} onClick={() => onClickRecord(item)}>
          <img src={require('../../../assets/img/u11.png')} />
          <div className={styles.time}>
            <span>时间: {item.startTime}</span>
            <span>{formatText}</span>
          </div>
        </div>
      </List.Item>
    )
  }
  /**
   * fix: 同时播放多个画面时，如果取消前面的摄像头，会导致画面限制不正确，表现为整体前移
   *
   * list 使用 dataSource 中 item 的 key 作为 List.item 的 key，没有则用下标
   * 这里需要以每个摄像头的 id 作为 key，这样在调整播放的摄像头时，才能正常的切换画面
   */
  // selectedCameras.forEach(item => (item.key = item.id))

  const search = () => {
    let data = {
      dateRange: dateRange,
    }
    setPagination({ current: 1, pageSize: 8 })
    setQueryData(data)
  }
  return (
    <>
      <div className={styles.realtime}>
        <div className={styles.playArea}>
          <Alert
            message="仅支持无线车位设备"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
          {parkingDetail && <EZUIPlayer deviceSerial={parkingDetail.monitorNo} height={300} />}
          <div className={styles.cameraInfo}>
            <span>车位号：{parkingDetail && parkingDetail.placeNo}</span>
            <span>所属用户：{parkingDetail && parkingDetail.roomNo}</span>
          </div>
        </div>
      </div>
      <div className={styles.movingMonitor}>
        <div className={styles.filter}>
          <div>
            <span className={styles.marginRight}>记录时间:</span>
            <RangePicker
              disabledDate={currentDate => currentDate.isAfter(moment())}
              allowClear={false}
              onChange={dateRange => setDateRange(dateRange)}
              showTime
              value={dateRange}
              className={styles.marginRight}
            />
          </div>
          <Button type="primary" className={styles.marginRight} onClick={() => search()}>
            查询
          </Button>
        </div>
        <List
          loading={loadingStatus}
          grid={{ gutter: 16, column: 4 }}
          renderItem={renderRecordItem}
          dataSource={recordList}
          pagination={{
            ...pagination,
            total,
            pageSizeOptions: ['8', '16', '32', '64'],
            onChange: (page, pageSize) => {
              onPaginationChange(page, pageSize)
            },
          }}
        />
        <Modal
          visible={showModal}
          width={800}
          maskClosable={false}
          onCancel={() => setShowModal(false)}
          destroyOnClose
          footer={null}
        >
          <div className={styles.playerWrapper}>
            {parkingDetail && (
              <EZUIPlayer
                deviceSerial={parkingDetail.monitorNo}
                isPlayBack
                begin={moment(begin).format('YYYYMMDDHHmmss')}
                end={moment(end).format('YYYYMMDDHHmmss')}
              />
            )}
          </div>
        </Modal>
      </div>
    </>
  )
}

export default parkingCamera
