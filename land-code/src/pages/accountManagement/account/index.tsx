/* eslint-disable */
import React, { FC, useEffect, useState } from 'react'
import { Dispatch, ConnectProps, connect } from 'umi'
import { Card, Divider, Button, Form, Modal, Input, Row, Col, Select, message } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'

import StandardTable from '@/components/StandardTable'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { PHONE_REGEXP } from '../../../utils/utils'
import { ConnectState } from '@/models/connect'
import useCanEdit from '@/hooks/useCanEdit'
import { initializePwd, saveUser } from '@/services/api'

interface AccountProps extends ConnectProps {
  dispatch: Dispatch
  form: any
  account: any
  role: any
  loading: any
  roles: any
  permissions: any
}

const FormItem = Form.Item
const { Option } = Select

const UserForm = (props: any) => {
  const { modalVisible, handleSubmit, handleModalVisible, data, roles } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
  }, [data])

  const okHandle = () => {
    form
      .validateFields()
      .then((values: any) => {
        handleModalVisible()
        form.resetFields()
        handleSubmit(values)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  const onCancel = () => {
    form.resetFields()
    handleModalVisible()
  }

  return (
    <Modal
      title={`${data ? '修改' : '新增'}用户`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form form={form} initialValues={data} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
        <FormItem
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名！' },
            {
              pattern: /^[A-Za-z0-9_]+$/,
              message: '用户名由字母数字下划线组成',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem label="姓名" name="name" rules={[{ required: true, message: '姓名' }]}>
          <Input />
        </FormItem>
        <FormItem
          label="手机号"
          name="mobile"
          rules={[
            {
              required: true,
              pattern: PHONE_REGEXP,
              message: '请输入合法的手机号',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem label="角色" name="roleId" rules={[{ required: true, message: '请选择角色' }]}>
          <Select allowClear style={{ width: '100%' }}>
            {roles.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  )
}

const ChangePswForm = (props: any) => {
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
      title="修改密码"
      okText="确认"
      cancelText="取消"
      onCancel={() => handleModalVisible()}
      onOk={okHandle}
    >
      <Form
        form={form}
        labelAlign="right"
        preserve={false}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <FormItem
          label="新密码"
          name="newPassword"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input placeholder="请输入新密码" />
        </FormItem>
      </Form>
    </Modal>
  )
}

const Account: FC<AccountProps> = props => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [changePwdModalVisible, setChangePwdModalVisible] = useState<boolean>(false)
  const [formdatas, setFormdatas] = useState<any>({})
  const [curUser, setCurUser] = useState<any>()
  const canEdit = useCanEdit()
  const [form] = Form.useForm()
  const {
    dispatch,
    roles,
    account: { data },
    loading,
  } = props

  useEffect(() => {
    dispatch({
      type: 'account/fetch',
    })
    dispatch({
      type: 'role/fetch',
    })
  }, [])

  const handleFormReset = () => {
    form.resetFields()
    setFormdatas({})
    dispatch({
      type: 'account/fetch',
    })
  }

  const handleTableChange = (query: any) => {
    // const formValues = form.getFieldsValue()
    const page = {
      page: query.current,
      page_size: query.pageSize,
    }
    dispatch({
      type: 'account/fetch',
      payload: Object.assign(formdatas, page),
    })
  }

  const handleModalVisible = (flag?: any) => {
    setModalVisible(!!flag)
    setCurUser(null)
  }

  const handleUpdateModalVisible = (flag: any, record: any) => {
    setModalVisible(!!flag)
    setCurUser(record)
  }

  const handleSubmit = async (values: any) => {
    const data = {
      mobile: values.mobile,
      name: values.name,
      staffRoleId: parseInt(values.roleId, 10),
      username: values.username,
    }
    let params
    if (curUser) {
      // 修改
      params = {
        id: curUser.id,
        preRoleId: curUser.roleId,
        ...data,
      }
    } else {
      // 新建
      params = {
        ...data,
      }
    }
    saveUser(params)
      .then(res => {
        message.success('操作成功')
        dispatch({
          type: 'account/fetch',
        })
        handleModalVisible()
      })
      .catch(e => {
        console.log('创建失败', e)
      })
  }

  // 删除
  const onRemove = (record: any) => {
    try {
      dispatch({
        type: 'account/remove',
        payload: [record.id],
      })
      message.success('删除成功')
    } catch (e) {
      console.log(e)
    }
  }

  const handleSearch = (values: any) => {
    dispatch({
      type: 'account/fetch',
      payload: {
        ...values,
        page: 1,
        page_size: 10,
      },
    })
  }

  const changePwdVisible = (flag?: any) => {
    setChangePwdModalVisible(!!flag)
    setCurUser(null)
  }

  const handleChangePwdModalVisible = (flag: any, record: any) => {
    setChangePwdModalVisible(!!flag)
    setCurUser(record)
  }
  const handleChangePwdSubmit = async (values: any) => {
    try {
      await initializePwd({
        id: curUser.id,
        pwd: values.newPassword,
      })
      message.success('密码修改成功')
    } catch (err) {
      console.log(err)
    }
    changePwdVisible()
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <FormItem label="角色" name="staffRoleId">
          <Select allowClear={true} style={{ width: 200 }}>
            {roles.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem name="value">
          <Input placeholder="用户名/姓名/手机号" />
        </FormItem>
        <FormItem>
          <Button htmlType="submit" type="primary">
            <SearchOutlined />
            查询
          </Button>
        </FormItem>
        <FormItem>
          <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
            重置
          </Button>
        </FormItem>
        {canEdit && (
          <FormItem>
            <Button type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined />
              新增用户
            </Button>
          </FormItem>
        )}
      </Form>
    )
  }

  const getColumns = (): ColumnsType => {
    const columns: ColumnsType = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text: any, record: any, index: number) => index + 1,
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '角色',
        dataIndex: 'roleName',
      },
      {
        title: '上次登录时间',
        dataIndex: 'lastLogin',
      },
    ]

    if (canEdit) {
      columns.push({
        title: '操作',
        render: (text: any, record: any) =>
          record.modifiable === true ? (
            <>
              <a onClick={() => handleUpdateModalVisible(true, record)}>修改</a>
              <Divider type="vertical" />
              <TableDeleteBtn onDelete={() => onRemove(record)} />
              <Divider type="vertical" />
              <a
                onClick={() => {
                  handleChangePwdModalVisible(true, record)
                }}
              >
                修改密码
              </a>
            </>
          ) : (
            ''
          ),
      })
    }

    return columns
  }

  return (
    <Card bordered={false}>
      <div style={{ marginBottom: 20 }}>{renderForm()}</div>
      <StandardTable
        loading={loading}
        data={data}
        columns={getColumns()}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />
      <UserForm
        data={curUser}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        modalVisible={modalVisible}
        roles={roles}
      />
      <ChangePswForm
        data={curUser}
        visible={changePwdModalVisible}
        handleModalVisible={changePwdVisible}
        handleSubmit={handleChangePwdSubmit}
      />
    </Card>
  )
}

export default connect(({ account, role, loading }: ConnectState) => ({
  account,
  roles: role.list,
  loading: loading.models.account,
}))(Account)
