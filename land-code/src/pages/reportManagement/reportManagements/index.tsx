import React, { useCallback, useEffect, useState } from 'react'
import { ConnectProps, connect, history, Dispatch, UserModelState } from 'umi'
import {
  Input,
  Form,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Divider,
  Modal,
  message,
  Menu,
  Radio,
  Popover,
  Cascader,
  Tag,
  Card,
} from 'antd'
import { UserOutlined, UploadOutlined, CameraOutlined } from '@ant-design/icons'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import ImageUpload from '@/components/Uploader/ImageUpload.js'
import FaceUpload from '@/components/Uploader/FaceUpload'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import moment from 'moment'
import {
  getPermission2Level,
  queryBuildingsByCommunityId,
  queryUnitsByHomeId,
  queryHomesByUnitId,
  activateCard,
  buildingBlockUnitHomes,
  addHomeUsers,
  delHomeUser,
  downloadSample,
  searchFailedRecord,
  queryRexportExce,
  reportRexportExce,
} from '@/services/api'
import Avatar from 'antd/lib/avatar/avatar'
import PeopleUploader from '../../../components/XlsUploader/PeopleUploader'

const roleList = [
  {
    label: '租户',
    value: 3,
  },
  {
    label: '业主',
    value: 1,
  },
  {
    label: '家属',
    value: 0,
  },
  {
    label: '物业',
    value: 2,
  },
]

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker //时间
const { Option } = Select
const { SubMenu } = Menu

interface UserListProps extends ConnectProps {
  dispatch: Dispatch
  user: UserModelState
  loading: boolean
}
const index = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>(null)
  const [currentCardData, setCurrentCardData] = useState<any>(null)
  const [cardFormVisible, setCardFormVisible] = useState<boolean>(false)
  const [currentOwnerData, setCurrentOwnerData] = useState<any>({})
  const [ownerFormVisible, setOwnerFormVisible] = useState<boolean>(false)
  const [currCommunityId, setCurrCommunityId] = useState<any>(null)
  const [currCommunityName, setCurrCommunityName] = useState<any>(null)
  const [treeCommunity, setTreeCommunity] = useState<any[]>([])
  const [currPagination, setCurrPagination] = useState<any>({ page: 1, page_size: 10 })
  const [time, setTime] = useState<any>([])
  const [failedRecordVisiable, setFailedRecordVisiable] = useState<boolean>(false)
  const [failedRecordCount, setFailedRecordCount] = useState<any>(0)
  const [failedRecordData, setFailedRecordData] = useState<any>()
  const [currUser, setCurrUser] = useState<any>()

  const [updateLoading, setUpdateLoading] = useState<boolean>(false)

  const [form] = Form.useForm()

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          ...formdatas,
          buildingId: currCommunityId,
        }
        queryRexportExce(data).then(res => {
          setData({
            list: res.results,
            pagination: {
              total: res.count,
              current: pagination.page,
              pageSize: pagination.page_size,
            },
          })
        })
        buildingBlockUnitHomes(currCommunityId).then(res => {
          setTreeCommunity(res.blockList)
          setLoading(false)
        })
      }
    },
    [formdatas, currCommunityId]
  )

  useEffect(() => {
    getPermission2Level().then(res => {
      setArea(res.regions)
      setCurrCommunityId(res.regions[0].buildings[0].id)
      setCurrCommunityName(res.regions[0].buildings[0].name)
    })
  }, [])

  const failedRecordModal = () => {
    setFailedRecordVisiable(!failedRecordVisiable)
  }

  const failedRecordColumns: any = [
    {
      title: '设备序列号',
      dataIndex: 'deviceSerial',
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
        employeeNo: id ? id : currUser.employeeNo,
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
    [currUser]
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

  useEffect(() => {
    fetch()
  }, [fetch])

  //三级联动选择楼栋-单元-户室号
  const options: any[] = []
  treeCommunity &&
    treeCommunity.forEach((block: any) => {
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
            value: home.roomNo,
            label: home.roomNo,
          }
          houseArray.push(homeData)
        })
      })
    })

  //查询逻辑
  const handleSearch = (values: any) => {
    const data = {
      beginTime: values.time ? moment(values.time[0]).format('YYYY-MM-DD') : null,
      endTime: values.time ? moment(values.time[1]).format('YYYY-MM-DD') : null,
      blockId: values && values.building ? values.building[0] : null,
      unitId: values && values.building ? values.building[1] : null,
      roomId: values && values.building ? values.building[2] : null,
    }
    setTime(data)
    setformdatas(data)
  }

  //导出
  const handelReset = () => {
   if(data.list){
    reportRexportExce({
      buildingId: currCommunityId,
      beginTime: time.beginTime,
      endTime: time.endTime,
    })
    setformdatas(null)
    form.resetFields()
   }else{
     message.warning('无数据不能导出')
   }
  }

  //切换社区
  const areaMenu = () => {
    const handleClick = (e: any) => {
      setformdatas(null)
      form.resetFields()
      setCurrCommunityId(e.key)
      let currArea = area && area.find(item => item.id === parseInt(e.keyPath[1]))
      let currCommunity =
        currArea && currArea.buildings.find((item: any) => item.id === parseInt(e.keyPath[0]))
      setCurrCommunityName(currCommunity.name)
    }
    const defaultArea = area && area[0]
    const defaultBuilding = defaultArea && defaultArea.buildings[0]

    return (
      <>
        {defaultArea && defaultArea.id && (
          <Menu
            onClick={v => handleClick(v)}
            defaultSelectedKeys={[`${defaultBuilding && defaultBuilding.id}`]}
            defaultOpenKeys={[`${defaultArea && defaultArea.id}`]}
            style={{ width: '100%' }}
            mode="inline"
          >
            {area.map((areaItem: any) => (
              <SubMenu key={areaItem.id} title={areaItem.name}>
                {areaItem.buildings &&
                  areaItem.buildings.map((building: any) => (
                    <Menu.Item key={building.id}>{building.name}</Menu.Item>
                  ))}
              </SubMenu>
            ))}
          </Menu>
        )}
      </>
    )
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <Row className={styles.header}>
          <Col span={6}>
            <FormItem label="时间区域" name="time">
              <RangePicker />
            </FormItem>
          </Col>

          <Col span={8} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
            <Button onClick={handelReset}>导出</Button>
            <Button
              type="primary"
              onClick={() => {
                setOwnerFormVisible(true)
                setCurrentOwnerData(null)
              }}
            >
              {/* <PlusOutlined />
              添加人员 */}
            </Button>
            {/* <PeopleUploader buildingId={currCommunityId} fetch={fetch} />
            <Button type="primary" onClick={() => downloadSample()}>
              下载模版
            </Button> */}
          </Col>
        </Row>
      </Form>
    )
  }

  //展示用户所有房屋权限
  const getHouseList = (data: any) => {
    return (
      data.householdList &&
      data.householdList.length &&
      data.householdList.map((item: any, index: any) => (
        <p key={index}>
          {item.role === 1 && <Tag color="#2db7f5">业主</Tag>}
          {item.role === 0 && item.type !== 1 && <Tag color="#f50">家属</Tag>}
          {item.role === 3 && <Tag color="#f50">租户</Tag>}
          {item.role === 0 && item.type === 1 && <Tag color="#f50">物业</Tag>}
          <label>{item.concatName}</label>
        </p>
      ))
    )
  }

  //开卡功能
  const handleCardSubmit = async (values: any) => {
    const newValues = {
      employeeNo: values.employeeNo,
      buildingId: currCommunityId,
      cardNo: values.cardNo,
    }
    activateCard(newValues).then(res => {
      message.success('开卡成功')
      fetch(currPagination)
    })
    handleCardModalVisible()
  }

  //卡片弹窗开关相关逻辑
  const handleCardModalVisible = (flag?: any) => {
    setCardFormVisible(!!flag)
    setCurrentCardData(null)
  }

  const handleOwnerSubmit = async (values: any) => {
    if (currentOwnerData) {
      let params = {
        ...values,
        employeeNo: currentOwnerData.employeeNo,
        buildingId: currCommunityId,
        operateType: 2,
      }
      addHomeUsers(params)
        .then(res => {
          handleOwnerModalVisible({ data: true })
          message.success('修改成功')
          setUpdateLoading(false)
          fetch(currPagination)
        })
        .catch(e => {
          setUpdateLoading(false)
          console.log('修改失败', e)
        })
    } else {
      let params = {
        ...values,
        buildingId: currCommunityId,
        operateType: 1,
      }
      addHomeUsers(params)
        .then(res => {
          handleOwnerModalVisible({ data: true })
          message.success('新建成功')
          setUpdateLoading(false)
          fetch(currPagination)
        })
        .catch(e => {
          setUpdateLoading(false)
          console.log('新建失败', e)
        })
    }
  }

  const handleOwnerModalVisible = ({ data, flag }: any) => {
    setOwnerFormVisible(!!flag)
    setCurrentOwnerData(null)
    if (!data) {
      fetch(currPagination)
    }
  }

  const CardForm = (props: any) => {
    const { visible, data, handleSubmit, oncancel } = props
    const [addNums, setAddNums] = useState<any>(1)
    const [formCard] = Form.useForm()

    useEffect(() => {
      formCard.resetFields()
    }, [data])

    const okHandle = () => {
      formCard
        .validateFields()
        .then(values => {
          let cardNos: any = []
          values.cardNo.forEach((item: any) => {
            cardNos.push(item.cardName)
          })
          let params = {
            ...data,
            cardNo: cardNos.toString(),
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
        title={`人员开卡`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
      >
        <Form
          form={formCard}
          labelAlign="right"
          preserve={false}
          initialValues={data}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.List name="cardNo">
            {(fields, { add, remove }) => (
              <>
                {fields.map(field => (
                  <Form.Item
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 16 }}
                    required={false}
                    key={field.key}
                    label="卡号"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, 'cardName']}
                      fieldKey={[field.fieldKey, 'cardName']}
                      noStyle
                    >
                      <Input style={{ width: '60%', marginRight: 10 }} />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(field.name)
                        setAddNums(addNums - 1)
                      }}
                    />
                  </Form.Item>
                ))}

                <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ span: 24 }}>
                  <Button
                    type="dashed"
                    disabled={addNums < 3 ? false : true}
                    style={{ width: '40%' }}
                    onClick={() => {
                      add()
                      setAddNums(addNums + 1)
                    }}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加({addNums}/3)
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    )
  }

  const OwnerForm = (props: any) => {
    const { visible, data, handleSubmit, oncancel } = props
    const [radios, setRadios] = useState<{ [key: string]: number }>({})
    const [role, setRole] = useState<{ [key: string]: number }>({})
    const [startDate, setStartDate] = useState<{ [key: string]: any }>({})
    const [ownform] = Form.useForm()

    useEffect(() => {
      if (data && data.householdList) {
        data.householdList.map((item: any) => {
          if (item.type === 1) {
            item.role = 2
          }
        })
        ownform.setFieldsValue(data)
      }
    }, [data])

    const okHandle = () => {
      ownform
        .validateFields()
        .then(values => {
          let houseList: any[] = []
          let params = {
            ...values,
            householdList: houseList,
          }
          if (values.householdList.length === 0) {
            message.error('房屋不能为空')
            return
          }
          values.householdList.length &&
            values.householdList.map((item: any) => {
              let home = {
                permanent: 1,
                ...item,
                checkTime: moment(item.checkTime).format('YYYY-MM-DD 00:00:00'),
                cutoffTime: item.cutoffTime
                  ? moment(item.cutoffTime).format('YYYY-MM-DD 23:59:59')
                  : '2037-12-31 23:59:59',
                blockId: item.building && item.building[0],
                unitId: item.building && item.building[1],
                roomNo: item.building && item.building[2],
                type: item.role == 3 ? 3 : item.role == 2 ? 1 : 2, //type 1.物业人员2.住户人员 3租客  kongchong修改
                role: item.role == 2 ? 0 : item.role,
              }
              houseList.push(home)
            })
          setUpdateLoading(true)
          oncancel()
          handleSubmit(params)
        })
        .catch(info => {
          console.log('Validate Failed:', info)
        })
    }
    const cancelHandle = () => {
      oncancel()
    }

    const startdisabledDate = (current: moment.Moment, endDate?: moment.Moment) => {
      // 1. 今天之前
      // 2. 大于截止时间
      // 3. 大于 2037
      return (
        current.isBefore(moment(), 'date') ||
        (endDate && current.isAfter(endDate)) ||
        current.year() > 2037
      )
    }

    const enddisabledDate = (current: moment.Moment, startDate?: moment.Moment) => {
      // 1. 今天之前
      // 2. 小于开始时间
      // 3. 大于 2037
      return (
        current.isBefore(moment(), 'date') ||
        (startDate && current.isBefore(startDate)) ||
        current.year() > 2037
      )
    }

    const changeRole = (v: any, field: any) => {
      setRole(oldV => ({ ...oldV, [field.key]: v }))
    }

    return (
      <Modal
        visible={visible}
        title={`${data ? '编辑业主' : '添加业主'}`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
        className={styles.addMember}
        width={900}
        confirmLoading={updateLoading}
      >
        <Form
          form={ownform}
          labelAlign="right"
          preserve={false}
          initialValues={data}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
        >
          <div className={styles.form_content}>
            <div style={{ width: '50%' }}>
              <div className={styles.form_title}>
                <div className={styles.form_title_mark}></div>
                <div className={styles.form_title_name}>人员基本信息</div>
              </div>
              <FormItem label="人脸采集" name="faceUrl">
                <FaceUpload mobile={data?.phoneNumber} />
              </FormItem>
              <FormItem
                label="姓名"
                name="userName"
                rules={[
                  { required: true, message: '不能为空' },
                  {
                    pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{0,16}$/,
                    message: '用户名由16位中文英文数字组成',
                  },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem label="性别" name="sex" rules={[{ required: true, message: '不能为空' }]}>
                <Radio.Group>
                  <Radio value={1}>男</Radio>
                  <Radio value={0}>女</Radio>
                </Radio.Group>
              </FormItem>
              <FormItem
                label="手机号"
                name="phoneNumber"
                rules={[{ required: true, message: '不能为空' }]}
              >
                <Input disabled={data ? true : false} />
              </FormItem>
            </div>
            <div style={{ width: '50%' }}>
              <div className={styles.form_title}>
                <div className={styles.form_title_mark}></div>
                <div className={styles.form_title_name}>{currCommunityName}</div>
              </div>
              <Form.List
                rules={[
                  {
                    validator: (rule, value) => {
                      if (!value) {
                        return Promise.reject(message.error('户室信息不能为空！', 30))
                      } else {
                        return Promise.resolve()
                      }
                    },
                  },
                ]}
                name="householdList"
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field: any, index: any) => {
                      const householdList = ownform.getFieldValue('householdList')
                      const house = (householdList && householdList[index]) || {}
                      const currPermanent = house.permanent

                      console.log('house', fields, householdList, house, currPermanent)
                      return (
                        <div key={field.fieldKey}>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="所在户室"
                                name={[field.name, 'building']}
                                fieldKey={[field.fieldKey, 'building']}
                                rules={[{ required: true, message: '不能为空' }]}
                              >
                                <Cascader
                                  disabled={data && currPermanent != undefined ? true : false}
                                  options={options}
                                />
                              </Form.Item>
                            )}
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="身份类型"
                                name={[field.name, 'role']}
                                fieldKey={[field.fieldKey, 'role']}
                                rules={[{ required: true, message: '不能为空' }]}
                              >
                                <Select
                                  style={{ width: '100%' }}
                                  onChange={v => changeRole(v, field)}
                                >
                                  {roleList.map((item: any, index: any) => (
                                    <Option key={index} value={item.value}>
                                      {item.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            )}
                          </Form.Item>
                          <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.area !== curValues.area ||
                              prevValues.sights !== curValues.sights
                            }
                          >
                            {() => (
                              <Form.Item
                                {...field}
                                label="入住日期"
                                name={[field.name, 'checkTime']}
                                fieldKey={[field.fieldKey, 'checkTime']}
                                rules={[{ required: true, message: '不能为空' }]}
                              >
                                <DatePicker
                                  format="YYYY-MM-DD"
                                  disabledDate={current =>
                                    startdisabledDate(
                                      current,
                                      house.permanent === 0 ? house.cutoffTime : null
                                    )
                                  }
                                  onChange={(v: any) => setStartDate(v)}
                                />
                              </Form.Item>
                            )}
                          </Form.Item>
                          {house.role === 3 && (
                            <>
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.area !== curValues.area ||
                                  prevValues.sights !== curValues.sights
                                }
                              >
                                {() => (
                                  <Form.Item
                                    {...field}
                                    label="永久有效"
                                    name={[field.name, 'permanent']}
                                    fieldKey={[field.fieldKey, 'permanent']}
                                    rules={[{ required: true, message: '不能为空' }]}
                                  >
                                    <Radio.Group
                                      value={radios[field.key]}
                                      onChange={v => {
                                        setRadios(oldV => ({
                                          ...oldV,
                                          [field.key]: v.target.value,
                                        }))
                                        house.cutoffTime = undefined
                                        house.permanent = v.target.value
                                        ownform.setFieldsValue({
                                          householdList: householdList,
                                        })
                                      }}
                                    >
                                      <Radio value={1}>永久</Radio>
                                      <Radio value={0} disabled={house.role !== 3}>
                                        非永久
                                      </Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                )}
                              </Form.Item>
                              <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.area !== curValues.area ||
                                  prevValues.sights !== curValues.sights
                                }
                              >
                                {() => (
                                  <Form.Item
                                    {...field}
                                    label="授权截止日期"
                                    name={[field.name, 'cutoffTime']}
                                    fieldKey={[field.fieldKey, 'cutoffTime']}
                                    rules={
                                      (radios[field.key] && radios[field.key] === 0) ||
                                      currPermanent === 0
                                        ? [{ required: true, message: '不能为空' }]
                                        : []
                                    }
                                  >
                                    <DatePicker
                                      format="YYYY-MM-DD"
                                      disabledDate={current => {
                                        return enddisabledDate(current, house.checkTime)
                                      }}
                                      disabled={
                                        (radios[field.key] && radios[field.key] === 0) ||
                                        currPermanent === 0
                                          ? false
                                          : true
                                      }
                                      onChange={(v: any) => setStartDate(v)}
                                    />
                                  </Form.Item>
                                )}
                              </Form.Item>
                            </>
                          )}
                          <Button
                            type="dashed"
                            style={{ width: '60%' }}
                            onClick={() => remove(field.name)}
                            block
                            icon={<MinusCircleOutlined />}
                          >
                            删除户室
                          </Button>
                        </div>
                      )
                    })}
                    <Button
                      type="dashed"
                      style={{ width: '60%' }}
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加户室
                    </Button>
                  </>
                )}
              </Form.List>
            </div>
          </div>
        </Form>
      </Modal>
    )
  }

  const handleUpdateCardVisible = async (flag: any, data: any) => {
    const hideLoading = message.loading('加载中')
    try {
      let cardNo = []
      if (!data.employeeNo) {
        message.success('用户信息更新中，请稍后尝试')
        return
      }
      if (data.cardNo) {
        const cardNoArr = data.cardNo.split(',')
        cardNo = cardNoArr.map((item: any) => {
          return { cardName: item }
        })
      } else {
        cardNo = [{ cardName: '' }]
      }
      const newData = {
        ...data,
        cardNo: cardNo,
      }
      setCardFormVisible(!!flag)
      setCurrentCardData({ ...newData })
    } finally {
      hideLoading()
    }
  }

  const handleTableChange = (query: any) => {
    setCurrPagination({
      page: query.current,
      page_size: query.pageSize,
    })
    fetch({
      page: query.current,
      page_size: query.pageSize,
    })
  }

  //删除业主
  const deleteHomeUser = (id: any) => {
    delHomeUser(id)
      .then(res => {
        message.success('删除成功！')
        fetch()
      })
      .catch(e => {
        console.log('删除失败', e)
      })
  }

  const columns = [
    {
      title: '时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? text : '--'),
    },
    // {
    //   title: '商品名',
    //   dataIndex: 'concatName',
    //   render: (text: any, record: any) => (
    //     <Popover content={getHouseList(record)} trigger="hover">
    //       <div>
    //         {record.householdList &&
    //           record.householdList.length &&
    //           record.householdList[0].role === 1 && <Tag color="#2db7f5">业主</Tag>}
    //         {record.householdList &&
    //           record.householdList.length &&
    //           record.householdList[0].role === 0 && record.householdList[0].type !== 1 && <Tag color="#f50">家属</Tag>}
    //         {record.householdList &&
    //           record.householdList.length &&
    //           record.householdList[0].role === 3 && <Tag color="#f50">租户</Tag>}
    //         {record.householdList &&
    //           record.householdList.length &&
    //           record.householdList[0].role === 0 && record.householdList[0].type === 1 && <Tag color="#f50">物业</Tag>}
    //         <label>
    //           {record.householdList &&
    //             record.householdList.length &&
    //             record.householdList[0].concatName}
    //         </label>
    //       </div>
    //     </Popover>
    //   ),

    //   // render: (text: any, record: any) => (text ? text : '--'),
    // },
    {
      title: '收支类型',
      dataIndex: 'paymentType',
      render: (text: any) => {
        return (text ? (text==1?'收入':'支出') :'--')
      },
    },
    {
      title: '收入（元）',
      dataIndex: 'income',
      render: (text: any) =>{
        return (text ? (text>0?<div style={{color:'red'}}>{text}</div>:<div style={{color:'#81f651'}}>{text}</div>) :'--')
      },
    },
    {
      title: '账单类型',
      dataIndex: 'billType',
      render: (text: any) => {
        return (text ? (text==1?'售卖':'退款') :'--')
      },
    },
    {
      title: '交易摘要',
      dataIndex: 'goodsName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '订单号',
      dataIndex: 'orderSn',
      render: (text: any) => (text ? text : '--'),
    },
    // {
    //   title: '操作',
    //   render: (text: any, record: any) => (
    //     <>
    //       <a
    //         onClick={() => {
    //           setOwnerFormVisible(true)
    //           let ownerHomeList: any = []
    //           record.householdList.forEach((item: any) => {
    //             let data = {
    //               ...item,
    //               building: [item.blockId, item.unitId, item.roomNo],
    //               checkTime: item.checkTime ? moment(item.checkTime) : null,
    //               cutoffTime: item.cutoffTime ? moment(item.cutoffTime) : null,
    //             }
    //             ownerHomeList.push(data)
    //           })
    //           setCurrentOwnerData({ ...record, householdList: ownerHomeList })
    //         }}
    //       >
    //         详情
    //       </a>
    //       <Divider type="vertical" />
    //       <a onClick={() => handleUpdateCardVisible(true, record)}>开卡</a>
    //       <Divider type="vertical" />
    //       <TableDeleteBtn onDelete={() => deleteHomeUser(record.id)} />
    //       <Divider type="vertical" />
    //       <a
    //         onClick={() => {
    //           console.log(record, 'recordrecordrecord11')
    //           failedRecordModal()
    //           setCurrUser(record)
    //           queryFailedRecord(
    //             {
    //               page: 1,
    //               page_size: 10,
    //             },
    //             record.employeeNo
    //           )
    //         }}
    //       >
    //         下发查询
    //       </a>
    //     </>
    //   ),
    // },
  ]
  return (
    <>
      <div className={styles.owner}>
        <div className={styles.menu}>
          <div className={styles.menu_content}>{areaMenu()}</div>
        </div>
        <div className={styles.content}>
          <Card bordered={false}>
            <FormContainer>{renderForm()}</FormContainer>
            <StandardTable
              loading={loading}
              showPagination={true}
              data={data}
              columns={columns}
              rowKey={(record: any, index: number) => index}
              onChange={handleTableChange}
            />
            <CardForm
              visible={cardFormVisible}
              data={currentCardData}
              handleSubmit={handleCardSubmit}
              oncancel={() => setCardFormVisible(false)}
            />
            <OwnerForm
              visible={ownerFormVisible}
              data={currentOwnerData}
              handleSubmit={handleOwnerSubmit}
              oncancel={() => handleOwnerModalVisible({})}
            />
            <FailedRecordList />
          </Card>
        </div>
      </div>
    </>
  )
}
export default index
