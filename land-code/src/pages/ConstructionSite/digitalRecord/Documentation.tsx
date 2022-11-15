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
  Radio,
  message,
  Form,
  List,
  Popconfirm,
  Divider,
} from 'antd'
import FormContainer from '@/components/FormContainer'
import StandardTable from '@/components/StandardTable'
import ButtonUpload from '@/components/Uploader/ButtonUpload.js'
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

const DocumentationCreateForm = (props: any) => {
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
      //title={`${data ? '修改' : '添加'}项目`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data} labelAlign="right" preserve={false}>
        <FormItem label="上传文档" name="url" rules={[{ required: true, message: '请上传文档！' }]}>
          <ButtonUpload
            accept=".pdf,.doc,.docx"
            //   onChange={(v: any, name: any) => {
            //     setVlogUrl(v)
            //   }}
            //   onRemove={() => {
            //     setVlogUrl('')
            //   }}
          >
            上传文档
          </ButtonUpload>
        </FormItem>
        <FormItem
          label="文档名称"
          name="name"
          rules={[{ required: true, message: '请输入名称！' }]}
        >
          <Input placeholder="请输入文档名称"></Input>
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

export default function DocumentationPage() {
  const [allDocumentations, setAllDocumentations] = useState<any>({})
  const [archivesTypeId, setArchivesTypeId] = useState<any>()
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 })
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [archivesTypeList, setArchivesTypeList] = useState<any>([])
  const [visible, setVisible] = useState(false)
  const [showPDF, setShowPDF] = useState(false)
  const [PDFurl, setPDFurl] = useState<any>()
  const [name, setName] = useState<any>()

  useEffect(() => {
    getArchivesTypeList({ type: 'file' }).then(res => {
      setArchivesTypeList(res)
    })
  }, [])

  useEffect(() => {
    //获取列表数据
    let data = {
      type: 'file',
      archivesTypeIds: undefined,
      archivesTypeId: archivesTypeId || undefined,
      ...pagination,
      name: name,
    }
    getDigitalRecordList(data)
      .then(res => {
        setLoadingStatus(false)
        setAllDocumentations({
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

  const handleTableChange = useCallback((pagination: any) => {
    setPagination({ page: pagination.current, pageSize: pagination.pageSize })
  }, [])

  const SearchInfo = (value: any) => {
    setName(value)
  }

  const upload = async (values: any) => {
    values.type = 'file'
    values.name = values?.name || undefined
    values.url = values?.url || undefined
    values.archivesTypeId = values?.archivesTypeId || undefined

    // if (currentPhoto) {
    //   // 修改
    //   values.id = currentPhoto?.id
    //   await updateDigitalRecord({ ...values })
    //   message.success('修改成功')
    // } else {
    // 新建
    await saveDigitalRecord({ ...values })
    message.success('新建成功')
    // }
    setVisible(false)
    setPagination({ page: 1, pageSize: 10 })
  }

  const deleteDocumentation = (data: any) => {
    delDigitalRecord(data.id)
      .then((res: any) => {
        message.success('删除成功')
        setPagination({ page: 1, pageSize: 10 })
      })
      .catch((e: any) => {
        message.error('删除失败', e)
      })
  }

  const onDownloadDocumentation = (value: any) => {
    //console.log(value.name, '下载图片')
    downloadPhoto(value.url)
  }

  const classificationOnchange = (value: any) => {
    //console.log(value, '11111')
    setArchivesTypeId(value)
  }

  const onPDFView = (value: any) => {
    window.open(value.url, '_parent')
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
            <Button type="primary" onClick={() => setVisible(true)}>
              上传文档
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

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '类型',
      dataIndex: 'archivesTypeName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          {/(?:pdf)$/i.test(record.url) && (
            <>
              {/* 仅pdf文档可在线查看 */}
              <a onClick={() => onPDFView(record)}>查看</a>
              <Divider type="vertical" />
            </>
          )}

          <a onClick={() => onDownloadDocumentation(record)}>下载</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除该文档?"
            onConfirm={() => deleteDocumentation(record)}
            okText="确定"
            cancelText="取消"
          >
            <a className={styles.deleteText}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        //loading={loading}
        showPagination={true}
        data={allDocumentations}
        columns={columns}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />

      <DocumentationCreateForm
        visible={visible}
        // data={currentDocumentation}
        archivesTypeList={archivesTypeList}
        handleModalVisible={() => setVisible(false)}
        handleSubmit={upload}
      />
    </>
  )
}
