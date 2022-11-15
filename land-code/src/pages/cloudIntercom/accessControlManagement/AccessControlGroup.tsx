import React, { useCallback, useEffect, useState } from 'react'
import {
  Input,
  Form,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Radio,
  Modal,
  message,
  Table,
  Cascader,
  Popconfirm,
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import moment from 'moment'
import {
  queryPermissionGroup,
  queryDeviceListByCommunityId,
  addPermissionGroup,
  updataPermissionGroup,
  delPermissionGroup,
  buildingBlockUnit,
} from '@/services/api'

const FormItem = Form.Item

const { TextArea } = Input

const AccessControlGroup = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [formdatas, setformdatas] = useState<any>({})
  const [form] = Form.useForm()

  const [currentReviewData, setCurrentReviewData] = useState<any>(null)
  const [addGroupFormVisible, setAddGroupFormVisible] = useState<boolean>(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])

  const { currCommunity } = props

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      if (currCommunity) {
        let data = {
          ...pagination,
          ...formdatas,
          buildingId: currCommunity,
        }
        queryPermissionGroup(data)
          .then(res => {
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
          .catch(e => {
            console.log('获取失败', e)
          })
      }
    },
    [formdatas, currCommunity]
  )

  useEffect(() => {
    fetch()
  }, [fetch])

  //查询门禁组
  const searchGroups = () => {
    form
      .validateFields()
      .then(res => {
        setformdatas(res)
      })
      .catch(e => {
        console.log(e, '获取searchform值错误')
      })
  }

  //重置查询
  const handelReset = () => {
    setformdatas({})
    form.resetFields()
  }

  //添加/修改门禁分组
  const userAddGroup = (values: any) => {
    if (currentReviewData) {
      let data = {
        ...values,
        id: currentReviewData.id,
      }
      updataPermissionGroup(data)
        .then(res => {
          message.success('修改成功')
          handleReviewModalVisible(false)
          fetch()
        })
        .catch(e => {
          console.log('修改失败', e)
        })
    } else {
      let data = {
        ...values,
        buildingId: currCommunity,
      }
      addPermissionGroup(data)
        .then(res => {
          message.success('创建成功')
          handleReviewModalVisible(false)
          fetch()
        })
        .catch(e => {
          console.log('新建失败', e)
        })
    }
  }

  //删除门禁分组
  const delGroup = () => {
    let data = {
      ids: selectedRowKeys,
    }
    delPermissionGroup(data)
      .then(res => {
        message.success('删除成功')
        fetch()
      })
      .catch(e => {
        console.log('删除失败', e)
      })
  }

  const renderForm = () => {
    return (
      <Form form={form} layout="inline">
        <Row className={styles.header}>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem name="groupName">
              <Input placeholder="输入门组名称搜索" />
            </FormItem>
          </Col>
          <Col span={14}>
            <Button type="primary" onClick={searchGroups}>
              查询
            </Button>
            <Button type="primary" onClick={handelReset}>
              重置
            </Button>
            <Button type="primary" onClick={() => setAddGroupFormVisible(true)}>
              <PlusOutlined />
              添加
            </Button>
            <Popconfirm title={'是否确认删除？'} onConfirm={delGroup} okText="是" cancelText="否">
              <Button type="primary">
                <DeleteOutlined />
                删除
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </Form>
    )
  }

  //添加门禁分组框状态
  const handleReviewModalVisible = (flag?: any, record?: any) => {
    setAddGroupFormVisible(!!flag)
    if (record) {
      // if (record.blockId && record.unitId) {
      //   let currRecord = {
      //     ...record,
      //     unitId: [record && record.blockId, record && record.unitId],
      //   }
      //   setCurrentReviewData(currRecord)
      // } else {
        let currRecord = {
          ...record,
          unitId: [],
        }
        setCurrentReviewData(currRecord)
      // }
    }
    else {
      setCurrentReviewData(null)
    }
  }

  const AddGroupForm = (props: any) => {
    const { visible, data, currCommunity, handleSubmit, oncancel } = props
    const [accessCrlList, setAccessCrlList] = useState<any[]>([])
    const [selecteDevices, setSelecteDevices] = useState<any[]>([])
    const [treeBlockUnitList, setTreeBlockUnitList] = useState<any>()
    const [currUnitId, setCurrUnitId] = useState<any>(data ? data.unitId[1] : null)
    const [form] = Form.useForm()
    const [searchform] = Form.useForm()

    useEffect(() => {
      if (currCommunity) {
        fetchBuildingBlockUnit(currCommunity)
      }
    }, [currCommunity])

    useEffect(() => {
      form.resetFields()
      if (data && data.deviceNo) {
        setSelecteDevices(data.deviceNo.split(',').map(Number))
      }
    }, [data])

    useEffect(() => {
      fetchAccessCrlList()
      searchform.resetFields()
    }, [currUnitId])

    const search = () => {
      searchform
        .validateFields()
        .then(res => {
          fetchAccessCrlList(res)
        })
        .catch(e => {
          console.log(e, '获取searchform值错误')
        })
    }

    const resetSearch = () => {
      searchform.resetFields()
      form.setFieldsValue({ unitId: null })
      setCurrUnitId('')
      let data = {}
      queryDeviceListByCommunityId(data)
        .then(res => {
          setAccessCrlList(res)
        })
        .catch(e => {
          console.log('获取失败', e)
        })
    }

    const fetchBuildingBlockUnit = (id: any) => {
      buildingBlockUnit(id)
        .then(res => {
          let treeBuildingBlockUnit: any = []
          res.blockList.map((block: any) => {
            let unitArray: any[] = []
            let blockData = {
              value: block.id,
              label: block.blockName,
              children: unitArray,
            }
            treeBuildingBlockUnit.push(blockData)
            block.unitList.forEach((unit: any) => {
              let unitData = {
                value: unit.id,
                label: unit.unitName,
              }
              unitArray.push(unitData)
            })
          })
          setTreeBlockUnitList(treeBuildingBlockUnit)
        })
        .catch(e => {
          console.log('获取失败', e)
        })
    }

    const fetchAccessCrlList = useCallback(
      (queryData?: any) => {
        if (currUnitId) {
          let data = {
            buildingId: currCommunity,
            unitId: currUnitId,
            ...queryData,
          }
          queryDeviceListByCommunityId(data)
            .then(res => {
              setAccessCrlList(res)
            })
            .catch(e => {
              console.log('获取失败', e)
            })
        }
        else {
          let data = {
            ...queryData,
          }
          queryDeviceListByCommunityId(data)
            .then(res => {
              setAccessCrlList(res)
            })
            .catch(e => {
              console.log('获取失败', e)
            })
        }
      },
      [currCommunity, currUnitId]
    )

    const renderSearchForm = () => {
      return (
        <Form form={searchform} layout="inline">
          {/* <Row className={styles.header}> */}
          <Row gutter={24}>
            <Col md={8} sm={24}>
              <FormItem name="deviceName" label="门禁名称">
                <Input />
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem name="deviceNo" label="门禁序列号">
                <Input />
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem>
                <Button type="primary" onClick={search}>
                  查询
                </Button>
                <Button type="primary" onClick={resetSearch}>
                  重置
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      )
    }

    const rowSelection = {
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        setSelecteDevices(selectedRowKeys)
      },
      selectedRowKeys: selecteDevices,
      // getCheckboxProps: (record: any) => ({
      //   disabled: record.name === 'Disabled User', // Column configuration not to be checked
      //   name: record.name,
      // }),
    }

    const listColumns = [
      {
        title: '序号',
        dataIndex: 'id',
        render: (text: any) => (text ? text : '--'),
      },
      {
        title: '门禁名称',
        dataIndex: 'deviceName',
        render: (text: any) => (text ? text : '--'),
      },
      {
        title: '安装位置',
        dataIndex: 'concatName',
        render: (text: any) => (text ? text : '--'),
      },
    ]

    const onChange = (v: any) => {
      if (v.length == 0) {
        setAccessCrlList([])
        searchform.setFieldsValue({
          deviceName: null,
          deviceNo: null,
        })
      }
      setCurrUnitId(v[1])
    }

    const okHandle = () => {
      form
        .validateFields()
        .then(values => {
          let params = {
            ...values,
            deviceId: selecteDevices,
          }
          handleSubmit(params)
        })
        .catch(info => {
          console.log('Validate Failed:', info)
        })
    }
    const cancelHandle = () => {
      oncancel()
    }

    return (
      <Modal
        visible={visible}
        title={`${data ? '修改' : '新增'}门组`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
        width={800}
      >
        <Form
          form={form}
          labelAlign="right"
          preserve={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={data}
        >
          <div className={styles.form_content}>
            <div style={{ width: '80%' }}>
              <FormItem
                label="名称"
                name="groupName"
                rules={[{ required: true, message: '不能为空' }]}
              >
                <Input />
              </FormItem>
            </div>
          </div>
          <div className={styles.form_content}>
            <div style={{ width: '90%' }}>
              <FormItem
                label="门组所在单元"
                name="unitId"
              >
                <Cascader options={treeBlockUnitList && treeBlockUnitList} onChange={onChange} />
              </FormItem>
              <FormItem label="备注" name="remark">
                <TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
              </FormItem>
              <FormContainer>{renderSearchForm()}</FormContainer>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                columns={listColumns}
                dataSource={accessCrlList}
                rowKey={(record: any, index: any) => record.id}
              />
            </div>
          </div>
        </Form>
      </Modal>
    )
  }

  const handleTableChange = (query: any) => {
    fetch({
      page: query.current,
      page_size: query.pageSize,
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '门组名称',
      dataIndex: 'groupName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '门禁点',
      dataIndex: 'deviceName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <a onClick={() => handleReviewModalVisible(true, record)}>编辑</a>
      ),
    },
  ]

  return (
    <>
      <div className={styles.owner}>
        <div className={styles.content}>
          <FormContainer>{renderForm()}</FormContainer>
          <StandardTable
            loading={loading}
            showPagination={true}
            data={data}
            columns={columns}
            rowKey={(record: any, index: number) => record.id}
            selectedRowKeys={selectedRowKeys}
            onSelectRow={v => setSelectedRowKeys(v)}
            onChange={handleTableChange}
          />
          <AddGroupForm
            visible={addGroupFormVisible}
            data={currentReviewData}
            currCommunity={currCommunity}
            handleSubmit={userAddGroup}
            oncancel={() => handleReviewModalVisible(false)}
          />
        </div>
      </div>
    </>
  )
}
export default AccessControlGroup
