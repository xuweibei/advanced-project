import React, { useState, useEffect, useCallback } from 'react'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { Button, Divider, Form, Modal, Input, Select, message, Row, Col, Menu, Radio } from 'antd'
import StandardTable from '@/components/StandardTable'
import styles from './equipmentConfiguration.less'
import { ColumnsType } from 'antd/lib/table'
import {
  getDevicePage,
  delDoorDevice,
  upDateDevice,
  upDateSIPDevice,
  getPermission2Level,
  addDevice,
  getBuildingById,
  queryHouseUnitByBuildingId,
  searchFailedRecord,
} from '@/services/api'

const FormItem = Form.Item

const statusList = [
  {
    label: '离线',
    value: 0,
  },
  {
    label: '在线',
    value: 1,
  },
]

function equipmentConfiguration() {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [isVisiable, setIsVisiable] = useState<boolean>(false)
  const [isSIPVisiable, setIsSIPVisiable] = useState<boolean>(false)
  const [failedRecordVisiable, setFailedRecordVisiable] = useState<boolean>(false)
  const [failedRecordCount, setFailedRecordCount] = useState<any>(0)
  const [failedRecordData, setFailedRecordData] = useState<any>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [upDevice, setupDevice] = useState<any>()
  const [upSIP, setupSIP] = useState<any>()
  const [currCommunityId, setCurrCommunityId] = useState<any>()
  const [area, setArea] = useState<any[]>([])
  const [buildingList, setbuildingList] = useState<any[]>([])
  const [buildingArea, setbuildingArea] = useState<any>()
  const [MdoelForm] = Form.useForm()
  const [SIPForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [formdatas, setFormdatas] = useState<any>()
  const { SubMenu } = Menu

  const getStatus = (value: any) => {
    const status = statusList.find((item: any) => item.value == value)
    return status ? status.label : '--'
  }

  //刷新页面
  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          ...formdatas,
          buildingId: currCommunityId,
        }
        getDevicePage(data).then((res: any) => {
          setLoading(false)
          setData({
            list: res.results,
            pagination: {
              total: res.count,
              current: pagination.page,
              pageSize: pagination.page_size,
            },
          })
        })
      }
    },
    [currCommunityId, formdatas]
  )
  useEffect(() => {
    getPermission2Level().then(res => {
      setArea(res.regions)
      setCurrCommunityId(res.regions[0].buildings[0].id)
    })
  }, [])
  useEffect(() => {
    fetch()
  }, [fetch])

  useEffect(() => {
    if (currCommunityId) {
      getAreaName()
      getBuildingById(currCommunityId).then(res => {
        setbuildingList(res)
      })
    } else {
      setData([])
    }
  }, [currCommunityId])

  //修改设备名称
  const hOk = () => {
    MdoelForm.validateFields()
      .then(values => {
        const id = upDevice.id
        upDateDevice(id, { name: values.deviceName, remoteOpen: values.remoteOpen }).then(res => {
          message.success('修改成功！')
          fetch()
          setupDevice(null)
          setIsVisiable(false)
        })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  const hCancel = () => {
    setIsVisiable(false)
    MdoelForm.resetFields()
  }
  const updateD = () => {
    setIsVisiable(true)
    MdoelForm.resetFields()
  }

  const SIPOk = () => {
    SIPForm.validateFields()
      .then(values => {
        const id = upSIP.id
        let data = {}
        data = {
          proxy: values.proxy,
          proxyPort: parseInt(values.proxyPort),
          userName: values.userName,
          password: values.password,
          expires: 15,
        }
        upDateSIPDevice(id, data).then(res => {
          SIPForm.resetFields()
          message.success('配置成功！')
          fetch()
          setIsSIPVisiable(false)
        })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const SIPCancel = () => {
    setIsSIPVisiable(false)
    SIPForm.resetFields()
  }

  const updateSIP = async (data: any) => {
    setupSIP(data)
    const { proxy, proxyPort, userName, password, ...others } = data;
    const formValues = { ...others, proxy , proxyPort, userName, password }
    SIPForm.setFieldsValue(formValues);
    setIsSIPVisiable(true)
  }

  const failedRecordModal = () => {
    setFailedRecordVisiable(!failedRecordVisiable)
  }

  const areaMenu = () => {
    const handleClick = (e: any) => {
      setCurrCommunityId(e.key)
    }
    const defaultArea = area && area[0]
    const defaultBuilding = defaultArea && defaultArea.buildings[0]

    return (
      <>
        {defaultArea && defaultArea.id && (
          <Menu
            defaultSelectedKeys={[`${defaultBuilding && defaultBuilding.id}`]}
            defaultOpenKeys={[`${defaultArea && defaultArea.id}`]}
            style={{ width: '100%' }}
            mode="inline"
          >
            {area.map((areaItem: any) => (
              <SubMenu key={areaItem.id} title={areaItem.name}>
                {areaItem.buildings &&
                  areaItem.buildings.map((building: any) => (
                    <Menu.Item key={building.id} onClick={v => handleClick(v)}>
                      {building.name}
                    </Menu.Item>
                  ))}
              </SubMenu>
            ))}
          </Menu>
        )}
      </>
    )
  }

  const failedRecordColumns: any = [
    {
      title: '人员编号',
      dataIndex: 'employeeNo',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '权限类型',
      dataIndex: 'authType',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '下发状态',
      dataIndex: 'authStatus',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '错误码',
      dataIndex: 'errorCode',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '错误描述',
      dataIndex: 'errorMsg',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '解决方案',
      dataIndex: 'resolve',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: any, record: any) => (text ? text : '--'),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text: any, record: any) => (text ? text : '--'),
    },
  ]

  const queryFailedRecord = useCallback(
    (pagination: any = { page: 1, page_size: 10 }, id?: any) => {
      setLoading(true)
      let data = {
        ...pagination,
        deviceSerial: upDevice ? upDevice.doorDeviceNo : id,
      }
      searchFailedRecord(data)
        .then(res => {
          setLoading(false)
          setFailedRecordCount(res.total)
          setFailedRecordData({
            list: res.rows,
            pagination: {
              total: res.total,
              current: pagination.page,
              pageSize: pagination.page_size,
            },
          })
        })
        .catch(e => {
          console.log('获取失败', e)
        })
    },
    [upDevice]
  )

  const queryFailedRecordList = (query: any) => {
    queryFailedRecord({
      page: query.current,
      page_size: query.pageSize,
    })
  }

  //失败记录查询
  const FailedRecordList = () => {
    return (
      <Modal
        getContainer={false}
        visible={failedRecordVisiable}
        title={`共计失败${failedRecordCount}条`}
        closable={false}
        width={'550'}
        footer={[
          <Button type="primary" key="back" onClick={failedRecordModal}>
            关闭
          </Button>,
        ]}
      >
        <StandardTable
          loading={loading}
          showPagination={true}
          data={failedRecordData}
          columns={failedRecordColumns}
          rowKey={(record: any, index: number) => record.id}
          onChange={queryFailedRecordList}
        />
      </Modal>
    )
  }

  //修改/新增SIP弹窗
  const renderSIPForm = () => {
    return (
      <Modal
        getContainer={false}
        visible={isSIPVisiable}
        title={`配置`}
        okText="确认"
        cancelText="取消"
        onCancel={SIPCancel}
        onOk={SIPOk}
      >
        <Form form={SIPForm} initialValues={upSIP}>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="SIP代理服务器地址"
            name="proxy"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input autoFocus={true} />
          </FormItem>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="SIP代理服务器端口"
            name="proxyPort"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input autoFocus={true} />
          </FormItem>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="SIP用户名"
            name="userName"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input autoFocus={true} />
          </FormItem>
          <FormItem
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 15 }}
            label="SIP密码"
            name="password"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input autoFocus={true} />
          </FormItem>
        </Form>
      </Modal>
    )
  }

  //修改设备弹窗
  const UpdateDevice = (props: any) => {
    const { data } = props
    useEffect(() => {
      MdoelForm.resetFields()
    }, [data])
    return (
      <Modal
        getContainer={false}
        visible={isVisiable}
        title={`修改设备名`}
        okText="确认"
        cancelText="取消"
        onCancel={hCancel}
        onOk={hOk}
      >
        <Form form={MdoelForm} initialValues={data}>
          <FormItem
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 15 }}
            label="输入新设备名"
            name="deviceName"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Input autoFocus={true} />
          </FormItem>
          <FormItem
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 15 }}
            label="是否支持“一键开门”"
            name="remoteOpen"
            rules={[{ required: true, message: '不能为空' }]}
          >
            <Radio.Group defaultValue={1}>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>
          </FormItem>
        </Form>
      </Modal>
    )
  }
  //删除设备
  const onRemove = (record: any) => {
    delDoorDevice(record.id)
      .then(res => {
        message.success('删除成功')
        fetch()
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getColumns = (): ColumnsType => {
    const columns: ColumnsType = [
      {
        title: '设备序列号',
        dataIndex: 'doorDeviceNo',
        render: (text: any, record: any) => (text ? text : '--'),
      },
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        render: (text: any, record: any) => (text ? text : '--'),
      },
      {
        title: '设备型号',
        dataIndex: 'deviceModel',
        render: (text: any, record: any) => (text ? text : '--'),
      },
      {
        title: '设备地址',
        dataIndex: 'concatName',
        render: (text: any, record: any) => (text ? text : '--'),
      },
      {
        title: '操作',
        render: (text: any, record: any) => (
          <>
            <a
              onClick={() => {
                updateSIP(record)
              }}
            >
              配置
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                updateD()
                setupDevice(record)
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <TableDeleteBtn onDelete={() => onRemove(record)} />
            <Divider type="vertical" />
            <a
              onClick={() => {
                failedRecordModal()
                setupDevice(record)
                queryFailedRecord(
                  {
                    page: 1,
                    page_size: 10,
                  },
                  record.doorDeviceNo
                )
              }}
            >
              下发查询
            </a>
          </>
        ),
      },
    ]
    return columns
  }
  //翻页
  const handleTableChange = (query: any) => {
    fetch({
      page: query.current,
      page_size: query.pageSize,
    })
  }
  const getAreaName = () => {
    area.map((areaItem: any) => {
      areaItem.buildings.map((building: any) => {
        if (building.id == currCommunityId) {
          setbuildingArea(building.name)
        }
      })
    })
  }
  //添加设备
  const AddService = (props: any) => {
    const [unitList, setunitList] = useState<any[]>([])
    const [buildingAddress, setbuildingAddress] = useState<any>('')
    const [unitAddress, setunitAddress] = useState<any>()
    const [blockNo, setblockNo] = useState('')
    const { data } = props
    const [form] = Form.useForm()
    useEffect(() => {
      form.setFieldsValue(data)
    }, [data])

    const okHandle = () => {
      form
        .validateFields()
        .then(values => {
          let params = {
            ...values,
            concatName: buildingArea + buildingAddress + unitAddress,
            buildingId: currCommunityId,
            blockNo: blockNo,
            remoteOpen: 1,
          }
          addDevice(params)
            .then(res => {
              message.success('添加成功！')
              fetch()
              setIsModalVisible(false)
            })
            .catch(e => {
              console.log(e)
            })
        })
        .catch(info => {
          console.log('Validate Failed:', info)
        })
    }

    const handleCancel = () => {
      setIsModalVisible(false)
    }

    const getUnitList = (id: any) => {
      buildingList.map(item => {
        if (item.id == id) {
          setbuildingAddress(item.blockName)
          setblockNo(item.blockNo)
        }
      })
      queryHouseUnitByBuildingId(id).then(res => {
        setunitList(res)
        form.setFieldsValue({ unitId: null })
      })
    }

    const getUnitAddress = (values: any) => {
      unitList.map(item => {
        if (item.id == values) {
          setunitAddress(item.unitName)
        }
      })
    }

    return (
      <>
        <Modal
          visible={isModalVisible}
          forceRender
          title={`添加设备`}
          okText="添加"
          cancelText="取消"
          onCancel={handleCancel}
          onOk={okHandle}
        >
          <Form form={form}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="设备序列号"
              name="doorDeviceNo"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input autoFocus={true} />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="设备名称"
              name="deviceName"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="设备验证码"
              name="deviceCode"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="社区"
              name="buildingName"
              initialValue={buildingArea}
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Input disabled></Input>
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="所在楼栋"
              name="blockId"
            >
              <Select onChange={e => getUnitList(e)}>
                {buildingList.map(buildingItem => {
                  return (
                    <Select.Option key={buildingItem.id} value={buildingItem.id}>
                      {buildingItem.blockName}
                    </Select.Option>
                  )
                })}
              </Select>
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="所在单元"
              name="unitId"
            >
              {unitList && (
                <Select onChange={e => getUnitAddress(e)}>
                  {unitList.map(unitItem => {
                    return (
                      <Select.Option key={unitItem.id} value={unitItem.id}>
                        {unitItem.unitName}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    )
  }

  //查询设备
  const handleSearch = () => {
    searchForm
      .validateFields()
      .then(res => {
        setFormdatas(res)
      })
      .catch(e => {
        console.log('获取表单内容失败', e)
      })
  }

  //重置查询
  const reset = () => {
    searchForm.resetFields()
    fetch()
  }
  const showModal = () => {
    setIsModalVisible(true)
  }
  return (
    <div className={styles.continer}>
      <div className={styles.menu}>
        <div className={styles.title}>全部区域</div>
        <div className={styles.menu_content}>{areaMenu()}</div>
      </div>
      <div className={styles.list}>
        <AddService visiable={isVisiable} data={data} />
        <Form form={searchForm} onFinish={handleSearch}>
          <Row>
            <Col span={6}>
              <FormItem name="doorDeviceNo">
                <Input placeholder="搜索设备序列号/名称" />
              </FormItem>
            </Col>
            <Col span={8} style={{ paddingLeft: 10 }}>
              <FormItem>
                <Button htmlType="submit" type="primary">
                  查询
                </Button>
                <Button
                  style={{ marginLeft: 5 }}
                  type="primary"
                  htmlType="submit"
                  onClick={() => reset()}
                >
                  重置
                </Button>
                <Button style={{ marginLeft: 15 }} onClick={() => showModal()} type="primary">
                  +添加设备
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <UpdateDevice data={upDevice} />
        {renderSIPForm()}
        <FailedRecordList />
        <StandardTable
          loading={loading}
          data={data}
          showPagination={true}
          columns={getColumns()}
          rowKey={(record: any) => record.id}
          onChange={handleTableChange}
        />
      </div>
    </div>
  )
}
export default equipmentConfiguration
