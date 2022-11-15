import React, { useCallback, useEffect, useState } from 'react'
import {
  Input,
  Form,
  Row,
  Col,
  Button,
  Modal,
  message,
  Tabs,
  Cascader,
  Tooltip,
  Divider,
  Card,
  Popconfirm
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'

//引用子组件
import GroupList from './settingForms/GroupList'
import StaffList from './settingForms/StaffList'
import UserList from './settingForms/UserList'

//接口
import {
  queryPermissionSettingList,
  bindPermission,
  updateUserPermission,
  delBindPermission,
  buildingBlockUnitHomes,
  updatePersonPermission,
  exportUserExce
} from '@/services/api'

const FormItem = Form.Item

const { TabPane } = Tabs
//1为物业 2为住户
const userType = [
  { label: '物业人员', value: 1 },
  { label: '住户', value: 2 },
]

const AccessControlSetting = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [formdatas, setformdatas] = useState<any>({})
  const [form] = Form.useForm()
  const [communityTree, setCommunityTree] = useState<any>()
  const [groupDetail, setGroupDetail] = useState<any>()
  const [groupVisible, setGroupVisible] = useState<boolean>(false)

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
        queryPermissionSettingList(data)
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

        buildingBlockUnitHomes(currCommunity).then(res => {
          setCommunityTree(res.blockList)
        })
      }
    },
    [formdatas, currCommunity]
  )
  useEffect(() => {
    form.resetFields()
    setformdatas({})
  }, [currCommunity])

  useEffect(() => {
    fetch()
  }, [fetch])

  //查询门禁组
  const searchGroups = () => {
    form
      .validateFields()
      .then(res => {
        let data = {
          buildingId: currCommunity,
          phone: res.phone,
          userName: res.userName,
          blockId: res.home && res.home[0] && res.home[0],
          unitId: res.home && res.home[1] && res.home[1],
          homeId: res.home && res.home[2] && res.home[2],
        }
        setformdatas(data)
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

  //添加/修改门禁权限
  const userAddGroup = (values: any) => {
    if (currentReviewData) {
      const employeeNo = currentReviewData.employeeNo.split('-')[0]
      let data = {
        ...values,
        id: currentReviewData.id,
        employeeNos: [employeeNo],
        buildingId: currCommunity,
      }
      // console.log("data = ", data)
      if (!data.doorGroupId) {
        message.error("请选择用户组！");
        return;
      }
      if ((data.doorGroupId.length * data.employeeNos.length) > 100) {
        message.error("操作记录最多支持 100 条，请减少人员或者门禁组!");
        return;
      }
      updateUserPermission(data)
        .then(res => {
          message.success('修改成功')
          handleReviewModalVisible(false)
          fetch()
        })
        .catch(e => {
          console.log('修改失败', e)
        })
    } else {
      let employeeNo: any[] = []
      values.employeeNos.forEach((item: any) => {
        let currEmployeeNo = item.split('-')[0]
        employeeNo.push(currEmployeeNo)
      })
      let data = {
        ...values,
        employeeNos: employeeNo,
      }
      console.log("data111 = ", data)
      if (!data.doorGroupId) {
        message.error("请选择用户组！");
        return;
      }
      if ((data.doorGroupId.length * data.employeeNos.length) > 100) {
        message.error("操作记录最多支持 100 条，请减少人员或者门禁组!");
        return;
      }
      
      bindPermission(data)
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

  //删除门禁权限
  const delGroup = () => {
    // console.log("selectedRowKeys = ", selectedRowKeys)
    // console.log("data = ", data);
    let a = selectedRowKeys
    // console.log('看看你是什么', a);
    if (a.length == 0) {
      message.error('请至少选择一个')
      return;
    }
    let body_data: any = [];
    data.list.forEach((item: any) => {
      // console.log("a  = ", a)
      selectedRowKeys.forEach((v) => {
        // console.log("item i = ", item.id)
        // console.log("v  = ", v)
        if (item.id == v) {
          let doorGroupId = item.doorGroupId;
          body_data.push({
            employeeNo: item.employeeNo,
            groupIds: doorGroupId.split(',')
          });
        }
      })
    });
    // console.log("body_data = ", body_data)
    // return;
    // [
    //   {
    //     "employeeNo": "string",
    //     "groupIds": [
    //       "string"
    //     ]
    //   }
    // ]
    // let data = [{
    //   groupIds: selectedRowKeys
    //   // ids: selectedRowKeys,
    //   // employeeNo:currentReviewData.employeeNo
    // }]
    // console.log(data);
    delBindPermission(body_data)
      .then(res => {
        message.success('删除成功')
        setSelectedRowKeys([])
        fetch()
      })
      .catch(e => {
        console.log('删除失败', e)
      })
  }

  //导出用户数据
  const handleFormExport = () => {
    exportUserExce(currCommunity)
  }

  //楼栋单元房屋信息树
  const options: any[] = []
  communityTree &&
    communityTree.forEach((block: any) => {
      let unitArray: any[] = []
      let blockData = {
        value: block.id,
        label: block.blockName,
        children: unitArray,
      }
      options.push(blockData)
      block.unitList.forEach((unit: any) => {
        let houseArray: any[] = []
        let unitData = {
          value: unit.id,
          label: unit.unitName,
          children: houseArray,
        }
        unitArray.push(unitData)
        unit.homeInfoList.forEach((home: any) => {
          let homeData = {
            value: home.id,
            label: home.name,
          }
          houseArray.push(homeData)
        })
      })
    })

  const renderForm = () => {
    return (
      <Form form={form} layout="inline">
        <Row>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem label="人员名称" name="userName">
              <Input placeholder="输入人员名称搜索" />
            </FormItem>
          </Col>
          <Col span={8} style={{ marginRight: 5 }}>
            <FormItem label="手机号" name="phone">
              <Input placeholder="输入人员手机号搜索" />
            </FormItem>
          </Col>
          <Col span={6} style={{ marginRight: 5 }}>
            <FormItem label="所属房屋" name="home">
              <Cascader options={options} expandTrigger="hover" changeOnSelect></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Col span={6} style={{ marginRight: 15 }}>
            <Button type="primary" onClick={searchGroups}>
              查询
            </Button>
            <Button type="primary" onClick={handelReset}>
              重置
            </Button>
          </Col>
          <Col span={17} style={{ display: 'flex' }}>
            <Button type="primary" onClick={() => setAddGroupFormVisible(true)}>
              <PlusOutlined />
              添加
            </Button>
            <Popconfirm
              title="确定删除?"
              onConfirm={delGroup}
              onCancel={() => { }}
              okText="是"
              cancelText="否"
            >
              <Button type="primary">
                <DeleteOutlined />
                删除
              </Button>
            </Popconfirm>


            <Button type="primary" onClick={handleFormExport}>
              导出
            </Button>
            <div style={{ paddingTop: 5 }}>仅导出全部门禁组权限的用户数据</div>
          </Col>
        </Row>
      </Form>
    )
  }

  //添加门禁分组框状态
  const handleReviewModalVisible = (flag?: any, record?: any) => {
    setAddGroupFormVisible(!!flag)
    setCurrentReviewData(record ? record : null)
  }

  const AddGroupSettingForm = (props: any) => {
    const { visible, data, currCommunity, handleSubmit, oncancel } = props
    //物业成员
    const [selecteStaffs, setSelecteStaffs] = useState<any[]>([])
    //住户
    const [selectUsers, setSelectUsers] = useState<any[]>([])
    //权限组
    const [selectGroups, setSelectGroups] = useState<any[]>([])
    //门禁点
    // const [selectPoints, setSelectPoints] = useState<any[]>([])
    const [form] = Form.useForm()
    //处理弹窗残留数据
    useEffect(() => {
      form.resetFields()
      //数据返填
      if (data) {
        setSelectGroups(data.doorGroupId ? data.doorGroupId.split(',') : [])
        // setSelectPoints(data.deviceNos.split(','))
      }
    }, [data])
    useEffect(() => {
      initSelects()
    }, [currCommunity])

    const initSelects = () => { }

    //点击完成
    const okHandle = () => {
      if(selectUsers.concat(selecteStaffs).concat(selectGroups).length!=0){
      let data = {
        employeeNos: selectUsers.length != 0 ? selectUsers : null,
        stewardNos: selecteStaffs.length != 0 ? selecteStaffs : null,
        doorGroupId: selectGroups.length != 0 ? selectGroups : null,
        // deviceNo: selectPoints.length != 0 ? selectPoints : null,
      }

      handleSubmit(data)
      }else {
        oncancel()
      }
    }
    //关闭窗口
    const cancelHandle = () => {
      oncancel()
    }

    // console.log('主应用:用户', selectUsers)
    // console.log('主应用:权限组', selectGroups)
    // console.log('主应用:权限组', selectPoints)
    return (
      <Modal
        visible={visible}
        title={`${data ? '修改' : '新增'}门禁配置`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
        width={800}
        getContainer = {false}
      >
        <div className={styles.containor}>
          {!data && (
            <div style={{height: 500}} className={styles.settingItem}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="物业人员" key="1">
                  <StaffList />
                </TabPane>
                <TabPane tab="住户人员" key="2">
                  <UserList
                    selectUsers={selectUsers}
                    communityId={currCommunity}
                    setSelectUsers={setSelectUsers}
                  />
                </TabPane>
              </Tabs>
            </div>
          )}
          <div className={styles.settingItem}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="门组" key="1">
                <GroupList
                  selectGroups={selectGroups}
                  communityId={currCommunity}
                  setSelectGroups={setSelectGroups}
                />
              </TabPane>

              {/* <TabPane tab="门禁点" key="2">
                <PointList
                  selectPoints={selectPoints}
                  communityId={currCommunity}
                  setSelectPoints={setSelectPoints}
                />
              </TabPane> */}
            </Tabs>
          </div>
        </div>
      </Modal>
    )
  }

  const GroupModal = (Props: any) => {
    const { visible, Onok, text, onCancel } = Props
    return (
      <Modal
        visible={visible}
        title="门禁组详情"
        footer={
          <Button type="primary" onClick={Onok}>
            确定
          </Button>
        }
        onCancel={onCancel}
      >
        <div>{text}</div>
      </Modal>
    )
  }

  const updateUsePermission = (data: any) => {
    let params = {
      employeeNo: data.employeeNo,
      buildingId: data.buildingId,
    }
    updatePersonPermission(params)
      .then(res => {
        message.success('下发成功')
      })
      .catch(e => {
        message.error('下发失败')
      })
  }

  const handleClick = (v: any) => {
    setGroupDetail(v)
    setGroupVisible(true)
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
      title: '人员名称',
      dataIndex: 'userName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '门禁组名',
      dataIndex: 'groupNames',
      render: (text: any) => {
        let groupList = text.split(',')
        return (
          <div style={{ padding: 20 }}>
            {groupList.length > 3 ? (
              <div>
                {groupList[0] + ',' + groupList[1] + ',' + groupList[2]}
                <img
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  onClick={() => handleClick(text)}
                  src={require('../../../assets/img/more.png')}
                ></img>
              </div>
            ) : (
              <div>{text}</div>
            )}
          </div>
        )
      },
    },
    {
      title: '所属房屋',
      dataIndex: 'blockHomeNames',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title:'最后操作人',
      dataIndex: 'lastPeople'
    },
    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          <a onClick={() => handleReviewModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => updateUsePermission(record)}>重新下发</a>
        </>
      ),
    },
  ]

  return (
    <>
      <div className={styles.owner}>
        <div className={styles.content}>
          <FormContainer>{renderForm()}</FormContainer>
          <GroupModal
            visible={groupVisible}
            text={groupDetail}
            Onok={() => setGroupVisible(false)}
            onCancel={() => setGroupVisible(false)}
          />
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
          <AddGroupSettingForm
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
export default AccessControlSetting
