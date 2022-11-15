import React, { useEffect, useState, useCallback } from 'react'
import { history } from 'umi'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  Radio,
  RadioChangeEvent,
  message,
  Space,
} from 'antd'
import FormContainer from '@/components/FormContainer'
import styles from './index.less'
import UpdateImg from './updateImg'
//富文本引用
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css' //富文本引用样式
import {
  addMerchandise,
  querycommunity,
  putMerchandise,
  UPLOAD_SERVICE_URL,
  queryIDMerchandise,
} from '@/services/api'
import { PicturesGrid } from '@/components/uploadPictureList'
const FormItem = Form.Item
const { Option } = Select

const index = (props: any) => {
  const [form] = Form.useForm() //form表单获取数据域
  // const [formdatas, setformdatas] = useState<any>(null)
  const [reviewRemark, setReviewRemark] = useState<any>(BraftEditor.createEditorState('')) //富文本数据
  const [status, setStatus] = useState<any>(1)
  const [responseUrl, setResponseUrl] = useState<any[]>([])
  const [buildingId, setBuildingIds] = useState<any[]>([]) //获取社区展示
  // const [selectedItems, setSelectedItems] = useState<any>(null) //下拉数据value
  const [selectedItemAll, setSelectedItemAll] = useState<string[]>([]) //默认下拉数据id
  const [data, setData] = useState<any[]>([]) //回显数据
  const [backShow, setBackShow] = useState<any>([])
  const [dataID, setDataID] = useState<any>({}) //回显数据
  
  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value)
    setStatus(e.target.value)
  }

  useEffect(() => {
    //获取社区展示
    querycommunity({ developerId: Number(localStorage.getItem('developerId')) }).then(res => {
      res && setBuildingIds(res)
      const Idselect = new Array()
      //获取所有id,默认全部
      res.map((item:any)=>{
        Idselect.push(item.id)
      })
      setSelectedItemAll(Idselect)
    })
  }, [])
  
  useEffect(() => {
   if(props.match.params.id!=='add'){
      //根据商品id 获取商品详情
    queryIDMerchandise(props.match.params.id).then(res => {
      let cationsList =
        res.nbGoodsSpecificationsList &&
        res.nbGoodsSpecificationsList.filter((item: any, i: any) => {
          return i > 0
        })
      setBackShow(res.nbGoodsPictureDtoList)
      setResponseUrl(res.nbGoodsPictureDtoList)
      setDataID({ids:res.nbGoodsSpecificationsList[0].id||0, goodsIds:res.nbGoodsSpecificationsList[0].id||0,})
      setStatus(Number(res.status))
      form.setFieldsValue({
        // 第二步，name名字对应上
        buildingIds:res.buildingIds.split(',').map(Number),
        developerId: res.developerId,
        id: res.id,
        name: res.name,
        nbGoodsPictureDtoList:[...res.nbGoodsPictureDtoList],
        goodsDesc: BraftEditor.createEditorState(res.goodsDesc),
        specifications: res.nbGoodsSpecificationsList[0].specifications,
        price: res.nbGoodsSpecificationsList[0].price||0,
        nbGoodsSpecificationsList: cationsList,
        status: Number(res.status),
      })
      setData(res)
    })
   }
}, [])

  //重置
  const handelReset = () => {
    // setformdatas(null)
    form.resetFields()
    setBackShow([])
    form.setFieldsValue({
      // 第二步，name名字对应上
      buildingIds:[],
      developerId: null,
      id:null,
      name: null,
      nbGoodsPictureDtoList:[]  ,
      goodsDesc:null,
      specifications:null,
      price: null,
      nbGoodsSpecificationsList: [],
      status:null,
    })
  }
  const uploadEditorFile = (param: any) => {
    const serverURL = UPLOAD_SERVICE_URL
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    const successFn = (response: any) => {
      // 上传成功后调用param.success并传入上传后的文件地址
      if (xhr.status >= 200 && xhr.status <= 300) {
        param.success({
          url: xhr.responseText,
          meta: {
            id: 'xxx',
            title: 'xxx',
            alt: 'xxx',
            loop: true, // 指定音视频是否循环播放
            autoPlay: true, // 指定音视频是否自动播放
            controls: true, // 指定音视频是否显示控制栏
          },
        })
      } else {
        const responseText = xhr.responseText
        const res = JSON.parse(responseText)
        param.error(new Error(res.message))
        message.error(res.message)
      }
    }

    const progressFn = (event: any) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100)
    }

    const errorFn = (response: any) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败',
      })
    }

    xhr.upload.addEventListener('progress', progressFn, false)
    xhr.addEventListener('load', successFn, false)
    xhr.addEventListener('error', errorFn, false)
    xhr.addEventListener('abort', errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('Authorization', window.token)
    xhr.send(fd)
  }

  const handleEditorChange = (reviewRemark: any) => {
    setReviewRemark(reviewRemark)
  }
  //添加商品
  const addMerchand = (data: any) => {
    addMerchandise(data).then(res => {
      message.success('新增成功！')
      history.push(`/commodityManagement/listOfMerchandise`)
    })
  }
    //编辑
  const putMerchandy = (data: any) => {
    putMerchandise(data).then(res => {
      message.success('保存成功！')
      history.push(`/commodityManagement/listOfMerchandise`)
    })
  }
  //保存
  const handleSearch = (values: any) => {

    const ficationsList = new Array()
    const id = props.match.params.id
    values.nbGoodsSpecificationsList &&
      values.nbGoodsSpecificationsList.map((item: any) => {
        ficationsList.push({
          goodsId: item.goodsId||0,
          id: item.id||null,
          specifications: item.specifications,
          price: Number(item.price),
        })
      })
     const builds = values.buildingIds&&values.buildingIds||[]

    //数据处理POST
    const data = {
      ...values,
      file:backShow,
      id:(id!=='add'&& props.match.params.id)||null,
      buildingIds:(builds.length>0&&builds.join(','))||selectedItemAll.join(',') ,
      developerId: Number(localStorage.getItem('developerId')),
      goodsDesc: reviewRemark ? reviewRemark.toHTML() : null, //富文本信息
      nbGoodsPictureDtoList: [...responseUrl],
      nbGoodsSpecificationsList: [
        {
          goodsId:dataID.goodsIds|| 0,
          id: dataID.ids||0,
          price: values && values.price ? Number(values.price) : null,
          specifications: values && values.specifications ? values.specifications : null,
          // status: values && values.status ? values.status : null,
        },
        ...ficationsList,
      ],
      name: values && values.name ? values.name : null,
      status: status,
    }
    // 当路经存在id,修改商品
    if (id !=='add') {
      //编辑
      putMerchandy(data)
    } else {
      //新增商品
      addMerchand(data)
    }
  }
  //图片返回地址
  const getbeaseurl = useCallback(
    (url: any) => {
     
      let getURl = new Array()
      url &&
        url.map((item: any) => {
          if(item.response||item.url){
            getURl.push({ url: item.response||item.url})
          }
        })
        console.log(getURl)
        getURl&&setResponseUrl(getURl)
    },
    [responseUrl]
  )
  const children: React.ReactNode[] = []
  for (let i = 0; i < buildingId.length; i++) {
    children.push(
    <Option key={buildingId[i].id} value={buildingId[i].id}>{buildingId[i].name}</Option>
    )

   
  }
  // //下拉多选框
  // const handleChangeSelect = (value: string) => {
  //   setSelectedItems(value)
  // }

  //限制输入框只能数组和小数点-价格
  const rulNum = (e: any) => {
    const { value } = e.target
    const tempArr = value.split('.')
    if (tempArr[1]?.length) {
      let tem = `${tempArr[0]}.${tempArr[1].slice(0, 2)}`
      return tem
                .replace(/[^\d.]/g, "")//判断非数字和 . 清空
                .replace(/\.{2,}/g, ".") //判断只能出现一个点
                .replace(/^0\d{1,2}$/, '0.')//0后面必须带点
                .replace(/^\./g, "0.")//点开头前面变0.
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".")
                .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3')
    } else {
      return value.replace(/[^\d.]/g, "")
                  .replace(/\.{2,}/g, ".")
                  .replace(/^0\d{1,2}$/, '0.')
                  .replace(/^\./g, "0.")
                  .replace(".", "$#$")
                  .replace(/\./g, "")
                  .replace("$#$", ".")
                  .replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3')
                  
    }
  }

  //自定义校验upload上传
  const checkPic = (rule:any,value:any,callback:any) => {
    return new Promise((resolve, reject) => {
      if (responseUrl.length==0) {
        reject(new Error('请上传图片'))
      } else {     
        resolve(responseUrl)
      }
    })
  }

  const renderForm = () => {
    return (
      <>
        <Form form={form} initialValues={data} onFinish={handleSearch} layout="inline">
          <Row className={styles.header}>
            <Col span={4}>
              <FormItem label="商品名称" name="name" rules={[{ required: true, min: 0, max: 10 }]}>
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.header}>
            <Col span={24}>
              <FormItem
                label="商品图片"
                 name="nbGoodsPictureDtoList"
                // rules={[{ required:responseUrl.length==0?true:false, message: '请上传图片' }]}
                rules={[{ validator: checkPic , required:true}]}
              >
                <UpdateImg getbeaseurl={getbeaseurl} backShow={backShow} form={form}/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <Space key={1} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <FormItem
                  style={{ marginLeft: '20px' }}
                  label="规格1"
                  name="specifications"
                  rules={[{ required: true, min: 0, max: 10 }]}
                >
                  <Input placeholder={`规格1`}/>
                </FormItem>
                <FormItem
                  label="价格"
                  name="price"
                  rules={[{ required: true }]}
                  getValueFromEvent={rulNum}
                >
                  <Input placeholder={`价格`}/>
                </FormItem>
              </Space>
            </Col>
            <Col span={18}>
              <Form.List name="nbGoodsSpecificationsList">
                {(fields, { add, remove }) => (
                  <>   
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key + 1}
                        style={{ display: 'flex', marginBottom: 8 }}
                        align="baseline"
                      >
                        <FormItem
                          style={{ marginLeft: '20px' }}
                          label={`规格${name + 2}`}
                          {...restField}
                          name={[name, 'specifications']}
                          rules={[{ min: 0, max: 10, required: true }]}
                        >
                          <Input placeholder={`规格${name + 2}`} />
                        </FormItem>
                        <FormItem
                          {...restField}
                          label="价格"
                          rules={[{ required: true }]}
                          getValueFromEvent={rulNum}
                          name={[name, 'price']}
                        >
                          <Input placeholder="价格" />
                        </FormItem>
                        <Button type="primary" onClick={() => remove(name)} danger>
                          删除
                        </Button>
                      </Space>
                    ))}
                    {fields.length != 4 ? (
                      <FormItem style={{ width: '20%' }}>
                        <Button type="primary" onClick={() => add()} block icon={<PlusOutlined />}>
                          新增
                        </Button>
                      </FormItem>
                    ) : null}
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          <Row className={styles.header}>
            <Col span={6}>
              <FormItem label="展示社区" name="buildingIds">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="全部"
                  maxTagCount= 'responsive'
                  // value={selectedItems}
                  // onChange={handleChangeSelect}
                >
                  {children}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.header}>
            <Col span={6} style={{ display: 'flex' }}>
              {/* <FormItem label="上架状态" name="status"> */}
              <div>上架状态：</div>
              <Radio.Group onChange={onChange} value={status}>
                <Radio value={1}>上架</Radio>
                <Radio value={0}>下架</Radio>
              </Radio.Group>
              {/* </FormItem> */}
            </Col>
          </Row>
          <Row>
            <Col span={14}>
              <FormItem
                label="商品详情"
                name="goodsDesc"
                rules={[{ required: true, message: '请输入素材内容' }]}
              >
                <BraftEditor
                  value={reviewRemark}
                  style={{ width: '100%' }}
                  placeholder="请在此编辑素材内容"
                  textBackgroundColor
                  onChange={handleEditorChange}
                  media={{
                    uploadFn: uploadEditorFile,
                  }}
                />
              </FormItem>
            </Col>
          </Row>
          <Row className={styles.header}>
            <Col span={8}>
              {/* <Button type="primary" htmlType="submit">
                查询
              </Button> */}
              <Button style={{ marginLeft: '75px' }} onClick={handelReset}>
                清空
              </Button>
              <Button type="primary" htmlType="submit">
                {/* <PlusOutlined /> */}
                保存
              </Button>
              {/* <PeopleUploader buildingId={currCommunityId} fetch={fetch} />
              <Button type="primary" onClick={() => downloadSample()}>
                下载模版
              </Button> */}
            </Col>
          </Row>
        </Form>
      </>
    )
  }
  return (
    <>
      <div>
        <Card>
          <FormContainer>{renderForm()}</FormContainer>
        </Card>
      </div>
    </>
  )
}

export default index
