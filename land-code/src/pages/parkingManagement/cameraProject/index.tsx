import React, { PureComponent, useState, useEffect, useCallback, FC } from 'react'
import { Dispatch, ConnectProps, connect, Link } from 'umi'
import {
  Card,
  Button,
  Divider,
  Form,
  Modal,
  Input,
  TreeSelect,
  Select,
  List,
  Cascader,
  Radio,
  Space,
  Row,
  Col,
  Alert,
  message,
} from 'antd'
import styles from './index.less'

import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { ConnectState } from '@/models/connect'
import useLocation from '../../../hooks/useLocation'
import useCanEdit from '@/hooks/useCanEdit'
import {
  getParkingProPage,
  getAllBuildingsByRoleId,
  addNewProject,
  getWorkerListUsingGET,
} from '../../../services/api'
const ListItem = List.Item
const FormItem = Form.Item
const { Option } = Select

interface BuildingProps extends ConnectProps {
  dispatch: Dispatch
  form: any
  parking: any
  loading: any
}

interface BuildingFormProps {
  dispatch: Dispatch
  visible: boolean
  onCreate: (values: any) => void
  setVisible: any
  data: any
  projectManager: any
  setProjectManager: any
  allBuildings: any
  projectManagerOptions: any[]
  allWorkers: any
}

const BuildingForm: FC<BuildingFormProps> = props => {
  const {
    visible,
    onCreate,
    setVisible,
    data,
    dispatch,
    projectManagerOptions,
    allBuildings,
    allWorkers,
  } = props
  useEffect(() => {
    dispatch({
      type: 'parking/getUserTreePromission',
      payload: localStorage.getItem('developerId'),
    })
  }, [])

  const [form] = Form.useForm()

  const okHandle = () => {
    form
      .validateFields()
      .then(values => {
        let cameraNumber: number = 0
        values.parking &&
          values.parking.forEach((park: any) => {
            cameraNumber += Number(park.buildingHostNumber)
          })
        values = {
          ...values,
          workers: values.workers ? values.workers.toString() : '',
          cameraNum: cameraNumber,
        }
        onCreate(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  const onCancel = () => {
    setVisible(false)
    form.resetFields()
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={`${data ? '修改' : '新增'}项目`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="项目名称"
          name="projectName"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="社区"
          name="buildingId"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allBuildings.map((item: any, index: any) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="项目经理"
          name="projectUser"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select allowClear>
            {projectManagerOptions &&
              projectManagerOptions.map((item: any, index: any) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="项目成员"
          name="workers"
          rules={[{ required: false }]}
        >
          <Select mode="multiple" allowClear style={{ width: '100%' }}>
            {allWorkers &&
              allWorkers.map((worker: any, index: any) => {
                return (
                  <Option key={index} value={worker.id}>
                    {worker.name}
                  </Option>
                )
              })}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="项目简介"
          name="remark"
          rules={[{ required: false }]}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  )
}

const Building: FC<BuildingProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [projectManager, setProjectManager] = useState<any>()
  const [projectName, setProjectName] = useState<string>('')
  const [allProjectManager, setAllProjectManager] = useState<any>()
  const [mockParkingData, setMockParkingData] = useState<any[]>([])
  const [allWorkers, setAllWorkers] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({ page: 1, pageSize: 8 })
  const [total, setTotal] = useState<number>()
  const [allBuildings, setAllBuildings] = useState<any>([])

  const canEdit = useCanEdit()
  const { dispatch } = props
  const {
    regions,
    area,
    setArea,
    city,
    setCity,
    building,
    setBuilding,
    cityOptions,
    buildingOptions,
  } = useLocation()
  useEffect(() => {
    initProjectManager()
    search()
  }, [])

  useEffect(() => {
    let data = {
      projectName: projectName,
      projectUser: projectManager,
      ...pagination,
    }
    console.log(data, 'datadatadatadata')
    getParkingProPage(data)
      .then(res => {
        setMockParkingData(res.results)
        setTotal(res.count)
      })
      .catch(e => {
        console.log('搜索项目失败：', e)
      })
  }, [pagination, setPagination])
  const initProjectManager = async () => {
    await getAllBuildingsByRoleId().then(res => {
      setAllBuildings(res)
    })

    await getWorkerListUsingGET().then(res => {
      setAllWorkers(res)
    })

    await getWorkerListUsingGET().then(res => {
      setAllProjectManager(res)
    })
  }

  const onCreate = (values: any) => {
    addNewProject(values)
      .then(res => {
        message.success('创建成功')
        setVisible(false)
        setPagination({ ...pagination })
      })
      .catch(e => {
        message.error('创建失败', e)
      })
  }

  const onPaginationChange = (current: number) => {
    setPagination({ ...pagination, page: current })
  }

  //搜索
  const search = useCallback(() => {
    let ids: any[] = []
    if (building) {
      ids.push(building)
    } else if (area || city) {
      buildingOptions.forEach(building => {
        ids.push(building.id)
      })
    }
    let data = {
      buildingIds: ids,
      projectName: projectName,
      projectUser: projectManager,
      ...pagination,
    }
    getParkingProPage(data)
      .then(res => {
        setMockParkingData(res.results)
        setTotal(res.count)
      })
      .catch(e => {
        console.log('搜索项目失败：', e)
      })
  }, [pagination, buildingOptions])

  //重置
  const reset = useCallback(() => {
    setArea('')
    setCity('')
    setBuilding('')
    setProjectName('')
    setProjectManager('')
    search()
  }, [])

  const renderItem = (item: any) => {
    return (
      <ListItem key={item.id} className={styles.listItem}>
        <Link to={`/camera-project/list/${item.id}`}>
          <Card className={styles.cardStyle} hoverable title={item.projectName}>
            <p>社区：{item.temiName}</p>
            <p>车库区域：{item.buildingHostNum}</p>
            <p>项目经理：{item.projectUserName}</p>
            <p>创建时间：{item.createdTime}</p>
            <p>监控总数：{item.cameraNum}台</p>
          </Card>
        </Link>
      </ListItem>
    )
  }

  const inputOnChange = (e: any) => {
    setProjectName(e.target.value)
  }

  return (
    <>
      <div className={styles.header}>
        <Row className={styles.radioContainer}>
          <Col span={8} className={styles.radioRegion}>
            <span>区域：</span>
            <Select allowClear style={{ width: '80%' }} onChange={v => setArea(v)} value={area}>
              {regions &&
                regions.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col span={8} className={styles.radioRegion}>
            <span>城市：</span>
            <Select allowClear style={{ width: '80%' }} onChange={v => setCity(v)} value={city}>
              {cityOptions.map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Col>
          <Col span={8} className={styles.radioRegion}>
            <span>社区：</span>
            <Select
              allowClear
              style={{ width: '80%' }}
              onChange={v => setBuilding(v)}
              value={building}
            >
              {buildingOptions &&
                buildingOptions.map((item: any, index: any) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
            </Select>
          </Col>
          <Col span={8} className={styles.radioRegion}>
            <span>项目名称：</span>
            <Input
              style={{ width: '80%' }}
              allowClear
              value={projectName}
              onChange={inputOnChange}
            />
          </Col>
          <Col span={8} className={styles.radioRegion}>
            <span>项目经理：</span>
            <Select
              allowClear
              style={{ width: '80%' }}
              onChange={v => setProjectManager(v)}
              value={projectManager && projectManager}
            >
              {allProjectManager &&
                allProjectManager.map((item: any, index: any) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  )
                })}
            </Select>
          </Col>
          <Col span={8} className={styles.radioContainer}>
            <Button type="primary" htmlType="submit" onClick={() => search()}>
              搜索
            </Button>
            <Button
              style={{ marginLeft: 5 }}
              type="primary"
              htmlType="submit"
              onClick={() => reset()}
            >
              重置
            </Button>
          </Col>
        </Row>
        {canEdit && (
          <Col span={6} className={styles.radioRegion}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setVisible(true)
              }}
            >
              <PlusOutlined />
              新增项目
            </Button>
          </Col>
        )}
      </div>
      <List
        split={true}
        grid={{ gutter: 16, column: 4 }}
        dataSource={mockParkingData}
        renderItem={renderItem}
        pagination={{
          ...pagination,
          total,
          onChange: page => {
            onPaginationChange(page)
          },
        }}
      />
      <BuildingForm
        dispatch={dispatch}
        visible={visible}
        onCreate={onCreate}
        projectManager={projectManager}
        allBuildings={allBuildings}
        setProjectManager={setProjectManager}
        projectManagerOptions={allProjectManager}
        allWorkers={allWorkers}
        data=""
        setVisible={setVisible}
      />
    </>
  )
}

export default connect(({ parking, loading }: ConnectState) => ({
  parking,
  loading: loading.models.account,
}))(Building)
