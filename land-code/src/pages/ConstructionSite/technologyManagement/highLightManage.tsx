import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import StandardTable from '@/components/StandardTable'
import ButtonUpload from '@/components/Uploader/ButtonUpload.js'
import {
  deleteTechnology,
  deleteTechnologyContent,
  queryTechnologyContent,
  saveTechnologyContent,
  updateTechnologyContent,
  UPLOAD_SERVICE_URL,
} from '@/services/api'
import { PlusOutlined } from '@ant-design/icons'
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
import React, { useEffect, useState, useCallback } from 'react'
import { PicturesGrid } from '@/components/uploadPictureList'

const { TextArea } = Input
const FormItem = Form.Item

const AddTechnologyDetail = (props: any) => {
  const { defaltFileList, data, handleSubmit, companyId, visible, handleCancel } = props
  const [showDetail, setShowDetail] = useState<any>(false)
  const [showImg, setShowImg] = useState<any>(false)
  const [showVideo, setShowVideo] = useState<any>(false)
  const [highLight, setHighLight] = useState<any>(false)
  const [fileList, setFileList] = useState<any>(defaltFileList)
  const [video, setVideo] = useState<any>(data && data.video)
  const [form] = Form.useForm()

  useEffect(() => {
    if(defaltFileList[0]&&defaltFileList[0].url){
      setFileList(defaltFileList)
    }
    setVideo(data && data.video)
  }, [defaltFileList, data])

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
          if (item.url) {
            pictureUrlList.push(item.url)
          } else {
            pictureUrlList.push(item.response)
          }
        })
        let values = {
          ...value,
          id: data.id,
          enablePicture: showImg,
          enableText: showDetail,
          enableVideo: showVideo,
          technologyId: -1,
          highLight: true,
          video: video ? video : '',
          picture: pictureUrlList.join(),
        }
        handleSubmit(values)
        setFileList([])
        form.resetFields()
      } else {
        let pictureUrlList: any[] = []
        fileList.map((item: any) => {
          pictureUrlList.push(item.response)
        })
        let values = {
          ...value,
          enablePicture: showImg,
          enableText: showDetail,
          enableVideo: showVideo,
          technologyId: -1,
          highlight: true,
          video: video ? video : '',
          picture: pictureUrlList.join(),
        }
        handleSubmit(values)
        setFileList([])
        form.resetFields()
      }
    })
  }
  const handleChange = (files: any) => {
    setFileList(files.fileList)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  )
  const changeVideo = (data: any) => {
    message.success('上传成功！')
    setVideo(data)
  }

  return (
    <Modal
      visible={visible}
      title="添加工艺内容"
      onCancel={() => handleCancel()}
      onOk={() => addDetail()}
      width={700}
    >
      <Form initialValues={data} form={form} wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
        <FormItem name="name" label="工艺名称">
          <Input></Input>
        </FormItem>
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
          <Switch checked={showImg} onChange={(e: any) => setShowImg(e)}></Switch>
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
          <Switch checked={showVideo} onChange={(e: any) => setShowVideo(e)}></Switch>
          <div>点击打开才会展示下列菜单</div>
        </FormItem>

        {showVideo && showVideo && (
          <FormItem label="点击上传" name="video">
            {video && (
              <>
                <video style={{ width: '150px', height: '90px' }} src={video}></video>
              </>
            )}
            <ButtonUpload onChange={(v: any) => changeVideo(v)} accept=".MP4,.mov">
              {video ? '更换' : '上传'}视频
            </ButtonUpload>
            支持扩展名：.mov .MP4 ....
          </FormItem>
        )}
        <FormItem label="是否为亮点工艺" name="highlight" valuePropName="checked">
          <Switch defaultChecked={true} disabled />
        </FormItem>
      </Form>
    </Modal>
  )
}

const HighLightManage = (props: any) => {
  const [visible, setVisible] = useState(false)
  const [modalDetail, setModalDetail] = useState<any>()
  const [pictureList, setPictureList] = useState<any>([])
  const [data, setData] = useState<any>()
  const companyId = props.match.params.companyId
  const id = props.match.params.id

  const fetch = useCallback(
    (pagination: any = { page: 1, pageSize: 10 }) => {
      if (companyId) {
        let values = {
          companyId: companyId,
          technologyId: id,
          ...pagination,
        }
        queryTechnologyContent(values).then(res => {
          console.log(res, 'sssddd')
          setData({
            list: res.results,
            pagination: {
              total: res.count,
              current: pagination.page,
              pageSize: pagination.page_size,
            },
          })
        })
      }
    },
    [companyId]
  )

  useEffect(() => {
    fetch()
  }, [fetch])

  const [form] = Form.useForm()

  const RenderForm = () => {
    return (
      <Card>
        <h2>亮点工艺内容管理</h2>
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
    if (data.picture) {
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
    }

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
      title: '描述',
      dataIndex: 'textDescription',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '亮点工艺',
      dataIndex: 'highlight',
      render: (text: any, render: any) => (
        <>{render.highlight ? <img src={require('../../../assets/images/online.png')} /> : <></>}</>
      ),
    },
    {
      title: '操作',
      render: (text: any, render: any) => (
        <>
          <a onClick={() => updateTechnologyData(render)}>编辑</a>
          <Divider type="vertical" />
          <TableDeleteBtn onDelete={() => delTechnology(render)} />
        </>
      ),
    },
  ]
  const handleCancel = () => {
    setPictureList([])
    setModalDetail('')
    setVisible(false)
  }
  const handleSubmit = async (value: any) => {
    if (value.id) {
      await updateTechnologyContent(value)
      message.success('修改成功')
      handleCancel()
      fetch()
    } else {
      await saveTechnologyContent(value)
      message.success('添加成功')
      handleCancel()
      fetch()
    }
  }
  const handleTableChange = (query: any) => {
    fetch({
      page: query.current,
      pageSize: query.pageSize,
    })
  }

  return (
    <>
      <AddTechnologyDetail
        defaltFileList={pictureList}
        visible={visible}
        companyId={companyId}
        data={modalDetail}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <h2>星河湾半岛第五期</h2>
      <RenderForm />
      <StandardTable
        columns={columns}
        onChange={handleTableChange}
        showPagination={true}
        data={data}
      />
    </>
  )
}
export default HighLightManage
