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
  Menu,
  Divider,
  Popconfirm,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import moment from 'moment'
import {
  getPermission2Level,
  queryCardList,
  addCard,
  changeCard,
  delCard,
  refundCard,
  reportCard,
  reissueCard,
  unreportCard,
  exportCardExce,
} from '@/services/api'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const { Option } = Select
const { SubMenu } = Menu
const { TextArea } = Input

const statusList = [
  {
    label: '正常',
    value: 1,
  },
  {
    label: '未开卡',
    value: 2,
  },
  {
    label: '换卡',
    value: 3,
  },
  {
    label: '退卡',
    value: 4,
  },
  {
    label: '补卡',
    value: 5,
  },
  {
    label: '挂失',
    value: 6,
  },
]
const cardManagement = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [cityOptions, setCityOptions] = useState<any[]>([])
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>({})
  const [form] = Form.useForm()

  const [currentReviewData, setCurrentReviewData] = useState<any>({})
  const [addCardFormVisible, setAddCardFormVisible] = useState<boolean>(false)
  const [changeCardFormVisible, setChangeCardFormVisible] = useState<boolean>(false)
  const [reissueCardFormVisible, setReissueCardFormVisible] = useState<boolean>(false)
  const [currCommunityId, setCurrCommunityId] = useState<any>(null)

  const getStatus = (value: any) => {
    const status = statusList.find((item: any) => item.value == value)
    return status ? status.label : '--'
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
        queryCardList(data).then(res => {
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
    [formdatas, currCommunityId]
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

  const handleFormExport = useCallback(() => {
    const cardNum = form.getFieldValue('cardNum')
    const name = form.getFieldValue('name')
    let data = {
      buildingId: currCommunityId ? parseInt(currCommunityId) : undefined,
      cardNum: cardNum,
      name: name,
    }
    console.log(data)
    exportCardExce(data)
  }, [currCommunityId])

  const areaMenu = () => {
    const handleClick = (e: any) => {
      setformdatas({})
      form.resetFields()
      console.log('set...', e.key)
      setCurrCommunityId(e.key)
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
          <Col span={5}>
            <FormItem label="姓名" name="name">
              <Input />
            </FormItem>
          </Col>
          <Col span={5} style={{ paddingLeft: 10 }}>
            <FormItem label="卡号" name="cardNum">
              <Input />
            </FormItem>
          </Col>
          <Col span={12} style={{ marginLeft: 10 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handelReset}>重置</Button>
            <Button type="primary" onClick={() => setAddCardFormVisible(true)}>
              <PlusOutlined />
              添加
            </Button>
            <Button type="primary" onClick={handleFormExport}>
              导出
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }

  //添加卡片
  const userAddCard = (values: any) => {
    addCard(values)
      .then(res => {
        message.success('添加成功')
        fetch()
      })
      .catch(e => {
        message.error('添加失败', e)
      })

    handleReviewModalVisible()
  }

  //更换卡片
  const userChangeCard = (values: any) => {
    changeCard(values.oldCardNo, values)
      .then(res => {
        message.success('换卡成功')
        fetch()
      })
      .catch(e => {
        message.error('换卡失败', e)
      })
    handleChangeModalVisible()
  }

  //补卡
  const userReissueCard = (values: any) => {
    reissueCard(values.oldCardNo, values)
      .then(res => {
        message.success('补卡成功')
        fetch()
      })
      .catch(e => {
        message.error('补卡失败', e)
      })
    handleReissueModalVisible()
  }

  //删除卡片
  const userDelCard = (data: any) => {
    delCard(data.id)
      .then(res => {
        message.success('删除成功')
        fetch()
      })
      .catch(e => {
        message.error('删除失败', e)
      })
  }

  //退卡
  const userRefundCard = (data: any) => {
    let params = {
      cardNo: data.cardNo,
      employeeNo: data.employeeNo,
    }
    refundCard(params)
      .then(res => {
        message.success('退卡成功')
        fetch()
      })
      .catch(e => {
        message.error('退卡失败', e)
      })
  }

  //挂失
  const userReportCard = (data: any) => {
    reportCard(data.id)
      .then(res => {
        message.success('挂失成功')
        fetch()
      })
      .catch(e => {
        message.error('挂失失败', e)
      })
  }

  //解挂
  const userUnreportCard = (data: any) => {
    unreportCard(data.id)
      .then(res => {
        message.success('解除挂失成功')
        fetch()
      })
      .catch(e => {
        message.error('解除挂失失败', e)
      })
  }

  //添加卡片框状态
  const handleReviewModalVisible = (flag?: any) => {
    setAddCardFormVisible(!!flag)
    setCurrentReviewData(null)
  }

  //更换卡片框状态
  const handleChangeModalVisible = (flag?: any, record?: any) => {
    setChangeCardFormVisible(!!flag)
    setCurrentReviewData(record ? record : null)
  }

  //补卡卡片框状态
  const handleReissueModalVisible = (flag?: any, record?: any) => {
    setReissueCardFormVisible(!!flag)
    setCurrentReviewData(record ? record : null)
  }

  const CardForm = (props: any) => {
    const { visible, handleSubmit, oncancel } = props
    const [form] = Form.useForm()

    useEffect(() => {
      form.resetFields()
    }, [data])

    const okHandle = () => {
      form
        .validateFields()
        .then(values => {
          let params = {
            ...values,
            buildingId: parseInt(currCommunityId),
            status: 1,
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
        title={`添加空白卡`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
      >
        <Form
          form={form}
          labelAlign="right"
          preserve={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
        >
          <div className={styles.form_content}>
            <div style={{ width: '80%' }}>
              <FormItem label="卡号" name="cardNo">
                <Input />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>
    )
  }

  const ChangeCardForm = (props: any) => {
    const { visible, data, handleSubmit, oncancel } = props
    const [form] = Form.useForm()

    useEffect(() => {
      form.resetFields()
    }, [data])

    const okHandle = () => {
      form
        .validateFields()
        .then(values => {
          let params = {
            oldCardNo: values.cardNo,
            cardNo: values.newCardNo,
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
        title={`人员换卡`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
      >
        <Form
          form={form}
          labelAlign="right"
          preserve={false}
          initialValues={data}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
        >
          <div className={styles.form_content}>
            <div style={{ width: '80%' }}>
              <FormItem label="旧卡号" name="cardNo">
                <Input disabled />
              </FormItem>
            </div>
          </div>
          <div className={styles.form_content}>
            <div style={{ width: '80%' }}>
              <FormItem
                label="新卡号"
                name="newCardNo"
                rules={[{ required: true, message: '不能为空' }]}
              >
                <Input />
              </FormItem>
            </div>
          </div>
        </Form>
      </Modal>
    )
  }

  const ReissueCardForm = (props: any) => {
    const { visible, data, handleSubmit, oncancel } = props
    const [form] = Form.useForm()

    useEffect(() => {
      form.resetFields()
    }, [data])

    const okHandle = () => {
      form
        .validateFields()
        .then(values => {
          let params = {
            oldCardNo: values.cardNo,
            cardNo: values.newCardNo,
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
        title={`人员补卡`}
        okText="确认"
        cancelText="取消"
        onCancel={cancelHandle}
        onOk={okHandle}
      >
        <Form
          form={form}
          labelAlign="right"
          preserve={false}
          initialValues={data}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 16 }}
        >
          <div className={styles.form_content}>
            <div style={{ width: '80%' }}>
              <FormItem label="旧卡卡号" name="cardNo">
                <Input disabled />
              </FormItem>
            </div>
          </div>
          <div className={styles.form_content}>
            <div style={{ width: '80%' }}>
              <FormItem
                label="新卡卡号"
                name="newCardNo"
                rules={[{ required: true, message: '不能为空' }]}
              >
                <Input />
              </FormItem>
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
      title: '卡号',
      dataIndex: 'cardNo',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '人员姓名',
      dataIndex: 'userName',
      render: (text: any) => (text ? text : '--'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: any) => (text ? getStatus(text) : '--'),
    },
    {
      title: '通行权限',
      dataIndex: 'groupName',
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
        <>
          {record.status === 2 && <TableDeleteBtn onDelete={() => userDelCard(record)} />}
          {record.status === 6 && (
            <>
              <Popconfirm
                title="确定进行解挂?"
                onConfirm={() => userUnreportCard(record)}
                okText="确定"
                cancelText="取消"
              >
                <a>解挂</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={() => handleReissueModalVisible(true, record)}>补卡</a>
            </>
          )}
          {record.status != 2 && record.status != 6 && (
            <>
              <a onClick={() => handleChangeModalVisible(true, record)}>换卡</a>

              <Divider type="vertical" />
              <Popconfirm
                title="确定进行退卡?"
                onConfirm={() => userRefundCard(record)}
                okText="确定"
                cancelText="取消"
              >
                <a>退卡</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm
                title="确定进行挂失?"
                onConfirm={() => userReportCard(record)}
                okText="确定"
                cancelText="取消"
              >
                <a>挂失</a>
              </Popconfirm>
            </>
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
          <div className={styles.menu_content}>{areaMenu()}</div>
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
          <CardForm
            visible={addCardFormVisible}
            handleSubmit={userAddCard}
            oncancel={() => setAddCardFormVisible(false)}
          />
          <ChangeCardForm
            visible={changeCardFormVisible}
            data={currentReviewData}
            handleSubmit={userChangeCard}
            oncancel={() => setChangeCardFormVisible(false)}
          />
          <ReissueCardForm
            visible={reissueCardFormVisible}
            data={currentReviewData}
            handleSubmit={userReissueCard}
            oncancel={() => setReissueCardFormVisible(false)}
          />
        </div>
      </div>
    </>
  )
}
export default cardManagement
