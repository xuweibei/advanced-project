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
  Radio,
  Modal,
  message,
  Menu,
  Cascader,
} from 'antd'

import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import moment from 'moment'
import {
  getPermission2Level,
  buildingBlockUnitHomes,
  queryHomeAudit,
  addHomeAudit,
} from '@/services/api'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const { Option } = Select
const { SubMenu } = Menu
const { TextArea } = Input

const statusList = [
  {
    label: '未通过',
    value: 0,
  },
  {
    label: '通过',
    value: 1,
  },
  {
    label: '审核中',
    value: 2,
  },
]
const HouseReviewList = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [cityOptions, setCityOptions] = useState<any[]>([])
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>({})
  const [form] = Form.useForm()

  const [currentReviewData, setCurrentReviewData] = useState<any>({})
  const [reviewFormVisible, setReviewFormVisible] = useState<boolean>(false)
  const [currCommunityId, setCurrCommunityId] = useState<any>(null)
  const [currCommunityName, setCurrCommunityName] = useState<any>(null)
  const [treeCommunity, setTreeCommunity] = useState<any[]>([])

  const query = props.location.query
  const urlRegions = query.regionId
  const urlBuilding = query.buildingId

  const getStatus = (value: any) => {
    const status = statusList.find((item: any) => item.value == value)
    return status ? status.label : '--'
  }

  const handleClick = (e: any) => {
    setCurrCommunityId(e.key)
    let currArea = area && area.find(item => item.id == parseInt(e.keyPath[1]))
    let currCommunity =
      currArea && currArea.buildings.find((item: any) => item.id == parseInt(e.keyPath[0]))
    setCurrCommunityName(currCommunity.name)
  }

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          ...formdatas,
          buildingId: currCommunityId,
        }
        queryHomeAudit(data).then(res => {
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
        buildingBlockUnitHomes(currCommunityId).then(res => {
          setTreeCommunity(res.blockList)
        })
      }
    },
    [formdatas, currCommunityId]
  )

  useEffect(() => {
    getPermission2Level().then(res => {
      setArea(res.regions)
      if (urlRegions && urlBuilding) {
        const currUrlAddress = res.regions.find((res: any) => res.id == urlRegions)
        const currUrlBuilding = currUrlAddress.buildings.find((res: any) => res.id == urlBuilding)
        setCurrCommunityId(currUrlBuilding.id)
        setCurrCommunityName(currUrlBuilding.name)
      } else {
        setCurrCommunityId(res.regions[0].buildings[0].id)
        setCurrCommunityName(res.regions[0].buildings[0].name)
      }
    })
  }, [props.location.query])

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
            label: home.name,
          }
          houseArray.push(homeData)
        })
      })
    })

  const handleSearch = (values: any) => {
    const data = {
      ...values,
      blockId: values && values.building ? values.building[0] : null,
      unitId: values && values.building ? values.building[1] : null,
      roomId: values && values.building ? values.building[2] : null,
    }
    setformdatas(data)
  }

  const handelReset = () => {
    setformdatas({})
    form.resetFields()
  }

  const areaMenu = () => {
    const defaultArea = area && area[0]
    const defaultBuilding = defaultArea && defaultArea.buildings[0]

    return (
      <>
        {defaultArea && defaultArea.id && (
          <Menu
            onClick={v => handleClick(v)}
            defaultSelectedKeys={[
              `${urlBuilding ? urlBuilding : defaultBuilding && defaultBuilding.id}`,
            ]}
            defaultOpenKeys={[`${urlRegions ? urlRegions : defaultArea && defaultArea.id}`]}
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
            <FormItem label="姓名" name="name">
              <Input />
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="手机号" name="phone">
              <Input />
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="楼栋" name="building">
              <Cascader options={options} />
            </FormItem>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="审核状态" name="auditState">
              <Select>
                {statusList &&
                  statusList.map((item: any, index: any) => (
                    <Option key={index} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handelReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }

  const handleReviewSubmit = async (values: any) => {
    addHomeAudit(values)
      .then(res => {
        message.success('审核成功')
        setReviewFormVisible(false)
        setCurrentReviewData(null)
        fetch()
      })
      .catch(e => {
        message.error('审核失败', e)
      })

    handleReviewModalVisible()
  }

  const handleReviewModalVisible = (flag?: any) => {
    setReviewFormVisible(!!flag)
    setCurrentReviewData(null)
  }

  const ReviewForm = (props: any) => {
    const { visible, data, handleSubmit, oncancel } = props
    const [form] = Form.useForm()
    const [isRefuse, setIsRefuse] = useState<boolean>(false)
    const [newData, setNewData] = useState<any>(data)
    useEffect(() => {
      const opData = {
        ...data,
        opinion: 1,
      }
      setNewData(opData)
      form.resetFields()
    }, [data])

    const changeOpinion = (e: any) => {
      if (e.target.value == 1) {
        setIsRefuse(false)
        form.setFieldsValue({
          content: null,
        })
      } else if (e.target.value == 0) {
        setIsRefuse(true)
      }
    }

    const okHandle = () => {
      form
        .validateFields()
        .then(values => {
          let params = {
            auditState: values.auditState,
            content: values.content ? values.content : null,
            id: data.id,
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
        title={`住户审核`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
      >
        <Form
          form={form}
          labelAlign="right"
          preserve={false}
          initialValues={newData}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
        >
          <div>住户信息</div>
          <div className={styles.form_content}>
            <div style={{ width: '20%' }}>
              <img />
            </div>
            <div style={{ width: '80%' }}>
              <FormItem label="姓名" name="name">
                <Input disabled={true} />
              </FormItem>
              <FormItem label="手机号" name="phone">
                <Input disabled={true} />
              </FormItem>
              <FormItem label="申请身份" name="role">
                <Select disabled={true}>
                  <Option key={1} value={1}>
                    业主
                  </Option>
                  <Option key={2} value={0}>
                    家属
                  </Option>
                </Select>
              </FormItem>
              <FormItem label="申请户室" name="concatName">
                <Input disabled={true} />
              </FormItem>
              <FormItem
                label="审核意见"
                name="auditState"
                rules={[{ required: true, message: '请确认审核意见' }]}
              >
                <Radio.Group onChange={changeOpinion}>
                  <Radio value={1}>同意</Radio>
                  <Radio value={0}>拒绝</Radio>
                </Radio.Group>
              </FormItem>
              {isRefuse && (
                <FormItem label="拒绝原因" name="content">
                  <TextArea rows={4} />
                </FormItem>
              )}
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

  const handleUpdateCardVisible = async (flag: any, data: any) => {
    const hideLoading = message.loading('加载中')
    try {
      setReviewFormVisible(!!flag)
      setCurrentReviewData({ ...data })
    } finally {
      hideLoading()
    }
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '所在户室',
      dataIndex: 'concatName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '提交时间',
      dataIndex: 'createdTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      render: (text: any) => (text ? moment(text).format('YYYY-MM-DD HH:mm') : '--'),
    },
    {
      title: '拒绝原因',
      dataIndex: 'content',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '状态',
      dataIndex: 'auditState',
      render: (text: any) => (text.toString() ? getStatus(text) : '--'),
    },

    {
      title: '操作',
      render: (text: any, record: any) => (
        <>
          {record.auditState === 2 && (
            <a onClick={() => handleUpdateCardVisible(true, record)}>审核</a>
          )}
        </>
      ),
    },
  ]

  return (
    <>
      <div className={styles.owner}>
        <div className={styles.menu}>
          <div className={styles.title}>全部区域</div>
          <div className={styles.menu_content} key={urlBuilding}>
            {areaMenu()}
          </div>
        </div>
        <div className={styles.content}>
          <FormContainer>{renderForm()}</FormContainer>
          <StandardTable
            loading={loading}
            showPagination={true}
            data={data}
            columns={columns}
            rowKey={(record: any, index: number) => index}
            onChange={handleTableChange}
          />
          <ReviewForm
            visible={reviewFormVisible}
            data={currentReviewData}
            handleSubmit={handleReviewSubmit}
            oncancel={() => setReviewFormVisible(false)}
          />
        </div>
      </div>
    </>
  )
}
export default HouseReviewList
