import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import StandardTable from '@/components/StandardTable'
import ButtonUpload from '@/components/Uploader/ButtonUpload.js'
import {
  deleteTechnologyContent,
  queryTechnologyContent,
  saveTechnologyContent,
  technologyList,
  updateTechnologyContent,
  UPLOAD_SERVICE_URL,
} from '@/services/api'
import { PlusOutlined } from '@ant-design/icons'
import { PicturesGrid } from '@/components/uploadPictureList'
import {
  Card,
  Col,
  Select,
  Row,
  Button,
  Divider,
  Modal,
  message,
  Form,
  Input,
  Switch,
  Upload,
} from 'antd'
import React, { useCallback, useEffect, useState } from 'react'

const { Option } = Select
const { TextArea } = Input
const FormItem = Form.Item

const AddTechnologyDetail = (props: any) => {
  const {
    defaltFileList,
    primaryTechnologyId,
    visible,
    handleSubmit,
    handleCancel,
    data,
    technologyType,
  } = props

  const [showDetail, setShowDetail] = useState(false)
  const [showImg, setShowImg] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [highLight, setHighLight] = useState(false)
  const [video, setVideo] = useState<any>()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any>(defaltFileList)

  useEffect(() => {
    if(defaltFileList[0]&&defaltFileList[0].url){
      setFileList(defaltFileList)
    }
    setVideo(data&&data.video)
  }, [defaltFileList,data])

  useEffect(() => {
    form.resetFields()
    if (data) {
      data.enableVideo === true ? setShowVideo(true) : setShowVideo(false)
      data.enablePicture === true ? setShowImg(true) : setShowImg(false)
      data.highlight === true ? setHighLight(true) : setHighLight(false)
      data.enableText === true ? setShowDetail(true) : setShowDetail(false)
    } else {
      setShowDetail(false)
      setHighLight(false)
      setShowImg(false)
      setShowVideo(false)
    }
  }, [data])

  const addDetail = () => {
    form.validateFields().then(value => {
      if (data) {
        let pictureUrlList: any[] = []
        fileList.map((item: any) => {
          pictureUrlList.push(item.response?item.response:item.url)
        })
        let values = {
          ...value,
          id: data.id,
          enablePicture: showImg,
          enableText: showDetail,
          enableVideo: showVideo,
          technologyId: value.buildingId,
          primaryTechnologyId: primaryTechnologyId,
          video: video ? video : null,
          picture: pictureUrlList.join(),
          buildingId:highLight?null:value.buildingId
        }
        console.log(values,'values1')
        handleSubmit(values)
        setFileList([])
        form.resetFields()
      } else {
        if (highLight) {
          let pictureUrlList: any[] = []
          fileList.map((item: any) => {
            pictureUrlList.push(item.response?item.response:item.url)
          })
          let values = {
            ...value,
            enablePicture: showImg,
            enableText: showDetail,
            enableVideo: showVideo,
            technologyId: value.buildingId,
            primaryTechnologyId: primaryTechnologyId,
            video: video ? video : null,
            picture: pictureUrlList.join(),
            buildingId:value.buildingId?value.buildingId:null
          }
          console.log(values,'values2')
          handleSubmit(values)
          setFileList([])
          form.resetFields()
        } else {
          let pictureUrlList: any[] = []
          fileList.map((item: any) => {
            pictureUrlList.push(item.response?item.response:item.url)
          })
          let values = {
            ...value,
            enablePicture: showImg,
            enableText: showDetail,
            enableVideo: showVideo,
            technologyId: value.buildingId,
            primaryTechnologyId: primaryTechnologyId,
            highlight: false,
            video: video ? video : null,
            picture: pictureUrlList.join(),
          }
          console.log(values,'values3')
          handleSubmit(values)
          setFileList([])
          form.resetFields()
        }
      }
    })
  }
  const changeVideo = (v: any) => {
    console.log(v, 'video')
    setVideo(v)
  }
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )

  const handleChange = (files: any) => {
    setFileList(files.fileList)
  }
  return (
    <Modal
      visible={visible}
      title={data ? '修改工艺内容' : '添加工艺内容'}
      onCancel={() => handleCancel()}
      onOk={() => addDetail()}
      width={600}
    >
      <Form
        initialValues={data}
        wrapperCol={{ span: 18 }}
        labelCol={{ span: 6 }}
        form={form}
        labelAlign="right"
      >
        <FormItem name="name" label="工艺名称" rules={[{ required: true, message: '请输入工艺名称' }]}>
          <Input></Input>
        </FormItem>
        {!highLight && (
          <FormItem name="buildingId" rules={[{ required: true, message: '请输入工艺名称' }]} label="工艺子类型">
            <Select>
              {technologyType &&
                technologyType.map((item: any) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
            </Select>
          </FormItem>
        )}

        <FormItem label="文字叙述">
          <Switch checked={showDetail} onChange={(e: any) => setShowDetail(e)}></Switch>
          <div>点击打开才会展示下列菜单</div>
        </FormItem>
        {showDetail && (
          <>
            <FormItem label="输入叙述" name="textDescription">
              <TextArea rows={4}></TextArea>
            </FormItem>
          </>
        )}
        <FormItem label="上传图片">
          <Switch
            checked={showImg}
            onChange={(e: any) => {
              setShowImg(e), setFileList([])
            }}
          ></Switch>
          <div>点击打开才会展示下列菜单</div>
        </FormItem>
        {showImg && (
          <>
            <FormItem label="上传多张图片" name="picture">
              <PicturesGrid
                action={UPLOAD_SERVICE_URL}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
              >
                {fileList.length >= 6 ? null : uploadButton}
              </PicturesGrid>
            </FormItem>
          </>
        )}
        <FormItem label="上传视频">
          <Switch checked={showVideo} onChange={(e: any) => {setShowVideo(e),setVideo(null)}}></Switch>
          <div>点击打开才会展示下列菜单</div>
        </FormItem>
        {showVideo && (
          <>
            <FormItem label="点击上传" name="video">
              {video ? (
                <div style={{ display: 'flex' }}>
                  <video style={{ width: '120px', height: '80px' }} src={video}></video>
                  <ButtonUpload onChange={(v: any) => changeVideo(v)} accept=".MP4,.mov">
                    重新上传
                  </ButtonUpload>
                </div>
              ) : (
                <ButtonUpload onChange={(v: any) => changeVideo(v)} accept=".MP4,.mov">
                  上传视频
                </ButtonUpload>
              )}
              支持扩展名：.mov .MP4 ....
            </FormItem>
          </>
        )}
        <FormItem label="是否为亮点工艺" name="highlight" valuePropName="checked">
          <Switch checked={highLight} onChange={e => {setHighLight(e)}} />
        </FormItem>
      </Form>
    </Modal>
  )
}

const TechnologyManage = (props: any) => {
  const [pictureList, setPictureList] = useState<any>([])
  const [visible, setVisible] = useState(false)
  const [modalDetail, setModalDetail] = useState<any>()
  const [childTechnology, setChildTechnology] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>()
  const [fatherTechnology, setFatherTechnology] = useState<any>([])
  const [childTechnologyId, setChildTechnologyId] = useState<any>()
  const [technologyType, setTechnologyType] = useState<any>()
  const companyId = props.match.params.companyId
  const [primaryTechnologyId, setPrimaryTechnologyId] = useState(
    props.match.params.primaryTechnologyId
  )

  useEffect((pagination: any = { page: 1, page_size: 10 }) => {
    if (childTechnologyId) {
      let data = {
        page: 1,
        pageSize: 10,
        companyId: companyId,
        primaryTechnologyId: primaryTechnologyId,
        technologyId: childTechnologyId,
      }
      queryTechnologyContent(data).then(res => {
        console.log(res, 'resres')
        setData({
          list:res.results,
          pagination: {
            total: res.count,
            current: pagination.page,
            pageSize: pagination.page_size,
          },
        })
      })
    }
  }, [childTechnologyId])

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      if (companyId && primaryTechnologyId) {
        setLoading(true)
        let data = {
          companyId: companyId,
          primaryTechnologyId: primaryTechnologyId,
          pagination,
        }
        queryTechnologyContent(data).then(res => {
          setData({
            list:res.results,
            pagination: {
              total: res.count,
              current: pagination.page,
              pageSize: pagination.page_size,
            },
          })
          setLoading(false)
        })
        let values = {
          companyId: companyId,
          technologyId: primaryTechnologyId,
        }
        technologyList(values).then(res => {
          setTechnologyType(res)
          setChildTechnology([{ pid: primaryTechnologyId, id: null, name: '全部' }, ...res])
        })

        let params = {
          companyId: companyId,
          technologyId: 0,
        }
        technologyList(params).then(res => {
          setFatherTechnology(res)
        })
      }
    },
    [primaryTechnologyId]
  )

  useEffect(() => {
    fetch()
  }, [fetch])
  const changeTechnology = (id: any) => {
    setPrimaryTechnologyId(id)
    setChildTechnologyId(null)
  }
  const changeChildTechnology = (id: any) => {
    if (id == null) {
      fetch()
    }
    setChildTechnologyId(id)
  }

  const RenderForm = () => {
    const defaultValue = fatherTechnology.find((item: any) => item.id == primaryTechnologyId)
    return (
      <Card>
        <h2>工艺内容管理</h2>
        <Row>
          <Col span={6}>
            <Select
              defaultValue={defaultValue && defaultValue.name}
              onChange={v => changeTechnology(v)}
              style={{ width: '100%' }}
            >
              {fatherTechnology &&
                fatherTechnology.map((item: any) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
            </Select>
          </Col>
          <Col span={6} offset={2}>
            <Select
              onChange={v => changeChildTechnology(v)}
              defaultValue={childTechnology && childTechnology[0].name}
              style={{ width: '100%' }}
              value={childTechnologyId}
            >
              {childTechnology &&
                childTechnology.map((item: any) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
            </Select>
          </Col>
        </Row>
        <br />
        <Button
          type="primary"
          onClick={() => {
            setVisible(true), setModalDetail(null)
          }}
        >
          新增工艺内容
        </Button>
        <br />
      </Card>
    )
  }
  const updateTechnologyData = (data: any) => {
    let picture = data.picture.split(',')
    let newList: any = []
    picture.forEach((item: any, index: any) => {
      let data = {
        uid: index,
        url: item,
      }
      newList.push(data)
    })
    setPictureList(newList)
    setModalDetail(data)
    setVisible(true)
  }

  const delTechnology = async (data: any) => {
    await deleteTechnologyContent(data.id)
    message.success('删除成功！')
    fetch()
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '所属子工艺',
      dataIndex: 'technologyName',
      render: (text: any, render: any) => (text ? text : '--'),
    },
    {
      title: '亮点工艺',
      dataIndex: 'highlight',
      render: (text: any, render: any) => (
        <>
          {render.highlight ? <img src={require('../../../assets/images/online.png')} /> : <>--</>}
        </>
      ),
    },
    {
      title: '操作',
      // dataIndex:'',
      render: (text: any, render: any) => (
        <>
          <a onClick={() => updateTechnologyData(render)}>编辑</a>
          <Divider type="vertical" />
          <TableDeleteBtn onDelete={() => delTechnology(render)} />
        </>
      ),
    },
  ]
  const handleTableChange = (query: any) => {
    fetch({
      page: query.current,
      page_size: query.pageSize,
    })
  }
  const handleSubmit = async (data: any) => {
    if (data.id) {
      await updateTechnologyContent(data)
      message.success('修改成功')
      handleCancel()
      fetch()
    } else {
      await saveTechnologyContent(data)
      message.success('添加成功')
      handleCancel()
      fetch()
    }
  }

  const handleCancel = () => {
    setModalDetail('')
    setPictureList([])
    setVisible(false)
  }
  return (
    <>
      <AddTechnologyDetail
        defaltFileList={pictureList}
        technologyType={technologyType}
        visible={visible}
        data={modalDetail}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        primaryTechnologyId={primaryTechnologyId}
        buildingId={companyId}
      />
      <h2>星河湾半岛第五期</h2>
      <RenderForm />
      {data && (
        <StandardTable
          loading={loading}
          columns={columns}
          showPagination={true}
          data={data}
          onChange={handleTableChange}
        />
      )}
    </>
  )
}
export default TechnologyManage
