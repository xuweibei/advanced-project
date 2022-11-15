import React, { FC, useState } from 'react'
import { IndexModelState, ConnectProps, Loading, connect } from 'umi'
import { Card, message, Input, Form, Row, Col, Button, Modal, Select, List, Checkbox } from 'antd'

import { PlusOutlined } from '@ant-design/icons'
import FormContainer from '@/components/FormContainer'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'

const ListItem = List.Item
const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

interface PageProps extends ConnectProps {
  index: IndexModelState
  loading: boolean
}

const VersionForm = (props: any) => {
  const { visible, handleSubmit, handleModalVisible } = props

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
  return (
    <Modal
      destroyOnClose
      visible={visible}
      title="新增项目"
      okText="确认"
      cancelText="取消"
      onCancel={() => handleModalVisible()}
      onOk={okHandle}>
      <Form form={form} labelAlign="right" preserve={false}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="APP名称"
          name="APPName"
          rules={[{ required: true, message: '不能为空' }]}>
          <Select allowClear>
            <Option key={1} value={1}>
              aaa
            </Option>
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="版本号"
          name="APPVersion"
          rules={[{ required: true, message: '不能为空' }]}>
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="版本描述"
          name="introduction"
          rules={[{ required: true, message: '不能为空' }]}>
          <TextArea placeholder="项目介绍" autoSize={{ minRows: 3, maxRows: 6 }} />
        </FormItem>
        <Form.Item
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="发布对象"
          name="versionObject"
          className="collection-create-form_last-form-item">
          <Checkbox.Group>
            <Checkbox value="public">iOS</Checkbox>
            <Checkbox value="private">安卓</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

const IndexPage: FC<PageProps> = ({ index, dispatch }) => {
  const [visible, setVisible] = useState<boolean>(false)

  const data = [
    {
      index: 1,
      APPName: '星河湾',
      version: '2.0.1',
      versionMessage: '新增了XXX',
      hostId: '安卓，iOS',
      time: '2020-12-22 14:58:23',
    },
    {
      index: 2,
      APPName: '星河湾',
      version: '2.0.2',
      versionMessage: '新增了XXX',
      hostId: '安卓，iOS',
      time: '2020-12-22 14:58:23',
    },
    {
      index: 3,
      APPName: '星河湾',
      version: '2.0.3',
      versionMessage: '新增了XXX',
      hostId: '安卓，iOS',
      time: '2020-12-22 14:58:23',
    },
  ]

  const handleSubmit = async (values: any) => {

    //新建
    // await dispatch({
    //   type: 'project/save',
    //   payload: {
    //     ...data,
    //   },
    // })
    message.success('新增成功')
    handleModalVisible()
  }

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: 'APP名称',
      dataIndex: 'APPName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '版本号',
      dataIndex: 'version',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '版本描述',
      dataIndex: 'versionMessage',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '发布对象',
      dataIndex: 'hostId',
      ellipsis: true,
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '发布时间',
      dataIndex: 'time',
      render: (text: any) => {
        text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'
      },
    },
  ]

  return (
    <>
      <FormContainer>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true)
          }}>
          <PlusOutlined />
          发布
        </Button>
      </FormContainer>
      <StandardTable
        showPagination={true}
        data={{ list: data }}
        columns={columns}
        rowKey={(record: any) => record.index}
      />
      <VersionForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
      />
    </>
  )
}
export default connect(({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
  index,
  loading: loading.models.index,
}))(IndexPage)
