import FormContainer from '@/components/FormContainer'
import StandardTable from '@/components/StandardTable'
import React, { FC, useEffect, useState } from 'react'
import { ConnectProps, connect, Dispatch, history, Link } from 'umi'
import copy from 'copy-to-clipboard'

import { CopyOutlined } from '@ant-design/icons'
import { message, Input, Form, Row, Col, Button, DatePicker, Select } from 'antd'
import { ConnectState } from '@/models/connect'
import { EngineeringLogModelState } from '@/models/engineeringLog'
import moment from 'moment'
import { getLogUsers } from '@/services/api'
import { boolean } from 'yargs'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option

interface PageProps extends ConnectProps {
  dispatch: Dispatch
  engineeringLog: EngineeringLogModelState
  loading: boolean
}

const LOG_TYPE: any = {
  INSTALL: '激活',
  REACTIVEINSTALL: '重置激活',
  DISMANTLE: '拆除',
  CHANGE: '更换',
  REPAIR: '报修',
  // REWORK: '返修',
  // BIND: '用户绑定',
  // UNBIND: '用户解绑',
  // CHECK: '自检',
  // PROJECTCREAT: '创建项目',
  // PROJECTUPDATE: '修改项目',
}

const IndexPage: FC<PageProps> = ({ engineeringLog, dispatch, loading }) => {
  const [logUsers, setLogUsers] = useState([])
  const [form] = Form.useForm()
  const [formdatas, setformdatas] = useState<any>({})

  useEffect(() => {
    getLogUsers().then((res: any) => {
      setLogUsers(res)
    })
  }, [])
  useEffect(() => {
    dispatch({
      type: 'engineeringLog/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 10,
      },
    })
  }, [])

  const handleTableChange = (query: any) => {
    const data = {
      hostId: formdatas.hostId ? `${formdatas.hostId}` : null,
      startTime: formdatas.Time ? moment(formdatas.Time[0]).format('YYYY-MM-DD') : null,
      endTime: formdatas.Time ? moment(formdatas.Time[1]).format('YYYY-MM-DD') : null,
      logType: formdatas.logType ? formdatas.logType : null,
      userId: formdatas.userId ? formdatas.userId : null,
    }
    const page = {
      page: query.current,
      page_size: query.pageSize,
    }
    dispatch({
      type: 'engineeringLog/fetch',
      payload: Object.assign(data, page),
    })
  }
  const handelReset = () => {
    form.resetFields()
    setformdatas({})
    dispatch({
      type: 'engineeringLog/fetch',
      payload: {
        page: 1,
        page_size: 10,
      },
    })
  }

  const handleCopy = (value: any) => {
    if (copy(value)) {
      message.success('ID号已复制')
    } else message.error('复制失败，请手动复制')
  }

  const handleSearch = (values: any) => {
    const data = {
      hostId: values.hostId ? `${values.hostId}` : null,
      startTime: values.Time ? moment(values.Time[0]).format('YYYY-MM-DD') : null,
      endTime: values.Time ? moment(values.Time[1]).format('YYYY-MM-DD') : null,
      logType: values.logType ? values.logType : null,
      userId: values.userId ? values.userId : null,
    }
    setformdatas({
      ...data,
    })
    dispatch({
      type: 'engineeringLog/fetch',
      payload: {
        ...data,
        page: 1,
        page_size: 10,
      },
    })
  }

  const renderForm = () => {
    return (
      <Form onFinish={handleSearch} form={form} layout="inline">
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="操作时间" name="Time">
              <RangePicker allowClear />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="操作人" name="userId">
              <Select allowClear showSearch optionFilterProp="label">
                {logUsers &&
                  logUsers.map((item: any) => (
                    <Option key={item.userId} value={item.userId} label={item.userName}>
                      {item.userName}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="操作类型" name="logType">
              <Select allowClear>
                {Object.keys(LOG_TYPE).map((item: any) => (
                  <Option key={item} value={item}>
                    {LOG_TYPE[item]}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="设备ID" name="hostId">
              <Input />
            </FormItem>
          </Col>
          <Col span={8}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handelReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }

  const columns = [
    {
      title: '操作人',
      dataIndex: 'userName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '操作时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '所属项目',
      dataIndex: 'projectName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '楼号/户室号',
      render: (text: any, record: any) =>
        (record.buildingNumber ? record.buildingNumber + '号楼' : '--') +
        (record.houseNumber ? record.houseNumber + '号房间' : '/--'),
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      render: (text: any) => {
        return LOG_TYPE[text] ? LOG_TYPE[text] : '--'
      },
    },
    {
      title: '设备ID',
      dataIndex: 'hostId',
      ellipsis: true,
      render: (text: any) => (
        <span>
          <CopyOutlined onClick={() => handleCopy(text)} />
          {text ? text : '--'}{' '}
        </span>
      ),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          <a href={`/host-management/host/list/${record.hostId}`} target="_blank">
            主机详情
          </a>
        </>
      ),
    },
  ]
  return (
    <>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        loading={loading}
        showPagination={true}
        data={engineeringLog.engineeringLogList}
        columns={columns}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />
    </>
  )
}
export default connect(({ engineeringLog, loading }: ConnectState) => ({
  engineeringLog,
  loading: loading.models.engineeringLog,
}))(IndexPage)
