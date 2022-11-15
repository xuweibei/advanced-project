import React, { FC, useEffect, useState } from 'react'
import {
  getArchivesTypeList,
  getDigitalRecordList,
  saveDigitalRecord,
  updateDigitalRecord,
  delDigitalRecord,
  downloadPhoto,
} from '@/services/api'
import {
  Select,
  Row,
  Col,
  Input,
  Button,
  Modal,
  message,
  Radio,
  Form,
  List,
  Popconfirm,
} from 'antd'
import ButtonUpload from '@/components/Uploader/ButtonUpload.js'
import { ConnectProps, ConsoleModelState, Dispatch } from 'umi'
import FormContainer from '@/components/FormContainer'
import NewRadio from '@/components/Radio'
import styles from './index.less'

const { Option } = Select
const { Search } = Input
const FormItem = Form.Item
const ListItem = List.Item

const building = [
  {
    index: 1,
    name: '星河湾',
  },
  {
    index: 2,
    name: '新柏石',
  },
  {
    index: 3,
    name: '世贸大厦',
  },
  {
    index: 4,
    name: '东方明珠',
  },
  {
    index: 5,
    name: '新天地',
  },
  {
    index: 6,
    name: '陆家嘴中心大楼',
  },
]

const VideoCreateForm = (props: any) => {
  const { visible, data, archivesTypeList, handleSubmit, handleModalVisible } = props

  const [form] = Form.useForm()

  const okHandle = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        handleSubmit(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const onCancel = () => {
    form.resetFields()
    handleModalVisible(false)
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={`${data ? '修改' : '添加'}视频`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data} labelAlign="right" preserve={false}>
        <FormItem label="上传视频" name="url" rules={[{ required: true, message: '请上传视频！' }]}>
          <ButtonUpload
            accept="video/*,.mp4"
            //   onChange={(v: any, name: any) => {
            //     setVlogUrl(v)
            //   }}
            //   onRemove={() => {
            //     setVlogUrl('')
            //   }}
          >
            上传视频
          </ButtonUpload>
        </FormItem>
        <FormItem
          label="视频名称"
          name="name"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入视频名称"></Input>
        </FormItem>
        <FormItem
          label="分类"
          name="archivesTypeId"
          rules={[{ required: true, message: '请选择分类！' }]}
        >
          <Radio.Group>
            {archivesTypeList &&
              archivesTypeList.map((item: any) => {
                return <Radio.Button value={item.id}>{item.name}</Radio.Button>
              })}
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  )
}

const VideoViewForm = (props: any) => {
  const { visible, data, handleModalVisible, deleteVideo, downloadVideo } = props

  const onCancel = () => {
    handleModalVisible(false)
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      onCancel={onCancel}
      // onOk={okHandle}
      footer={null}
    >
      <div className={styles.modalView}>
        <video muted style={{ width: '100%' }} src={data && data.url} autoPlay />
        <div className={styles.modalContent}>
          <div>
            <div>{data && data.name}</div>
            <div>分类：{data && data.archivesTypeName}</div>
          </div>
          <div className={styles.buttonBox}>
            <Popconfirm
              title="确定删除视频吗?"
              onConfirm={() => deleteVideo(data)}
              okText="确定"
              cancelText="取消"
            >
              <a className={styles.deleteText}>删除视频</a>
            </Popconfirm>
            <Button type="primary" onClick={() => downloadVideo(data)}>
              下载视频
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function VideoPage() {
  const [allVideos, setAllVideos] = useState<any>({})
  const [archivesTypeId, setArchivesTypeId] = useState<any>()
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 12 })
  const [total, setTotal] = useState<number>()
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [archivesTypeList, setArchivesTypeList] = useState<any>([])
  const [currentVideo, setCurrentVideo] = useState<any>()
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState<any>()

  useEffect(() => {
    getArchivesTypeList({ type: 'video' }).then(res => {
      setArchivesTypeList(res)
    })
  }, [])

  useEffect(() => {
    //获取列表数据
    let data = {
      type: 'video',
      archivesTypeIds: undefined,
      archivesTypeId: archivesTypeId || undefined,
      ...pagination,
      name: name,
    }
    getDigitalRecordList(data)
      .then(res => {
        setLoadingStatus(false)
        setTotal(res.count)
        setAllVideos({
          list: res.results,
          pagination: {
            total: res.count,
            current: pagination.page,
            pageSize: pagination.pageSize,
          },
        })
      })
      .catch(e => {
        console.log('获取失败', e)
        setLoadingStatus(false)
      })
  }, [pagination, archivesTypeId, name])

  const onPaginationChange = async (pages: number) => {
    setPagination({ page: pages, pageSize: pagination.pageSize })
  }

  const SearchInfo = (value: any) => {
    setName(value)
  }
  const upload = async (values: any) => {
    values.type = 'video'
    values.name = values?.name || undefined
    values.url = values?.url || undefined
    values.archivesTypeId = values?.archivesTypeId || undefined

    if (currentVideo) {
      // 修改
      values.id = currentVideo?.id
      await updateDigitalRecord({ ...values })
      message.success('修改成功')
    } else {
      // 新建
      await saveDigitalRecord({ ...values })
      message.success('新建成功')
    }
    setVisible(false)
    setPagination({ page: 1, pageSize: 12 })
  }

  const deleteVideo = (data: any) => {
    delDigitalRecord(data.id)
      .then((res: any) => {
        message.success('删除成功')
        setVideoModalVisible(false)
        setPagination({ page: 1, pageSize: 12 })
      })
      .catch((e: any) => {
        setVideoModalVisible(false)
        message.error('删除失败', e)
      })
  }

  const onDownloadVideo = (value: any) => {
    console.log(value.name, '下载视频')
    downloadPhoto(value.url)
  }
  const classificationOnchange = (value: any) => {
    //console.log(value, '11111')
    setArchivesTypeId(value)
  }
  const renderForm = () => {
    return (
      <>
        <Row>
          <Col span={6}>
            <Select style={{ width: '400px' }}>
              {building.map((item: any, index: any) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col span={6} offset={9}>
            <Search placeholder="请输入" onSearch={value => SearchInfo(value)}></Search>
          </Col>
          <Col span={2} offset={1}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true)
                setCurrentVideo(null)
              }}
            >
              上传视频
            </Button>
          </Col>
        </Row>
        <Row>
          <Form>
            <FormItem label="分类">
              <NewRadio
                options={[
                  { label: '全部', value: 0 },
                  ...archivesTypeList.map((item: any) => {
                    return { label: item.name, value: item.id }
                  }),
                ]}
                value={0}
                style={styles.classification}
                textStyle={styles.notCheckText}
                textCheckStyle={styles.checkText}
                onChange={value => classificationOnchange(value)}
              ></NewRadio>
            </FormItem>
          </Form>
        </Row>
      </>
    )
  }

  const handleVideoModalVisible = (flag?: any, item?: any) => {
    setVideoModalVisible(!!flag)
    setCurrentVideo(item ? item : null)
  }

  const renderItem = (item: any) => {
    return (
      <ListItem>
        <a onClick={() => handleVideoModalVisible(true, item)}>
          <div className={styles.photoItem}>
            <div className={styles.photoItemImgBox}>
              <video muted className={styles.photoItemImg} src={item.url} />
            </div>
            <div className={styles.photoItemName}>{item.name}</div>
          </div>
        </a>
      </ListItem>
    )
  }

  return (
    <>
      <FormContainer>{renderForm()}</FormContainer>
      <List
        //loading={loadingStatus}
        dataSource={allVideos.list || []}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 4,
          xl: 4,
          xxl: 6,
        }}
        pagination={{
          // showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
          total,
          onChange: page => {
            onPaginationChange(page)
          },
        }}
        renderItem={item => renderItem(item)}
      />
      <VideoCreateForm
        visible={visible}
        // data={currentVideo}
        archivesTypeList={archivesTypeList}
        handleModalVisible={() => setVisible(false)}
        handleSubmit={upload}
      />
      <VideoViewForm
        visible={videoModalVisible}
        data={currentVideo}
        handleModalVisible={() => handleVideoModalVisible(false)}
        deleteVideo={deleteVideo}
        downloadVideo={onDownloadVideo}
      />
    </>
  )
}
