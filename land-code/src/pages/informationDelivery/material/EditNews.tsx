import React, { PureComponent, useState, useEffect, FC } from 'react'
import { Card, Form, Row, Col, Input, Select, Button, Switch, Radio, message } from 'antd'
import { connect } from 'dva'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import styles from './News.less'
import ImageUpload from '@/components/Uploader/ImageUpload'
import {
  UPLOAD_SERVICE_URL,
  upload,
  fetchNews,
  getAllBuildingsByRoleId,
  updateNews,
} from '@/services/api'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const NewsForm: FC<any> = props => {
  const { data, allBuildings, onSave, currContentType, setCurrContentType } = props
  const [form] = Form.useForm()

  const recordSave = () => {
    form.validateFields().then(values => {
      onSave(values)
    })
  }

  const onShelves = () => {
    form.validateFields().then(values => {
      let data = {
        ...values,
        shelves: true,
      }
      onSave(data)
    })
  }
  const changeType = (v: any) => {
    setCurrContentType(v.target.value)
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

  return (
    <Form form={form} initialValues={data}>
      <p className={styles.title}>资讯标题</p>
      <FormItem name="title" rules={[{ required: true, message: '不能为空' }]}>
        <Input maxLength={20} />
      </FormItem>
      <p className={styles.title}>资讯内容</p>
      <Radio.Group buttonStyle="solid" defaultValue={'content'}>
        <Radio.Button value="content" onChange={v => changeType(v)}>
          自定义内容
        </Radio.Button>
        {/* <Radio.Button value="url" onChange={v => changeType(v)}>
          自定义链接
        </Radio.Button> */}
      </Radio.Group>
      {currContentType === 'content' && (
        <FormItem name="content" rules={[{ required: true, message: '请输入素材内容' }]}>
          <BraftEditor
            placeholder="请在此编辑素材内容"
            textBackgroundColor
            media={{
              uploadFn: uploadEditorFile,
            }}
          />
        </FormItem>
      )}
      {currContentType === 'url' && (
        <FormItem name="url" rules={[{ required: true, message: '请输入素材链接' }]}>
          <Input />
        </FormItem>
      )}
      <p className={styles.title}>封面</p>
      <FormItem name="picture">
        <ImageUpload />
      </FormItem>
      <p className={styles.title}>推送对象</p>
      <FormItem name="pushUsers">
        <Select placeholder="选择推送用户">
          <Option value="All">所有用户</Option>
          {allBuildings &&
            allBuildings.map((building: any, index: any) => {
              return (
                <Option key={index} value={'' + building.id}>
                  {building.name}
                </Option>
              )
            })}
        </Select>
      </FormItem>
      <p className={styles.title}>推送类型</p>
      <FormItem label="板块" name="positionId" rules={[{ required: true, message: '请选择板块' }]}>
        <Select placeholder="选择资讯类型">
          <Option value={1}>顶部轮播图</Option>
          <Option value={2}>社区动态</Option>
          <Option value={3}>社区活动</Option>
        </Select>
      </FormItem>

      <p className={styles.title}>是否推送消息</p>
      <FormItem
        name="push"
        valuePropName="checked"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Switch />
      </FormItem>
      <p className={styles.title}>推送标题</p>
      <FormItem name="pushTitle" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        <Input />
      </FormItem>
      <p className={styles.title}>推送内容</p>
      <FormItem name="pushContent" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        <TextArea />
      </FormItem>

      <p className={styles.title}>是否需要置顶</p>
      <FormItem
        name="topping"
        valuePropName="checked"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
      >
        <Switch />
      </FormItem>
      <Col md={8} className={styles.btnWrapper}>
        <Button onClick={() => recordSave()}>保存</Button>
        <Button type="primary" onClick={() => onShelves()}>
          上线
        </Button>
      </Col>
    </Form>
  )
}
const EditNews = (props: any) => {
  const [news, setNews] = useState<any>()
  const [allBuildings, setAllBuildings] = useState<any[]>([])
  const [currContentType, setCurrContentType] = useState<any>('content')
  const initData = {
    title: '',
    // picture: '',
    pushUsers: 'All',
    contentType: 'content',
    // content: '',
    positionId: 1,
    push: true,
    pushTitle: '',
    pushContent: '',
    topping: true,
  }

  useEffect(() => {
    if (props.match.params.id != 0) {
      fetchNews(props.match.params.id)
        .then(res => {
          let data = {
            ...res,
            content: BraftEditor.createEditorState(res.content ? res.content : null),
          }
          setCurrContentType(res.contentType), setNews(data)
        })
        .catch(e => {
          console.log(e, '错误')
        })
    } else if (props.match.params.id == 0) {
      setNews(initData)
    }
    getAllBuildingsByRoleId().then(res => {
      setAllBuildings(res)
    })
  }, [])

  const onSave = async (values: any) => {
    let data
    if (currContentType === 'url') {
      data = {
        ...values,
        contentType: currContentType,
        id: parseInt(props.match.params.id),
      }
    } else {
      data = {
        ...values,
        contentType: currContentType,
        content: values.content.toHTML(),
        id: parseInt(props.match.params.id),
      }
    }
    await updateNews(data)
      .then(res => {
        message.success('保存成功')
        history.back()
      })
      .catch(e => {
        message.error('保存出错', e)
      })
  }

  const onSubmit = async (values: any) => {
    let data = {
      ...values,
    }
    await updateNews(data)
      .then(res => {
        message.success('保存成功')
        history.back()
      })
      .catch(e => {
        message.error('保存出错', e)
      })
    // if (isCreate && !values.file) {
    //   // 新建时必须设置封面
    //   return message.warn('请设置封面')
    // }
    // let imgUrl
    // if (values.file) {
    //   // 如果选择了封面，则上传封面，获取封面 url
    //   imgUrl = await uploadFile(values.file)
    // }
    // const newsData = {
    //   cityBuildingVos: values.cityBuildings,
    //   content: values.content.toHTML(),
    //   // 如果 imgUrl 不存在，说明是修改，使用之前的图片地址即可
    //   picture: imgUrl || news.picture,
    //   positionId: parseInt(values.positionId, 10),
    //   summary: values.summary,
    //   title: values.title,
    // }
  }
  return (
    <div>
      <h1>{props.match.params.id == 0 ? '新增素材' : '修改素材'}</h1>
      <Card>
        {news && (
          <NewsForm
            onSubmit={onSubmit}
            data={news}
            allBuildings={allBuildings}
            currContentType={currContentType}
            setCurrContentType={setCurrContentType}
            onSave={onSave}
          />
        )}
      </Card>
    </div>
  )
}

export default EditNews
