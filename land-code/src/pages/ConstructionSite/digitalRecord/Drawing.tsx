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
import ImageUpload from '@/components/Uploader/ImageUpload.js'
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

const DrawingCreateForm = (props: any) => {
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
      title={`${data ? '修改' : '添加'}图纸`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data} labelAlign="right" preserve={false}>
        <FormItem label="上传图纸" name="url" rules={[{ required: true, message: '请上传照片！' }]}>
          <ImageUpload />
        </FormItem>
        <FormItem
          label="图纸名称"
          name="name"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入图纸名称"></Input>
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

const DrawingViewForm = (props: any) => {
  const { visible, data, handleModalVisible, deleteDrawing, downloadDrawing } = props

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
              title="确定删除图纸吗?"
              onConfirm={() => deleteDrawing(data)}
              okText="确定"
              cancelText="取消"
            >
              <a className={styles.deleteText}>删除图纸</a>
            </Popconfirm>
            <Button type="primary" onClick={() => downloadDrawing(data)}>
              下载图纸
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function DrawingPage() {
  const [allDrawings, setAllDrawings] = useState<any>({})
  const [archivesTypeId, setArchivesTypeId] = useState<any>()
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 12 })
  const [total, setTotal] = useState<number>()
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [archivesTypeList, setArchivesTypeList] = useState<any>([])
  const [currentDrawing, setCurrentDrawing] = useState<any>()
  const [drawingModalVisible, setDrawingModalVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState<any>()

  useEffect(() => {
    getArchivesTypeList({ type: 'blueprint' }).then(res => {
      setArchivesTypeList(res)
    })
  }, [])

  useEffect(() => {
    //获取列表数据
    let data = {
      type: 'blueprint',
      archivesTypeIds: undefined,
      archivesTypeId: archivesTypeId || undefined,
      ...pagination,
      name: name,
    }
    getDigitalRecordList(data)
      .then(res => {
        setLoadingStatus(false)
        setTotal(res.count)
        setAllDrawings({
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
    values.type = 'blueprint'
    values.name = values?.name || undefined
    values.url = values?.url || undefined
    values.archivesTypeId = values?.archivesTypeId || undefined

    if (currentDrawing) {
      // 修改
      values.id = currentDrawing?.id
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

  const deleteDrawing = (data: any) => {
    delDigitalRecord(data.id)
      .then((res: any) => {
        message.success('删除成功')
        setDrawingModalVisible(false)
        setPagination({ page: 1, pageSize: 12 })
      })
      .catch((e: any) => {
        setDrawingModalVisible(false)
        message.error('删除失败', e)
      })
  }

  const onDownloadDrawing = (value: any) => {
    console.log(value.name, '下载图纸')
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
            <Search
              placeholder="请输入"
              onSearch={value => SearchInfo(value)}
            ></Search>
          </Col>
          <Col span={2} offset={1}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true)
                setCurrentDrawing(null)
              }}
            >
              上传照片
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

  const handleDrawingModalVisible = (flag?: any, item?: any) => {
    setDrawingModalVisible(!!flag)
    setCurrentDrawing(item ? item : null)
  }

  const renderItem = (item: any) => {
    return (
      <ListItem>
        <a onClick={() => handleDrawingModalVisible(true, item)}>
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
        dataSource={allDrawings.list || []}
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
      <DrawingCreateForm
        visible={visible}
        // data={currentDrawing}
        archivesTypeList={archivesTypeList}
        handleModalVisible={() => setVisible(false)}
        handleSubmit={upload}
      />
      <DrawingViewForm
        visible={drawingModalVisible}
        data={currentDrawing}
        handleModalVisible={() => handleDrawingModalVisible(false)}
        deleteDrawing={deleteDrawing}
        downloadDrawing={onDownloadDrawing}
      />
    </>
  )
}
