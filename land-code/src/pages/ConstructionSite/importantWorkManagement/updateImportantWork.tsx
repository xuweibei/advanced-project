import React, { useEffect, useCallback, useState, memo } from 'react'
import { Card, Button, Form, Select, Input, Modal, message } from 'antd'

import { getImportWorkInfo, updateImportWork, UPLOAD_SERVICE_URL } from '@/services/api'
import useApiLoading from '@/hooks/useApiLoading'
import { useModel } from 'umi'
import styles from './index.less'
//富文本引用
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

export default function ImportantWorkUpdate(props: any) {
  const [form] = Form.useForm()
  const [defaultData, setDefaultData] = useState<any>()
  //富文本数据
  const [reviewRemark, setReviewRemark] = useState<any>({})

  const id = props.match.params.id
  //   const { api: updateProjectsApi } = useApiLoading(updateProjects)
  //   const { api: queryProjectDetailsApi } = useApiLoading(getProjectDetails)

  useEffect(() => {
    let data = {
      id: id,
    }
    getImportWorkInfo(data).then((res: any) => {
      let newData = {
        ...res,
      }
      setDefaultData(newData)
      setReviewRemark(BraftEditor.createEditorState(res.content ? res.content : null))
      form.resetFields(defaultData)
    })
  }, [])

  const handleAllSaveAndPublish = async () => {
    const reservation = form.getFieldsValue()

    if (!reservation.name) {
      return message.error('标题不能为空')
    }

    const data = {
      id: id,
      buildingId: 1,
      name: reservation.name ? reservation.name : undefined,
      content: reviewRemark
        ? Object.keys(reviewRemark) == 0
          ? undefined
          : reviewRemark.toHTML()
        : undefined,
    }
    updateImportWork({
      ...data,
    }).then((res: any) => {
      message.success('提交成功')
      form.resetFields()
      history.back()
    })
  }

  const handleEditorChange = (reviewRemark: any) => {
    setReviewRemark(reviewRemark)
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
    xhr.setRequestHeader('Authorization', '111111')
    xhr.send(fd)
  }

  const renderForm = () => {
    //console.log(defaultData, 'defaultData')
    return (
      <Form form={form} {...formItemLayout} layout="vertical" initialValues={defaultData}>
        <FormItem label="标题" name="name" rules={[{ required: true, message: '请输入标题' }]}>
          <Input />
        </FormItem>
        <FormItem label="内容" name="content">
          <Card style={{ width: '100%', marginTop: 10 }}>
            <BraftEditor
              value={reviewRemark}
              onChange={handleEditorChange}
              media={{
                uploadFn: uploadEditorFile,
              }}
              style={{ width: '100%' }}
            />
          </Card>
        </FormItem>
      </Form>
    )
  }

  return (
    <Card>
      {renderForm()}
      <div className={styles.buttonBox}>
        <Button onClick={() => history.back()}>返回</Button>
        <Button type="primary" onClick={handleAllSaveAndPublish}>
          发布
        </Button>
      </div>
    </Card>
  )
}
