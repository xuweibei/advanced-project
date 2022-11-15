import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'umi'
import { Card, Button, Divider, Form, Modal, Input, Select, List, message, Row, Col } from 'antd'
import styles from './index.less'
import { ColumnsType } from 'antd/lib/table'
import { PlusOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import StandardTable from '@/components/StandardTable'
import FormContainer from '@/components/FormContainer'
import useCanEdit from '@/hooks/useCanEdit'
import {
  getBuildingInfoById,
  queryBuildingsById,
  addBuildings,
  updateBuildings,
  delBuildings,
} from '@/services/api'

const FormItem = Form.Item

const BuildingForm = (props: any) => {
  const { visible, handleSubmit, data, handleModalVisible, buildingName } = props

  const [form] = Form.useForm()
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
    form.resetFields()
    handleModalVisible()
  }

  const blockNochange = (data: any) => {
    if (data.target.value) {
      form.setFieldsValue({ blockName: data.target.value + '幢' })
    } else {
      form.setFieldsValue({ blockName: '' })
    }
  }
  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '新增'}楼栋`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data}>
        {!data && (
          <>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="社区信息">
              <Input defaultValue={buildingName} disabled />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="楼栋编号"
              name="blockNo"
              rules={[
                { required: true, message: '不能为空' },
                {
                  pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,
                  message: '楼栋编号为楼的ID号且必须为1-999的整数',
                },
              ]}
            >
              <Input onChange={v => blockNochange(v)} />
            </FormItem>
          </>
        )}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="楼栋名称"
          name="blockName"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        {!data && (
          <>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="地上层数"
              name="onGround"
              rules={[
                { required: true, message: '不能为空' },
                {
                  pattern: /^\+?[1-9]{1}[0-9]{0,1}$/,
                  message: '地上层数不能为0且至多输入100层',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="地下层数"
              name="underGround"
              rules={[
                {
                  pattern: /^([0-3]{1})$/,
                  message: '地下层数至多输入3层',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="单元数量"
              name="unitNum"
              rules={[
                { required: true, message: '不能为空' },
                {
                  // pattern: /^([1-9]{1,2}|30)$/,
                  pattern: /^(^[1-9]|[1-2][0-9]?|30)$/,
                  message: '单元数量不能为0且至多输入30单元',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="每层户数"
              name="households"
              rules={[
                { required: true, message: '不能为空' },
                {
                  pattern: /^(^[1-9]|[1-5][0-9]?|60)$/,
                  message: '每层户数不能为0且至多输入60户',
                },
              ]}
            >
              <Input />
            </FormItem>
          </>
        )}
      </Form>
    </Modal>
  )
}

const BuildingSetting = (props: any) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [currBuilding, setCurrBuilding] = useState<any>(null)
  const [currBuildingInfo, setCurrBuildingInfo] = useState<any>({})
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const canEdit = useCanEdit()
  const [form] = Form.useForm()
  const currBuildingId = props.match.params.id

  const fetch = useCallback((pagination: any = { page: 1, page_size: 10 }) => {
    setLoading(true)
    let data = {
      ...pagination,
      buildingId: currBuildingId,
    }
    queryBuildingsById(data).then(res => {
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
  }, [])

  useEffect(() => {
    getBuildingInfoById(currBuildingId).then(res => {
      setCurrBuildingInfo(res)
    })
    fetch()
  }, [fetch])

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
  }

  const handleSubmit = (values: any) => {
    if (currBuilding) {
      let data = {
        ...values,
        id: currBuilding.id,
        buildingId: parseInt(currBuildingId),
        blockNo: parseInt(values.blockNo),
        households: parseInt(values.households),
        onGround: parseInt(values.onGround),
        underGround: parseInt(values.underGround),
        unitNum: parseInt(values.unitNum),
        buildingName: currBuildingInfo.name,
      }
      updateBuildings(data)
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
        buildingId: parseInt(currBuildingId),
        blockNo: parseInt(values.blockNo),
        households: parseInt(values.households),
        onGround: parseInt(values.onGround),
        underGround: parseInt(values.underGround),
        unitNum: parseInt(values.unitNum),
        buildingName: currBuildingInfo.name,
      }
      addBuildings(data)
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

  //删除社区
  const onRemove = (record: any) => {
    delBuildings(record.id)
      .then(res => {
        message.success('删除成功')
        fetch()
        handleModalVisible(false)
      })
      .catch(e => {
        handleModalVisible(false)
      })
  }

  // 新增楼栋
  const addBlock = () => {
    setCurrBuilding(null)
    handleModalVisible(true)
  }

  const renderForm = () => {
    return (
      <Form form={form}>
        <Row>
          {canEdit && (
            <Col span={6} style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={() => addBlock()}>
                <PlusOutlined />
                新增楼栋
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
        title: '楼栋',
        dataIndex: 'blockName',
      },
      {
        title: '单元数',
        dataIndex: 'unitNum',
      },
      {
        title: '地上层数',
        dataIndex: 'onGround',
      },
      {
        title: '地下层数',
        dataIndex: 'underGround',
      },
      {
        title: '每层户数',
        dataIndex: 'households',
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
            <Link to={`/system-setting/building/houseSetting/${record.id}`}>房屋管理</Link>
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
        <p>{currBuildingInfo.name}</p>
      </div>
      <FormContainer>{renderForm()}</FormContainer>
      <StandardTable
        loading={loading}
        data={data}
        columns={getColumns()}
        rowKey={(record: any) => record.id}
        onChange={handleTableChange}
      />
      <BuildingForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        buildingName={currBuildingInfo.name}
        data={currBuilding}
      />
    </>
  )
}

export default BuildingSetting
