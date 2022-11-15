import React, { FC, useEffect, useState, useCallback } from 'react'
import { IndexModelState, ConnectProps, ConsoleModelState, Loading, connect, Dispatch } from 'umi'
import { Card, Select, message, Input, Form, Popconfirm, Divider, Button, Modal } from 'antd'
import {
  getProjectManagerList,
  saveProjectManager,
  updateProjectManager,
  delProjectManager,
} from '@/services/api'
import FormContainer from '@/components/FormContainer'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'

const { Option } = Select
const FormItem = Form.Item

const ProjectForm = (props: any) => {
  const { visible, data, handleSubmit, onCancel } = props

  const [form] = Form.useForm()

  useEffect(() => {
    console.log(data, 'data')
    form.resetFields()
  }, [data])

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
      visible={visible}
      title={`${data ? '修改' : '添加'}项目`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data} labelAlign="right">
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name="name"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="内容"
          name="content"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  )
}

interface PageProps extends ConnectProps {
  dispatch: Dispatch
  consoleDatas: ConsoleModelState
  loading: boolean
}

const ProjectManagement: FC<PageProps> = props => {
  //const { dispatch, loading } = props
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 })
  const [projectManagerList, setProjectManagerList] = useState<any>({})
  const [visible, setVisible] = useState<boolean>(false)
  const [currentProject, setCurrentProject] = useState<any>()
  const [buildingList, setBuildingList] = useState<any>([{ id: 0, name: '全部' }])
  //获取楼盘列表
  useEffect(() => {
    let data = {
      buildingId: 1,
      ...pagination,
    }
    getProjectManagerList(data).then(res => {
      setProjectManagerList({
        list: res.results,
        pagination: {
          total: res.count,
          current: pagination.page,
          pageSize: pagination.pageSize,
        },
      })
    })
  }, [pagination])

  const handleSubmit = async (values: any) => {
    values.buildingId = 1
    values.name = values?.name || undefined
    values.content = values?.content || undefined

    if (currentProject) {
      // 修改
      values.id = currentProject?.id
      await updateProjectManager({ ...values })
      message.success('修改成功')
    } else {
      // 新建
      await saveProjectManager({ ...values })
      message.success('新建成功')
    }
    handleProjectModalVisible(false)
    setPagination({ page: 1, pageSize: 10 })
  }

  //删除项目
  const projectDelete = (data: any) => {
    delProjectManager(data.id)
      .then((res: any) => {
        message.success('删除成功')
        setPagination({ page: 1, pageSize: 10 })
      })
      .catch((e: any) => {
        message.error('删除失败', e)
      })
  }

  const handleProjectModalVisible = (flag?: any, record?: any) => {
    setVisible(!!flag)
    setCurrentProject(record ? record : null)
  }

  const handleTableChange = useCallback((pagination: any) => {
    setPagination({ page: pagination.current, pageSize: pagination.pageSize })
  }, [])

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '内容',
      dataIndex: 'content',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          <a onClick={() => handleProjectModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除项目?"
            onConfirm={() => projectDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <a className={styles.deleteText}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ]

  const renderForm = () => {
    return (
      <>
        <Select
          placeholder="选择楼盘"
          style={{ marginRight: 20 }}
          // onChange={onChangeCurrBuilding}
          // value={selectBuilding}
        >
          {buildingList &&
            buildingList.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
        </Select>

        <Button
          type="primary"
          onClick={() => {
            handleProjectModalVisible(true)
          }}
        >
          新建项目信息
        </Button>
      </>
    )
  }
  console.log(currentProject, 'currentProject')

  return (
    <Card bordered={false}>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        //loading={loading}
        showPagination={true}
        data={projectManagerList}
        columns={columns}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />
      <ProjectForm
        visible={visible}
        data={currentProject}
        onCancel={() => setVisible(false)}
        handleSubmit={handleSubmit}
      />
    </Card>
  )
}

export default ProjectManagement
