import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'umi'
import { Card, Button, Divider, Form, Modal, Input, Select, List, message, Row, Col } from 'antd'
import styles from './index.less'
import { ColumnsType } from 'antd/lib/table'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import useCanEdit from '@/hooks/useCanEdit'
import {
  queryHouseInfoByBuildingId,
  queryHouseByBuildingId,
  addHouse,
  editHouse,
  delhouse,
} from '@/services/api'

const FormItem = Form.Item
const { Option } = Select

const HouseForm = (props: any) => {
  const { visible, handleSubmit, data, handleModalVisible, houseInfo } = props

  const [selBlock, setSelBlock] = useState<any>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(data)
  }, [data])

  useEffect(() => {
    form.resetFields()
  }, [data])

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
    handleModalVisible()
    setSelBlock(null)
    form.resetFields()
  }
  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '新增'}户室`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data}>
        {!data && (
          <>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所在楼栋">
              <Input defaultValue={houseInfo.blockName} disabled />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="所在单元"
              name="unitId"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Select style={{ width: '100%' }}>
                {houseInfo &&
                  houseInfo.unitArr &&
                  houseInfo.unitArr.map((item: any, index: any) => (
                    <Option key={index} value={item.unitId}>
                      {item.unitName}
                    </Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="所在楼层"
              name="floor"
              rules={[{ required: true, message: '不能为空' }]}
            >
              <Select style={{ width: '100%' }} onChange={v => setSelBlock(v)}>
                {houseInfo &&
                  houseInfo.blockArr &&
                  houseInfo.blockArr.map((item: any, index: any) => (
                    <Option key={index} value={item.blockName}>
                      {item.blockName + '楼'}
                    </Option>
                  ))}
              </Select>
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="户室号"
              name="roomNo"
              rules={[
                { required: true, message: '不能为空' },
                {
                  pattern: /^[0-9]\d{1,2}$/,
                  message: '户室号只能为两位数数字！',
                },
              ]}
            >
              <div style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Input prefix={selBlock} />
              </div>
            </FormItem>
          </>
        )}
        {data && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="户室名称" name="name">
            <Input />
          </FormItem>
        )}
      </Form>
    </Modal>
  )
}

const houseSetting = (props: any) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [currBuilding, setCurrBuilding] = useState<any>(null)
  const [currHouseInfo, setCurrHouseInfo] = useState<any>({})
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [formdatas, setFormdatas] = useState<any>({})
  const canEdit = useCanEdit()
  const [form] = Form.useForm()
  const currHouseId = props.match.params.id

  const fetch = useCallback(
    (pagination: any = { page: 1, page_size: 10 }) => {
      setLoading(true)
      let data = {
        blockId: currHouseId,
        ...pagination,
        ...formdatas,
      }
      queryHouseByBuildingId(data).then(res => {
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
    },
    [formdatas]
  )

  useEffect(() => {
    let params = {
      id: currHouseId,
    }
    queryHouseInfoByBuildingId(params).then(res => {
      setCurrHouseInfo(res)
    })
    fetch()
  }, [fetch])

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
    if (!!flag === false) {
      setCurrBuilding(null)
    }
  }

  const handleSubmit = (values: any) => {
    if (currBuilding) {
      editHouse(currBuilding.id, { ...values })
        .then(res => {
          message.success('修改成功')
          fetch()
          handleModalVisible(false)
        })
        .catch(e => {
          handleModalVisible(false)
        })
    } else {
      let data = {
        ...values,
        blockId: currHouseId,
        floor: parseInt(values.floor),
        roomNo: parseInt('' + values.floor + values.roomNo),
      }
      addHouse(data)
        .then(res => {
          message.success('添加成功')
          fetch()
          handleModalVisible(false)
        })
        .catch(e => {
          handleModalVisible(false)
        })
    }
  }

  //删除房屋
  const onRemove = (record: any) => {
    delhouse(record.id)
      .then(res => {
        message.success('删除成功')
        fetch()
        handleModalVisible(false)
      })
      .catch(e => {
        handleModalVisible(false)
      })
  }

  //查询
  const handleSearch = () => {
    form
      .validateFields()
      .then(res => {
        setFormdatas(res)
      })
      .catch(e => {
        console.log('获取表单内容失败', e)
      })
  }

  //重置查询
  const handleFormReset = () => {
    form.resetFields()
    setFormdatas({})
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch}>
        <Row>
          <FormItem label="户室名称" name="homeName" style={{ paddingRight: 10 }}>
            <Input />
          </FormItem>
          <Button htmlType="submit" type="primary">
            <SearchOutlined />
            查询
          </Button>
          <Button style={{ paddingRight: 10 }} onClick={handleFormReset}>
            重置
          </Button>
          {canEdit && (
            <Col span={6} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={() => setVisible(true)}>
                <PlusOutlined />
                新增户室
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    )
  }

  const handleTableChange = (query: any) => {
    fetch({
      page: query.current,
      page_size: query.pageSize,
    })
  }

  const getColumns = (): ColumnsType => {
    const columns: ColumnsType = [
      {
        title: '楼栋户室',
        dataIndex: 'blockHomeName',
      },
      {
        title: '户室名称',
        dataIndex: 'name',
      },
      {
        title: '业主',
        dataIndex: 'userName',
        render: (text: any, record: any) => (text ? text : '--'),
      },
      {
        title: '住户',
        dataIndex: 'residentName',
        render: (text: any, record: any) => (text ? text : '--'),
      },
      {
        title: '入住情况',
        dataIndex: 'checkIn',
        render: (text: any, record: any) => (text === 0 ? '未入住' : '已入住'),
      },
      {
        title: '操作',
        render: (text: any, record: any) => (
          <>
            <a
              onClick={() => {
                setCurrBuilding(record)
                handleModalVisible(true)
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <TableDeleteBtn onDelete={() => onRemove(record)} />
          </>
        ),
      },
    ]
    return columns
  }
  return (
    <>
      <div className={styles.allBuildingTitle}>
        <p>{currHouseInfo.blockName}</p>
      </div>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        loading={loading}
        data={data}
        columns={getColumns()}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />
      <HouseForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        houseInfo={currHouseInfo}
        data={currBuilding}
      />
    </>
  )
}

export default houseSetting
