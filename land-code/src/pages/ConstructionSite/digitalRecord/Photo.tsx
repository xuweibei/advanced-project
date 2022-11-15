import React, { FC, useEffect, useState, useCallback } from 'react'
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
import ImageUpload from '@/components/Uploader/ImageUpload.js'
import { ConnectProps, ConsoleModelState, Dispatch } from 'umi'
import FormContainer from '@/components/FormContainer'
import NewRadio from '@/components/Radio'
import styles from './index.less'
import { stripBasename } from 'history-with-query/PathUtils'

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

const PhotoCreateForm = (props: any) => {
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
      title={`${data ? '修改' : '添加'}图片`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data} labelAlign="right" preserve={false}>
        <FormItem label="上传图片" name="url" rules={[{ required: true, message: '请上传照片！' }]}>
          <ImageUpload />
        </FormItem>
        <FormItem
          label="图片名称"
          name="name"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入图片名称"></Input>
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

const PhotoViewForm = (props: any) => {
  const { visible, data, handleModalVisible, deletePhoto, downloadPhoto } = props

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
        <img src={data && data.url} className={styles.modalViewImg}></img>
        <div className={styles.modalContent}>
          <div>
            <div>{data && data.name}</div>
            <div>分类：{data && data.archivesTypeName}</div>
          </div>
          <div className={styles.buttonBox}>
            <Popconfirm
              title="确定删除图片吗?"
              onConfirm={() => deletePhoto(data)}
              okText="确定"
              cancelText="取消"
            >
              <a className={styles.deleteText}>删除图片</a>
            </Popconfirm>
            <Button type="primary" onClick={() => downloadPhoto(data)}>
              下载图片
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function PhotoPage() {
  const [allPhotos, setAllPhotos] = useState<any>([])
  const [archivesTypeId, setArchivesTypeId] = useState<any>()
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 12 })
  const [totalPagination, steTotalPagination] = useState({ total: 0, current: 1, pageSize: 8 })
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [archivesTypeList, setArchivesTypeList] = useState<any>([])
  const [currentPhoto, setCurrentPhoto] = useState<any>()
  const [photoModalVisible, setPhotoModalVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState<any>()
  const [form] = Form.useForm()

  useEffect(() => {
    getArchivesTypeList({ type: 'picture' }).then(res => {
      setArchivesTypeList(res)
    })
  }, [])

  useEffect(() => {
    //获取列表数据
    let data = {
      type: 'picture',
      archivesTypeIds: undefined,
      archivesTypeId: archivesTypeId || undefined,
      ...pagination,
      name: name,
    }
    getDigitalRecordList(data)
      .then(res => {
        setLoadingStatus(false)
        setAllPhotos(res.results)
        steTotalPagination({
          total: res.count,
          current: pagination.page,
          pageSize: pagination.pageSize,
        })
        // setAllPhotos({
        //   list: res.results,
        //   pagination: {
        //     total: res.count,
        //     current: pagination.page,
        //     pageSize: pagination.pageSize,
        //   },
        // })
      })
      .catch(e => {
        console.log('获取失败', e)
        setLoadingStatus(false)
      })
  }, [pagination, archivesTypeId, name])

  const paginationProps = {
    // showSizeChanger: true,
    showQuickJumper: true,
    ...totalPagination,
  }

  const onPaginationChange = useCallback((page: any) => {
    setPagination({ page: page, pageSize: pagination.pageSize })
  }, [])

  const SearchInfo = (value: any) => {
    // console.log(value,'11111')
    setName(value)
  }

  const upload = async (values: any) => {
    values.type = 'picture'
    values.name = values?.name || undefined
    values.url = values?.url || undefined
    values.archivesTypeId = values?.archivesTypeId || undefined

    if (currentPhoto) {
      // 修改
      values.id = currentPhoto?.id
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

  const deletePhoto = (data: any) => {
    delDigitalRecord(data.id)
      .then((res: any) => {
        message.success('删除成功')
        setPhotoModalVisible(false)
        setPagination({ page: 1, pageSize: 12 })
      })
      .catch((e: any) => {
        setPhotoModalVisible(false)
        message.error('删除失败', e)
      })
  }

  const onDownloadPhoto = (value: any) => {
    //console.log(value.name, '下载图片')
    downloadPhoto(value.url)
  }

  const classificationOnchange = (value: any) => {
    //console.log(value, '11111')
    setArchivesTypeId(value)
  }
  const renderForm = () => {
    return (
      <>
        <Form form={form}>
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
              <FormItem name="name">
                <Search placeholder="请输入" onSearch={value => SearchInfo(value)}></Search>
              </FormItem>
            </Col>
            <Col span={2} offset={1}>
              <Button
                type="primary"
                onClick={() => {
                  setVisible(true)
                  setCurrentPhoto(null)
                }}
              >
                上传照片
              </Button>
            </Col>
          </Row>
          <Row>
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
          </Row>
        </Form>
      </>
    )
  }

  const handlePhotoModalVisible = (flag?: any, item?: any) => {
    setPhotoModalVisible(!!flag)
    setCurrentPhoto(item ? item : null)
  }

  const renderItem = (item: any) => {
    return (
      <ListItem>
        <a onClick={() => handlePhotoModalVisible(true, item)}>
          <div className={styles.photoItem}>
            <div className={styles.photoItemImgBox}>
              <img className={styles.photoItemImg} src={item.url}></img>
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
        dataSource={allPhotos}
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
          onChange: page => {
            onPaginationChange(page)
          },
          ...paginationProps,
        }}
        renderItem={item => renderItem(item)}
      />
      <PhotoCreateForm
        visible={visible}
        // data={currentPhoto}
        archivesTypeList={archivesTypeList}
        handleModalVisible={() => setVisible(false)}
        handleSubmit={upload}
      />
      <PhotoViewForm
        visible={photoModalVisible}
        data={currentPhoto}
        handleModalVisible={() => handlePhotoModalVisible(false)}
        deletePhoto={deletePhoto}
        downloadPhoto={onDownloadPhoto}
      />
    </>
  )
}
