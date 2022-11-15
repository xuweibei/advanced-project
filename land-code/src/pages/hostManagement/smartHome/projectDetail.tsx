import React, { FC, useEffect, useState } from 'react'
import { ConnectProps, connect, history, Dispatch } from 'umi'
import {
  Card,
  Radio,
  Input,
  Form,
  Row,
  Col,
  Button,
  Divider,
  Select,
  Modal,
  message,
  Badge,
  Descriptions,
  Space,
} from 'antd'
import copy from 'copy-to-clipboard'

import styles from './index.less'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import FormContainer from '@/components/FormContainer'
import StandardTable from '@/components/StandardTable'
import { CopyOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { ConnectState } from '@/models/connect'
import { ProjectModelState } from '@/models/project'
import moment from 'moment'
import { getBuildingByProjectId, getProjectUser } from '@/services/api'
import useLocation from '@/hooks/useLocation'
import useCanEdit from '@/hooks/useCanEdit'

const DescriptionItem = Descriptions.Item
const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

interface ProjectDetailProps extends ConnectProps {
  dispatch: Dispatch
  project: ProjectModelState
  loading: boolean
}

const ProjectForm = (props: any) => {
  const {
    visible,
    handleSubmit,
    handleModalVisible,
    buildingOptions,
    userList,
    currentProjectDetail,
  } = props

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(currentProjectDetail)
  }, [currentProjectDetail])

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
      title="修改项目"
      okText="确认"
      cancelText="取消"
      onCancel={() => handleModalVisible()}
      onOk={okHandle}
    >
      <Form form={form} labelAlign="left">
        <FormItem
          label="项目名称"
          name="projectName"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;盘"
          name="buildingName"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select allowClear style={{ width: '100%' }}>
            {buildingOptions &&
              buildingOptions.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <Form.List
          rules={[
            {
              validator: (rule, value) => {
                if (!value) {
                  return Promise.reject(message.error('车库区域不能为空！', 30))
                } else {
                  return Promise.resolve()
                }
              },
            },
          ]}
          name="room"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} align="baseline">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, curValues) =>
                      prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                    }
                  >
                    {() => (
                      <Form.Item
                        {...field}
                        label="楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号"
                        name={[field.name, 'buildingNum']}
                        fieldKey={[field.fieldKey, 'buildingNum']}
                        rules={[{ required: true, message: '不能为空' }]}
                      >
                        <Input />
                      </Form.Item>
                    )}
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="主机数"
                    name={[field.name, 'hostCount']}
                    fieldKey={[field.fieldKey, 'hostCount']}
                    rules={[{ required: true, message: '不能为空' }]}
                  >
                    <Input />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Form.Item style={{ textAlign: 'center' }}>
                <Button
                  type="dashed"
                  style={{ width: '60%' }}
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  新增楼号
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <FormItem
          label="项目经理"
          name="projectManager"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select allowClear style={{ width: '100%' }}>
            {userList &&
              userList.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem label="&nbsp;&nbsp;&nbsp;项目成员" name="workers">
          <Select allowClear mode="multiple" style={{ width: '100%' }}>
            {userList &&
              userList.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem label="项目简介" name="remark" rules={[{ required: true, message: '不能为空' }]}>
          <TextArea placeholder="项目介绍" autoSize={{ minRows: 3, maxRows: 6 }} />
        </FormItem>
      </Form>
    </Modal>
  )
}

const ProjectDetail: FC<ProjectDetailProps> = (props: any) => {
  const { dispatch, project, loading } = props
  const [projectId, setProjectId] = useState<number>()
  const [building, setBuilding] = useState([])
  const [room, setRoom] = useState([])
  const [curRoom, setCurRoom] = useState('all')
  const [visible, setVisible] = useState<boolean>(false)
  const [userList, setUserList] = useState<any>([])
  const [currentProjectDetail, setCurrentProjectDetail] = useState<any>()
  const [currentRoom, setCurrentRoom] = useState<any>([])
  const [buildingForm, setBuildingForm] = useState<any>({})
  const [filteredInfo, setFilteredInfo] = useState<any>({})

  const canEdit = useCanEdit()
  const [form] = Form.useForm()

  const { buildingOptions } = useLocation()

  useEffect(() => {
    setProjectId(props.match.params.id)
    getProjectUser().then((res: any) => {
      setUserList(res)
    })
  }, [])

  useEffect(() => {
    if (projectId) {
      dispatch({
        type: 'project/getProject',
        payload: {
          id: projectId,
        },
      })
      dispatch({
        type: 'project/getHostList',
        payload: {
          page: 1,
          page_size: 10,
          projectId,
        },
      })
      getBuildingByProjectId(Number(projectId))
        .then((res: any) => {
          setBuilding(res)
          let room: any = []
          res.map((item: any) => {
            room = room.concat(item.buildingHouses)
          })
          setRoom(room)
        })
        .catch((err: any) => {
          console.log(err)
        })
    }
  }, [projectId])
  useEffect(() => {
    const buildingNumber: any[] = project.projectDetail.buildingNumber
      ? project.projectDetail.buildingNumber.split(',')
      : []
    const hostCount: any[] = project.projectDetail.buildingHostNum
      ? project.projectDetail.buildingHostNum.split(',')
      : []
    let rooms: any[] = []
    let workers: any[] = []
    for (let i = 0; i < buildingNumber.length; i++) {
      rooms.push({
        id: i + 1,
        buildingNum: buildingNumber[i],
        hostCount: hostCount[i],
      })
    }
    setCurrentRoom(rooms)
    project.projectDetail.worker &&
      project.projectDetail.worker.map((item: any) => {
        workers.push(item.id)
      })
    setCurrentProjectDetail({
      projectName: project.projectDetail.projectName,
      buildingName: project.projectDetail.buildingId,
      room: rooms,
      projectManager: project.projectDetail.projectUser,
      workers: workers,
      remark: project.projectDetail.remark,
    })
  }, [project])

  const handleChange = (value: any) => {
    setRoom([])
    setCurRoom(value.target.value)
    let targetValue: string | null
    //联动form表单中户室号数据变化
    if (value.target.value === 'all') {
      targetValue = null
      let room: any = []
      building.map((item: any) => {
        room = room.concat(item.buildingHouses)
      })
      setRoom(room)
    } else {
      targetValue = value.target.value
      let room: any = []
      building.map((item: any) => {
        if (item.buildingNumber === value.target.value) {
          room = item.buildingHouses
        }
      })
      setRoom(room)
    }
    dispatch({
      type: 'project/getHostList',
      payload: {
        page: 1,
        page_size: 10,
        projectId,
        buildingNumber: targetValue,
      },
    })
  }

  const onRemove = (record: any) => {
    if (record) {
      try {
        dispatch({
          type: 'project/delete',
          payload: {
            id: Number(record),
          },
        })
        //删除后返回项目列表页
        history.push('/host-management/project/list')
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleCopy = (value: any) => {
    if (copy(value)) {
      message.success('ID号已复制')
    } else message.error('复制失败，请手动复制')
  }
  const columns = [
    {
      title: '户室号',
      dataIndex: 'houseNumber',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '主机ID',
      dataIndex: 'hostIds',
      ellipsis: true,
      render: (text: any) => (
        <span>
          <CopyOutlined onClick={() => handleCopy(text)} />
          {text ? text : '--'}{' '}
        </span>
      ),
    },
    {
      title: '主机型号',
      dataIndex: 'hardWard',
      filters: [
        { value: 'ALLWINNER', text: 'AI MIND' },
        { value: 'Raspberry', text: '蜂巢' },
      ],
      filteredValue: filteredInfo.hardWard || null,
      render: (text: any) =>
        text ? (text == 'ALLWINNER' ? 'AI MIND' : text == 'Raspberry' ? '蜂巢' : text) : '蜂巢',
    },
    {
      title: '主机当前版本号',
      dataIndex: 'hostVersion',
      render: (text: any) => (text === 'unknown' ? '--' : text ? text : '--'),
    },
    {
      title: '主机状态',
      dataIndex: 'status',
      filters: [
        // { value: 'FACTORY', text: '出厂' },
        // { value: 'SCRAP', text: '报废' },
        // { value: 'REWORK', text: '返修' },
        { value: 'INSTALL', text: '激活' },
        { value: 'BIND', text: '绑定' },
      ],
      filteredValue: filteredInfo.status || null,
      render: (text: any) => {
        if (text == 'FACTORY') {
          return '出厂'
        } else if (text == 'SCRAP') {
          return '报废'
        } else if (text == 'REWORK') {
          return '返修'
        } else if (text == 'INSTALL') {
          return '激活'
        } else if (text == 'BIND') {
          return '绑定'
        } else {
          return '--'
        }
      },
    },
    {
      title: '在线情况',
      dataIndex: 'onLine',
      filters: [
        { value: 'success', text: '在线' },
        { value: 'error', text: '离线' },
      ],
      filteredValue: filteredInfo.onLine || null,
      render: (online: any) => (
        <Badge status={online ? 'success' : 'error'} text={online ? '在线' : '离线'} />
      ),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          <a href={`/host-management/host/list/${record.hostIds}`} target="_blank">
            查看详情
          </a>
        </>
      ),
    },
  ]
  const handleTableChange = (pagination: any, filters: any) => {
    setFilteredInfo(filters)
    dispatch({
      type: 'project/getHostList',
      payload: {
        page: pagination.current,
        page_size: pagination.pageSize,
        projectId,
        ...buildingForm,
        ...filters,
      },
    })
  }
  const handleFormReset = () => {
    form.resetFields()
    setFilteredInfo({})
    setBuildingForm({})
    setCurRoom('all')
    try {
      dispatch({
        type: 'project/getHostList',
        payload: {
          page: 1,
          page_size: 10,
          projectId,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }
  const renderForm = () => {
    const handleSubmit = (values: any) => {
      setBuildingForm(values)
      dispatch({
        type: 'project/getHostList',
        payload: {
          page: 1,
          page_size: 10,
          projectId,
          buildingNumber: curRoom && curRoom != 'all' ? curRoom : null,
          ...values,
        },
      })
    }
    return (
      <Form onFinish={handleSubmit} form={form} layout="inline">
        <Row className={styles.header}>
          <Col span={8}>
            <Radio.Group value={curRoom} onChange={handleChange} buttonStyle="solid">
              <Radio.Button value="all">全部</Radio.Button>
              {building &&
                building.map((item: any) => (
                  <Radio.Button value={item.buildingNumber}>{item.buildingNumber}</Radio.Button>
                ))}
            </Radio.Group>
          </Col>
          <Col span={6}>
            <FormItem label="户室号" name="houseNumber">
              <Select allowClear>
                {room &&
                  room.map((item: any, index: any) => (
                    <Option key={index} value={item.buildingHouse}>
                      {item.buildingHouse}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="设备ID" name="hostId">
              <Input allowClear />
            </FormItem>
          </Col>
          <Col span={4} style={{ paddingLeft: 10 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handleFormReset} type="primary">
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
  const renderContent = (data: any) => {
    return (
      <Descriptions>
        <DescriptionItem label="社区">{data.buildingName}</DescriptionItem>
        <DescriptionItem label="楼号">
          {data.buildingNumber ? data.buildingNumber : '--'}
        </DescriptionItem>
        <DescriptionItem label="项目经理">
          {data.projectUserName ? data.projectUserName : '--'}
        </DescriptionItem>
        <DescriptionItem label="项目成员">
          {data.worker && data.worker.map((item: any) => item.name + ' ')}
        </DescriptionItem>
        <DescriptionItem label="创建时间">
          {data.createdTime ? moment(data.createdTime).format('YYYY-MM-DD') : '--'}
        </DescriptionItem>
        <DescriptionItem label="项目介绍">{data.remark}</DescriptionItem>
        <DescriptionItem label="主机总数" span={3}>
          {data.hostNum | 0} 台
        </DescriptionItem>
        <DescriptionItem label="激活">{data.activeHostNum} 台</DescriptionItem>
        <DescriptionItem label="今日激活" span={2}>
          {data.todayActiveHostNum} 台
        </DescriptionItem>
        <DescriptionItem label="绑定">{data.bindHostNum} 台</DescriptionItem>
        <DescriptionItem label="今日绑定" span={2}>
          {data.todayBindHostNum} 台
        </DescriptionItem>
      </Descriptions>
    )
  }

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
  }
  const handleSubmit = async (values: any) => {
    let buildingNumber: any[] = []
    let buildingHostNum: any[] = []
    let hostNum: number = 0
    values.room.map((item: any) => {
      buildingNumber.push(item.buildingNum)
      buildingHostNum.push(item.hostCount)
      hostNum += Number(item.hostCount)
    })
    let buildingNumberList: any[] = []
    currentRoom.forEach((element: any) => {
      let repeat = false //标记原始的楼号是否存在
      //将修改的楼号放入buildingNumberList
      values.room.forEach((item: any) => {
        if (element.id === item.id) {
          repeat = true
          buildingNumberList.push({
            buildingNumber: element.buildingNum,
            newBuildingNumber: item.buildingNum,
          })
        }
      })
      //将删除的楼号放入buildingNumberList
      if (!repeat) {
        buildingNumberList.push({
          buildingNumber: element.buildingNum,
          newBuildingNumber: null,
        })
      }
    })
    //将新增的楼号放入buildingNumberList
    values.room.forEach((item: any) => {
      if (!item.id) {
        buildingNumberList.push({
          buildingNumber: null,
          newBuildingNumber: item.buildingNum,
        })
      }
    })
    const data = {
      id: projectId,
      projectName: values.projectName,
      buildingId: values.buildingName,
      buildingNumber: buildingNumber.toString(),
      buildingHostNum: buildingHostNum.toString(),
      hostNum: hostNum,
      buildingNumberList: buildingNumberList,
      projectUser: values.projectManager,
      workers: values.workers.toString(),
      remark: values.remark,
      projectType: 'SMART_HOME',
    }
    //修改
    try {
      await dispatch({
        type: 'project/update',
        payload: {
          ...data,
        },
      })
      message.success('修改成功')
      dispatch({
        type: 'project/getProject',
        payload: {
          id: projectId,
        },
      })
    } catch (err) {
      console.log(err)
    }

    handleModalVisible()
  }

  return (
    <>
      <div className={styles.cardBox}>
        <Card
          title={project.projectDetail.projectName}
          bordered={false}
          style={{ marginBottom: 24 }}
        >
          {renderContent(project.projectDetail)}
        </Card>
        {/* {canEdit && (
          <div className={styles.updateDelete}>
            <a
              onClick={() => {
                setVisible(true)
              }}>
              修改
            </a>
            <Divider type="vertical" />
            <TableDeleteBtn onDelete={() => onRemove(projectId)} />
          </div>
        )} */}
      </div>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        loading={loading}
        showPagination={true}
        data={project.hostList}
        columns={columns}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />
      <ProjectForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        buildingOptions={buildingOptions}
        userList={userList}
        currentProjectDetail={currentProjectDetail}
      />
    </>
  )
}
export default connect(({ project, loading }: ConnectState) => ({
  project,
  loading: loading.models.project,
}))(ProjectDetail)
