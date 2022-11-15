import React, { FC, useEffect, useState, useCallback } from 'react'
import {
  getBuildProgressList,
  saveBuildProgress,
  updateBuildProgress,
  delBuildProgress,
  saveBuildNode,
  updateBuildNode,
  delBuildNode,
} from '@/services/api'
import { IndexModelState, ConnectProps, ConsoleModelState, Loading, connect, Dispatch } from 'umi'
import { Card, Select, message, Input, Form, Popconfirm, Divider, Button, Modal, List } from 'antd'
import type { ProColumns } from '@ant-design/pro-table'
import { EditableProTable } from '@ant-design/pro-table'
import ProField from '@ant-design/pro-field'
import { ProFormRadio } from '@ant-design/pro-form'

import FormContainer from '@/components/FormContainer'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import moment from 'moment'

const { Option } = Select
const FormItem = Form.Item
const ListItem = List.Item

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

type DataSourceType = {
  id: string
  name?: string
  buildingId?: string
  constructionManageId?: string
  planCompletionTime?: string
  actualCompletionTime?: string
}

const ProjectForm = (props: any) => {
  const { visible, data, handleSubmit, handleModalVisible } = props

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

  const onCancel = () => {
    form.resetFields()
    handleModalVisible(false)
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={`${data ? '修改' : '添加'}项目`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data} labelAlign="right" preserve={false}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="名称"
          name="name"
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
  const [allProjects, setAllProjects] = useState<any>({})
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 10 })
  const [total, setTotal] = useState<number>()
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [currentProject, setCurrentProject] = useState<any>()
  const [buildingList, setBuildingList] = useState<any>([{ id: 0, name: '全部' }])

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<any>([])

  //获取楼盘列表
  //   useEffect(() => {
  //     queryDeveloperRegions().then(res => {
  //       let DeveloprtList = [...developerUserList, ...res]
  //       setDeveloperUserList(DeveloprtList)
  //     })
  //   }, [])

  const fetch = useCallback(() => {
    // console.log(1212121212)
    setLoadingStatus(true)
    let data = {
      buildingId: undefined,
      ...pagination,
    }
    getBuildProgressList(data)
      .then(res => {
        setLoadingStatus(false)
        setTotal(res.count)
        setAllProjects({
          list: res.results,
          pagination: {
            total: res.count,
            current: pagination.page,
            pageSize: pagination.pageSize,
          },
        })
      })
      .catch(e => {
        console.log('获取失败', e)
      })
  }, [pagination])

  useEffect(() => {
    fetch()
  }, [fetch])

  //新增、修改节点
  const handleSubmitNode = async (values: any, itemData?: any) => {
    // console.log(values,'values')
    // console.log(itemData,'itemData')
    values.buildingId = values?.buildingId || itemData?.options?.position || undefined
    values.name = values?.name || undefined
    values.planCompletionTime = moment(values?.planCompletionTime).format('YYYY-MM-DD') || undefined
    values.actualCompletionTime = moment(values?.actualCompletionTime).format('YYYY-MM-DD') || undefined
    values.constructionManageId =
      values?.constructionManageId || itemData?.options?.parentKey || undefined

    if (values.id && typeof values.id == 'number') {
      // 修改
      await updateBuildNode({ ...values })
      message.success('修改成功')
    } else {
      // 新建
      values.id = undefined
      await saveBuildNode({ ...values })
      message.success('新建成功')
    }
    fetch()
    // setPagination({ page: 1, pageSize: 10 })
  }

  //删除节点
  const nodeDelete = (data: any) => {
    delBuildNode(data.id)
      .then((res: any) => {
        message.success('删除成功')
        // setPagination({ page: 1, pageSize: 10 })
      })
      .catch((e: any) => {
        message.error('删除失败', e)
      })
      fetch()
    // setPagination({ page: 1, pageSize: 10 })
  }

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '节点',
      dataIndex: 'name',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
        }
      },
    },
    {
      title: '计划完成时间',
      dataIndex: 'planCompletionTime',
      valueType: 'date',
    },
    {
      title: '实际完成时间',
      dataIndex: 'actualCompletionTime',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            console.log(record, 'record', action, 'action')
            action?.startEditable?.(record.id)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除项目?"
          onConfirm={() => nodeDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <a className={styles.deleteText}>删除</a>
        </Popconfirm>,
      ],
    },
  ]

  const handleSubmit = async (values: any) => {
    values.buildingId = values?.buildingId || undefined
    values.name = values?.name || undefined
    values.content = values?.url || undefined

    if (currentProject) {
      // 修改
      values.id = currentProject?.id

      await updateBuildProgress({ ...values })
      message.success('修改成功')
    } else {
      // 新建
      await saveBuildProgress({ ...values })
      message.success('新建成功')
    }
    handleProjectModalVisible(false)
    fetch()
    // setPagination({ page: 1, pageSize: 10 })
  }

  //删除项目
  const projectDelete = (data: any) => {
    delBuildProgress(data.id)
      .then((res: any) => {
        message.success('删除成功')
        fetch()
        // setPagination({ page: 1, pageSize: 10 })
      })
      .catch((e: any) => {
        message.error('删除失败', e)
      })
  }

  const handleProjectModalVisible = (flag?: any, record?: any) => {
    setVisible(!!flag)
    setCurrentProject(record ? record : null)
  }

  const onPaginationChange = async (pages: number, pageSize: number) => {
    setPagination({ page: pages || pagination.page, pageSize: pageSize || pagination.pageSize })
  }

  const handleTableChange = (query: any) => {
    // const formValues = form.getFieldsValue()
    const page = {
      page: query.current,
      page_size: query.pageSize,
    }
    // dispatch({
    //   type: 'account/fetch',
    //   payload: Object.assign(formdatas, page),
    // })
  }

  const renderItem = (itemData: any) => {
    return (
      <ListItem key={itemData.id}>
        <EditableProTable<DataSourceType>
          //rowKey={(record, index) => `complete${record.id}${index}`}
          rowKey={(record, index) => record.id}
          headerTitle={itemData.name}
          toolBarRender={() => [
            <a onClick={() => handleProjectModalVisible(true, itemData)}>编辑</a>,
            <Popconfirm
              title="确定删除项目?"
              onConfirm={() => projectDelete(itemData)}
              okText="确定"
              cancelText="取消"
            >
              <a className={styles.deleteText}>删除</a>
            </Popconfirm>,
          ]}
          columns={columns}
          dataSource={itemData.nodes}
          request={async () => ({
            data: itemData.nodes,
            total: 3,
            success: true,
          })}
          recordCreatorProps={{
            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
            creatorButtonText: '新增节点',
            parentKey: itemData.id,
            position: itemData.buildingId,
          }}
          value={itemData.nodes}
          onChange={()=>setAllProjects}
          editable={{
            type: 'multiple',
            editableKeys,
            onSave: async (rowKey, data, row, itemData) => {
              handleSubmitNode(data, itemData)
              console.log(itemData, '1111')
              await waitTime(2000)
            },
            onChange: setEditableRowKeys,
          }}
        />
      </ListItem>
    )
  }

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
          新建项目
        </Button>
      </>
    )
  }

  return (
    <Card bordered={false}>
      <FormContainer>{renderForm()}</FormContainer>
      <List
        //loading={loadingStatus}
        rowKey={(record: any) => record.id}
        dataSource={allProjects.list || []}
        renderItem={item => renderItem(item)}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
          total,
          onChange: (page, pageSize: any) => {
            onPaginationChange(page, pageSize)
          },
        }}
      />
      <ProjectForm
        visible={visible}
        data={currentProject}
        handleModalVisible={handleProjectModalVisible}
        handleSubmit={handleSubmit}
      />
    </Card>
  )
}

export default ProjectManagement
