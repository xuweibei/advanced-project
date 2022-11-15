import React, { PureComponent, useState, useEffect, FC } from 'react'
import { Card, Form, Row, Col, Input, Select, Button, Switch, Radio, message } from 'antd'
import 'braft-editor/dist/index.css'
import styles from './News.less'
import ImageUpload from '@/components/Uploader/ImageUpload'
import { UPLOAD_SERVICE_URL, upload, addBanner, getBannerDetailById } from '@/services/api'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const BannerForm: FC<any> = props => {
  const { data, onSave } = props
  const [form] = Form.useForm()
  const recordSave = () => {
    form.validateFields().then(values => {
      onSave(values)
    })
  }
  return (
    <Form form={form} initialValues={data}>
      <p className={styles.title}>广告内容{console.log(data,8888)}</p>
      <FormItem name="displayContent" rules={[{ required: true, message: '广告内容不能为空' }]}>
        <Input />
      </FormItem>
      <p className={styles.title}>广告封面</p>
      <FormItem name="picUrl">
        <ImageUpload />
      </FormItem>
      {/* <p className={styles.title}>广告位置</p>
      <FormItem name="location">
        <Select placeholder="选择广告位置">
          <Option value={'serve_banner'}>服务模块广告位</Option>
          <Option value={'app_banner'}>首页顶部广告</Option>
          <Option value={'community_banner'}>社区广告</Option>
          <Option value={'recommend_banner'}>相关推荐</Option>
          <Option value={'guess_banner'}>猜你喜欢</Option>
        </Select>
      </FormItem> */}
      <p className={styles.title}>内容类型</p>
      <FormItem name="displayType" rules={[{ required: true, message: '请选择广告类型' }]}>
        <Select placeholder="选择广告类型">
          <Option value={0}>文本</Option>
          <Option value={1}>图片</Option>
        </Select>
      </FormItem>
      <p className={styles.title}>执行类型</p>
      <FormItem name="actionType" rules={[{ required: true, message: '请选择广告类型' }]}>
        <Select placeholder="选择广告类型">
          <Option value={0}>跳转H5</Option>
          <Option value={1}>页面跳转</Option>
          <Option value={2}>播放</Option>
        </Select>
      </FormItem>
      <Col md={8} className={styles.btnWrapper}>
        <Button onClick={() => recordSave()}>保存</Button>
      </Col>
    </Form>
  )
}
const EditBanner = (props: any) => {
  const [banner, setBanner] = useState<any>()

  useEffect(() => {
    if (props.match.params.id != 0) {
      getBannerDetailById(props.match.params.id)
        .then(res => {
          setBanner(res)
        })
        .catch(e => {
          message.error('获取广告详情出错', e)
        })
    }
  }, [])

  const onSave = async (values: any) => {
    let data = {
      ...values,
      id: parseInt(props.match.params.id),
    }
    await addBanner(data)
      .then(res => {
        message.success('保存成功')
        history.back()
      })
      .catch(e => {
        message.error('保存出错', e)
      })
  }
  return (
    <div>
      <h1>{props.match.params.id == 0 ? '新增素材' : '修改素材'}</h1>
      <Card>
        {(banner || props.match.params.id == 0) && <BannerForm data={banner} onSave={onSave} />}
      </Card>
    </div>
  )
}

export default EditBanner
