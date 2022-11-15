import React, { PureComponent, useState, useEffect, useCallback, FC } from 'react'
import {
  Card,
  Button,
  Divider,
  Form,
  Modal,
  Input,
  TreeSelect,
  Select,
  List,
  Cascader,
  message,
} from 'antd'
import { Dispatch, ConnectProps, connect } from 'umi'
import styles from './index.less'

import { ContactsOutlined, PlusOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import CityCascader from '@/components/CityCascader'
import { ConnectState } from '@/models/connect'

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
  const { visible, handleSubmit, data, handleModalVisible } = props

  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue(data)
  }, [data])

  const options = [
    {
      value: 'Henan',
      label: '河南',
      children: [
        {
          value: 'Zhengzhou',
          label: '郑州',
        },
        {
          value: 'Xvchang',
          label: '许昌',
        },
      ],
    },
    {
      value: 'Hebei',
      label: '河北',
      children: [
        {
          value: 'Shijiazhuang',
          label: '石家庄',
        },
        {
          value: 'Langfang',
          label: '廊坊',
        },
      ],
    },
  ]

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
      title={`${data ? '修改' : '新增'}区域`}
      okText="确认"
      cancelText="取消"
      onCancel={() => handleModalVisible()}
      onOk={okHandle}>
      <Form form={form} preserve={false}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="区域名称"
          name="name"
          rules={[{ required: true, message: '不能为空' }]}>
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="选择城市"
          name="cities"
          rules={[{ required: true, message: '不能为空' }]}>
          <Cascader options={options} expandTrigger="hover" placeholder="请选择地区" />
        </FormItem>
      </Form>
    </Modal>
  )
}

const Region: FC<RegionProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [curRegion, setCurRegion] = useState<any | null>()

  const { dispatch, region } = props
  const { regionList } = region

  useEffect(() => {
    dispatch({
      type: 'region/fetch',
    })
  }, [])

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
    setCurRegion(null)
  }
  const handleUpdateModalVisible = (flag: any, record: any) => {
    setVisible(!!flag)
    setCurRegion(record)
  }

  const handleSubmit = async (values: any) => {
    // const data = {
    //   mobile: values.mobile,
    //   name: values.name,
    //   roleId: parseInt(values.roleId, 10),
    //   username: values.username,
    // }
    if (curRegion) {
      // 修改
      await dispatch({
        type: 'region/save',
        payload: {
          id: curRegion.id,
          ...values,
        },
      })
      message.success('修改成功')
    } else {
      // 新建
      await dispatch({
        type: 'region/save',
        payload: values,
      })
      message.success('新增成功')
    }
    handleModalVisible()
  }

  //删除区域
  const onRemove = (record: any) => {
    dispatch({
      type: 'region/delete',
      payload: [record],
    })
  }

  const renderProject = (item: any) => {
    return (
      <ListItem key={item.id} className={styles.listItem}>
        <div className={styles.updateDelete}>
          <a onClick={() => handleUpdateModalVisible(true, item)}>修改</a>
          <Divider type="vertical" />
          <TableDeleteBtn onDelete={() => onRemove(item.id)} />
        </div>
        <Card hoverable title={item.name}>
          <p>包含城市：</p>
          <p>
            {item.cities &&
              item.cities.map((item: any) => <span key={item.cityId}>{item.cityName}、</span>)}
          </p>
        </Card>
      </ListItem>
    )
  }

  return (
    <>
      <div className={styles.header}>
        <Select style={{ width: 200 }}>
          <Option key="1" value="华北">
            华北
          </Option>
          <Option key="2" value="华中">
            华中
          </Option>
          <Option key="3" value="华东">
            华东
          </Option>
        </Select>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            setVisible(true)
          }}>
          <PlusOutlined />
          新增社区
        </Button>
      </div>
      <List
        split={true}
        grid={{ gutter: 16, column: 4 }}
        dataSource={regionList}
        renderItem={renderProject}></List>
      <RegionForm
        visible={visible}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        data={curRegion}
      />
    </>
  )
}

export default connect(({ region, loading }: ConnectState) => ({
  region,
  loading: loading.models.account,
}))(Region)
