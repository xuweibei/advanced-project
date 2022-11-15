import React, { useState, useEffect, FC } from 'react'
import { Card, Button, Divider, Form, Modal, Input, Select, List, message } from 'antd'
import { Dispatch, ConnectProps, connect } from 'umi'
import styles from './index.less'

import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { ConnectState } from '@/models/connect'
import { getCitiesList, saveRegions, deleteRegions } from '@/services/api'
import useCanEdit from '@/hooks/useCanEdit'

const ListItem = List.Item
const FormItem = Form.Item
const { Option } = Select

interface RegionProps extends ConnectProps {
  dispatch: Dispatch
  form: any
  region: any
  loading: any
}

const RegionForm = (props: any) => {
  const { visible, handleSubmit, data, handleModalVisible, cities } = props

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
  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '新增'}区域`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="区域名称"
          name="name"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="选择城市"
          name="cities"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select
            allowClear
            showSearch
            mode="multiple"
            maxTagCount={3}
            placeholder="请选择城市"
            optionFilterProp="children"
            filterOption={(input: any, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {cities &&
              cities.map((item: any) => (
                <Option key={item.cityid} value={item.cityid}>
                  {item.city}
                </Option>
              ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  )
}

const Region: FC<RegionProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [curRegion, setCurRegion] = useState<any | null>()
  const [cities, setCities] = useState([])
  const canEdit = useCanEdit()
  const [form] = Form.useForm()

  const { dispatch, region } = props
  const { regionList } = region

  useEffect(() => {
    const getCities = async () => {
      const res = await getCitiesList()
      setCities(res.map((item: any) => ({ ...item, cityid: parseInt(item.cityid) })))
    }

    dispatch({
      type: 'region/fetch',
    })
    getCities()
  }, [])

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
  }
  const handleUpdateModalVisible = (flag: any, record: any) => {
    const city: any[] = []
    record.cities &&
      record.cities.map((item: any) => {
        city.push(item.cityId)
      })
    const data = {
      id: record.id,
      name: record.name,
      cities: city,
    }
    setCurRegion(data)
    setVisible(!!flag)
  }

  const handleSubmit = async (values: any) => {
    const data = {
      cityIds: values.cities,
      name: values.name,
    }
    let params
    if (curRegion) {
      // 修改
      params = {
        id: curRegion.id,
        ...data,
      }
      saveRegions(params)
        .then(res => {
          message.success('修改成功')
          handleModalVisible()
          dispatch({
            type: 'region/fetch',
          })
        })
        .catch(e => {
          handleModalVisible()
        })
    } else {
      // 新建
      params = {
        ...data,
      }
      saveRegions(params)
        .then(res => {
          message.success('新增成功')
          handleModalVisible()
          dispatch({
            type: 'region/fetch',
          })
        })
        .catch(e => {
          handleModalVisible()
        })
    }
  }

  //删除区域
  const onRemove = (record: any) => {
    deleteRegions([record])
      .then(res => {
        message.success('删除成功')
        dispatch({
          type: 'region/fetch',
        })
      })
      .catch(e => {
        console.log(e, '删除区域失败')
      })
  }

  const renderProject = (item: any) => {
    return (
      <ListItem key={item.id} className={styles.listItem}>
        {canEdit && (
          <div className={styles.updateDelete}>
            <a onClick={() => handleUpdateModalVisible(true, item)}>修改</a>
            <Divider type="vertical" />
            <TableDeleteBtn onDelete={() => onRemove(item.id)} />
          </div>
        )}
        <Card hoverable title={item.name}>
          <p>包含城市：</p>
          <p className={styles.contentText}>
            {item.cities &&
              item.cities.map((item: any) => (
                <span key={item.cityId}>{item.cityName}&nbsp;&nbsp;</span>
              ))}
          </p>
        </Card>
      </ListItem>
    )
  }

  const handleFormReset = () => {
    form.resetFields()
    dispatch({
      type: 'region/fetch',
    })
  }

  const handleSearch = (values: any) => {
    dispatch({
      type: 'region/fetch',
      payload: {
        ...values,
      },
    })
  }

  const addRegion = () => {
    setCurRegion(null)
    handleModalVisible(true)
  }

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <FormItem name="name">
          <Input placeholder="请输入区域名称" />
        </FormItem>
        <FormItem>
          <Button htmlType="submit" type="primary">
            <SearchOutlined />
            查询
          </Button>
        </FormItem>
        <FormItem>
          <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
            重置
          </Button>
        </FormItem>
        {canEdit && (
          <FormItem>
            <Button type="primary" onClick={() => addRegion()}>
              <PlusOutlined />
              新增区域
            </Button>
          </FormItem>
        )}
      </Form>
    )
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>{renderForm()}</div>
      <List
        split={true}
        grid={{ gutter: 16, column: 4 }}
        dataSource={regionList}
        renderItem={renderProject}
      />
      <RegionForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        cities={cities}
        data={curRegion}
      />
    </>
  )
}

export default connect(({ region, loading }: ConnectState) => ({
  region,
  loading: loading.models.region,
}))(Region)
