import React, { FC, useEffect, useState } from 'react'
import { ConnectProps, Dispatch, connect, history } from 'umi'
import {
  Card,
  message,
  Input,
  Form,
  Row,
  Col,
  Button,
  Modal,
  Select,
  List,
  Space,
  Pagination,
} from 'antd'

import styles from './index.less'
import moment from 'moment'
import { ConnectState } from '@/models/connect'
import { ProjectModelState } from '@/models/project'
import FormContainer from '@/components/FormContainer'
import useLocation from '@/hooks/useLocation'
import useCanEdit from '@/hooks/useCanEdit'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { getProjectUser, getProjectUsersByCurrentRole } from '@/services/api'

const ListItem = List.Item
const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

interface PageProps extends ConnectProps {
  dispatch: Dispatch
  project: ProjectModelState
  loading: boolean
}

const ProjectForm = (props: any) => {
  const { visible, handleSubmit, handleModalVisible, userList } = props
  const { buildingOptions } = useLocation()

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
      onOk={okHandle}
    >
      <Form form={form} labelAlign="left" preserve={false}>
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
          <Select allowClear style={{ width: '100%' }}>
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

const IndexPage: FC<PageProps> = ({ project, dispatch, loading }) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [projectManager, setProjectManager] = useState<any>([])
  const [userList, setUserList] = useState<any>([])
  const canEdit = useCanEdit()

  const [form] = Form.useForm()

  const { regions, setArea, setCity, setBuilding, cityOptions, buildingOptions } = useLocation()

  useEffect(() => {
    getProManager()
    getProjectUser().then((res: any) => {
      setUserList(res)
    })
  }, [])

  const getProManager = async () => {
    const res = await getProjectUsersByCurrentRole()
    setProjectManager(res)
  }

  useEffect(() => {
    dispatch({
      type: 'project/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 12,
      },
    })
  }, [])

  const handleSubmit = async (values: any) => {
    let buildingNumber: any[] = []
    let buildingHostNum: any[] = []
    let hostNum: number = 0
    values.room.map((item: any) => {
      buildingNumber.push(item.buildingNum)
      buildingHostNum.push(item.hostCount)
      hostNum += Number(item.hostCount)
    })
    const data = {
      projectName: values.projectName,
      buildingId: values.buildingName,
      buildingNumber: buildingNumber.toString(),
      buildingHostNum: buildingHostNum.toString(),
      hostNum: hostNum,
      projectUser: values.projectManager,
      workers: values.workers.toString(),
      remark: values.remark,
      projectType: 'SMART_HOME',
    }
    //新建
    try {
      await dispatch({
        type: 'project/save',
        payload: {
          ...data,
        },
      })
      message.success('新增成功')
    } catch (err) {
      console.log(err)
    }

    handleModalVisible()
  }
  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
  }

  const handleSearch = (values: any) => {
    const { buildingId } = values
    /**
     * 根据区域、城市、社区筛选时，其实都是根据社区筛选。
     * 如果选择了社区，则查询该社区，如果没有选择，则查询所有可选的社区
     */
    if (buildingId) {
      values.buildingIds = buildingId
    } else {
      let building: any[] = []
      buildingOptions.forEach((item: any) => {
        building.push(item.id)
      })
      values.buildingIds = building
    }
    if (!values.regionId && !values.cityId && !values.buildingId) {
      values.buildingIds = null
    }
    dispatch({
      type: 'project/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 12,
        ...values,
      },
    })
  }

  const handelReset = () => {
    form.resetFields()
    setArea(undefined)
    setCity(undefined)
    setBuilding(undefined)
    dispatch({
      type: 'project/fetch',
      payload: {
        pageIndex: 1,
        pageCount: 12,
      },
    })
  }
  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <Row className={styles.header} gutter={16}>
          {/* <Col span={6}>
            <FormItem label="区域" name="regionId">
              <Select
                allowClear
                onChange={v => {
                  form.setFieldsValue({
                    cityId: null,
                    buildingId: null,
                  })
                  return setArea(v)
                }}>
                {regions &&
                  regions.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="城市" name="cityId">
              <Select
                allowClear
                onChange={v => {
                  form.setFieldsValue({
                    buildingId: null,
                  })
                  return setCity(v)
                }}>
                {cityOptions &&
                  cityOptions.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="社区" name="buildingId">
              <Select allowClear onChange={v => setBuilding(v)}>
                {buildingOptions &&
                  buildingOptions.map((item: any) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col> */}
          <Col span={6}>
            <FormItem label="项目名称" name="projectName">
              <Input allowClear />
            </FormItem>
          </Col>
          {/* <Col span={6}>
            <FormItem label="项目经理" name="projectUser">
              <Select allowClear>
                {projectManager &&
                  projectManager.map((item: any) => (
                    <Option key={item.projectUser} value={item.projectUser}>
                      {item.projectUserName}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col> */}
          <Col span={6}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handelReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }

  const renderItem = (item: any) => {
    return (
      <ListItem>
        <a href={`/host-management/project/list/${item.id}`} target="_blank">
          <Card hoverable style={{ borderRadius: 20 }}>
            <div className={styles.project}>
              <p className={styles.projectName}>
                <span className={styles.titleName} title={item.projectName}>
                  {item.projectName}
                </span>
              </p>
              <div className={styles.data}>
                <p className={styles.name}>
                  社区
                  <span>
                    <b>{item.buildingName}</b>
                  </span>
                </p>
              </div>
              <div className={styles.data}>
                <p className={styles.name}>
                  楼号
                  <span>
                    <b>{item.buildingNumber}</b>
                  </span>
                </p>
              </div>
              <div className={styles.data}>
                <p className={styles.name}>
                  项目经理
                  <span>
                    <b>{item.projectUserName}</b>
                  </span>
                </p>
              </div>
              <div className={styles.data}>
                <p className={styles.name}>
                  创建时间
                  <span>
                    <b>{moment(item.createdTime).format('YYYY-MM-DD')}</b>
                  </span>
                </p>
              </div>
              <div>
                <div className={styles.data}>
                  <p className={styles.name}>
                    主机总数
                    <span>
                      <b>{item.hostNum || 0} 台</b>
                    </span>
                  </p>
                </div>
                <div className={styles.data}>
                  <p className={styles.name}>
                    激活主机
                    <span>
                      <b>{item.activeHostNum || 0} 台</b>
                    </span>
                  </p>
                </div>
                <div className={styles.data}>
                  <p className={styles.name}>
                    绑定主机
                    <span>
                      <b>{item.bindHostNum || 0} 台</b>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </a>
      </ListItem>
    )
  }

  const handleTableChange = (page: any) => {
    const values = form.getFieldsValue()
    const { buildingId } = values
    if (buildingId) {
      values.buildingIds = buildingId
    } else {
      let building: any[] = []
      buildingOptions.forEach((item: any) => {
        building.push(item.id)
      })
      values.buildingIds = building
    }
    if (!values.regionId && !values.cityId && !values.buildingId) {
      values.buildingIds = null
    }
    dispatch({
      type: 'project/fetch',
      payload: {
        pageIndex: page,
        pageCount: 12,
        ...values,
      },
    })
  }

  return (
    <>
      <FormContainer>{renderForm()}</FormContainer>
      {/* {canEdit && (
        <Button
          className={styles.marginBottom}
          type="primary"
          htmlType="submit"
          onClick={() => {
            setVisible(true)
          }}>
          <PlusOutlined />
          新增项目
        </Button>
      )} */}
      <List
        loading={loading}
        split={true}
        grid={{ gutter: 24, column: 3 }}
        dataSource={project.projectPagList.list}
        renderItem={renderItem}
      />
      <div className={styles.page}>
        <Pagination
          hideOnSinglePage={true}
          defaultCurrent={1}
          showSizeChanger={false}
          current={
            project.projectPagList.pagination.current
              ? project.projectPagList.pagination.current
              : 1
          }
          pageSize={12}
          total={project.projectPagList.pagination.total}
          onChange={handleTableChange}
        />
      </div>
      <ProjectForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        userList={userList}
      />
    </>
  )
}
export default connect(({ project, loading }: ConnectState) => ({
  project,
  loading: loading.models.project,
}))(IndexPage)
