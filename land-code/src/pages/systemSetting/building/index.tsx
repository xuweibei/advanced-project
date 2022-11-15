import React, { useState, useEffect, FC } from 'react'
import { Dispatch, ConnectProps, connect, Link, request } from 'umi'
import { Map, Marker } from 'react-amap'
import {
  Card,
  Button,
  Divider,
  Form,
  Modal,
  Input,
  Select,
  List,
  message,
  Row,
  Col,
  Pagination,
} from 'antd'
import styles from './index.less'

import { PlusOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { ConnectState } from '@/models/connect'
import FormContainer from '@/components/FormContainer'
import useCanEdit from '@/hooks/useCanEdit'
import { deleteBuilding, getBuilding } from '@/services/api'

const ListItem = List.Item
const FormItem = Form.Item
const { Option } = Select

interface BuildingProps extends ConnectProps {
  dispatch: Dispatch
  form: any
  building: any
  loading: any
}
const getCities = (regions: any, regionID: number) => {
  if (!regions || !regions.length) {
    return []
  }
  if (!regionID) {
    return regions.reduce((cities: any, region: any) => cities.concat(region.cities), [])
  }
  const region = regions && regions.find((item: any) => item.id === regionID)
  return region && region.cities
}

const unique = (arr: [], key: string = 'id') => {
  const map = {}
  arr.forEach(item => {
    if (!map[item[key]]) {
      map[item[key]] = item
    }
  })
  return Object.values(map)
}

const BuildingForm = (props: any) => {
  const { visible, handleSubmit, data, handleModalVisible, regions, unique } = props
  const [city, setCity] = useState([])
  const [building, setBuilding] = useState([])
  const [markerPosition, setMarkerPosition] = useState({
    longitude: 121.467884,
    latitude: 31.243549,
  })
  const [mapCenter, setMapCenter] = useState({ longitude: 121.467884, latitude: 31.243549 })
  const [form] = Form.useForm()

  useEffect(() => {
    if (data) {
      setCity(unique(getCities(regions, data.regionId)))
    }
  }, [regions, data])

  useEffect(() => {
    if (data) {
      setMarkerPosition({
        longitude: data.longitude ? data.longitude : 121.467884,
        latitude: data.latitude ? data.latitude : 31.243549,
      })
      setMapCenter({
        longitude: data.longitude ? data.longitude : 121.467884,
        latitude: data.latitude ? data.latitude : 31.243549,
      })
    }
    form.resetFields()
    loadBuilding()
  }, [data])

  const okHandle = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        const data = {
          ...values,
          ...markerPosition,
        }
        handleSubmit(data)
      })
      .catch(info => {})
  }

  const regionChange = () => {
    const regionId = form.getFieldValue('regionId')
    form.setFieldsValue({
      cityId: null,
    })
    const region = regions && regions.find((item: any) => item.id === regionId)
    setCity(region && region.cities)
  }

  const loadBuilding = () => {
    const regionId = form.getFieldValue('regionId')
    const cityId = form.getFieldValue('cityId')
    getBuilding({ regionId, cityId, page: 1, page_size: 500 })
      .then(response => {
        setBuilding(response.results)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const cityChange = () => {
    loadBuilding()
  }

  const markerEvents = {
    click: (e: any) => {
      setMarkerPosition({
        longitude: e.lnglat.lng,
        latitude: e.lnglat.lat,
      })
      setMapCenter({
        longitude: e.lnglat.lng,
        latitude: e.lnglat.lat,
      })
    },
  }

  const onCancel = () => {
    handleModalVisible(false)
    form.resetFields()
  }

  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '新增'}社区`}
      okText="确认"
      cancelText="取消"
      onCancel={onCancel}
      onOk={okHandle}
    >
      <Form form={form} initialValues={data}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="社区名称"
          name="name"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="所在区域"
          name="regionId"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select allowClear style={{ width: '100%' }} onChange={regionChange}>
            {regions &&
              regions.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="选择城市"
          name="cityId"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Select allowClear style={{ width: '100%' }} onChange={cityChange}>
            {city &&
              city.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="详细地址"
          name="address"
          rules={[{ required: true, message: '不能为空' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="云对讲平台"
          name="videoCallPlatform"
        >
          <Select allowClear={data?.videoCallPlatform ? false : true} style={{ width: '100%' }}>
            <Option key={1} value={1}>
              海康
            </Option>
            <Option key={2} value={2}>
              泰创
            </Option>
          </Select>
        </FormItem>
        {/* <FormItem name="issueNo" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="期号">
          <Input type="number" />
        </FormItem>
        <FormItem name="parentId" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="父社区">
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              ((option!.children as unknown) as string).includes(input)
            }
            filterSort={(optionA, optionB) =>
              ((optionA!.children as unknown) as string)
                .toLowerCase()
                .localeCompare(((optionB!.children as unknown) as string).toLowerCase())
            }
          >
            {(building || []).map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem name="childIds" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="子社区">
          <Select
            mode="multiple"
            allowClear
            showSearch
            style={{ width: '100%' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              ((option!.children as unknown) as string).includes(input)
            }
            filterSort={(optionA, optionB) =>
              ((optionA!.children as unknown) as string)
                .toLowerCase()
                .localeCompare(((optionB!.children as unknown) as string).toLowerCase())
            }
          >
            {(building || []).map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem> */}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="定位">
          <div style={{ width: '100%', height: '150px' }}>
            <Map
              amapkey={'3a445a2c58e0bddafe6b116e7d3c2579'}
              center={mapCenter}
              events={markerEvents}
            >
              <Marker position={markerPosition} clickable events={markerEvents} />
            </Map>
          </div>
        </FormItem>
      </Form>
    </Modal>
  )
}

const Building: FC<BuildingProps> = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const [regionId, setRegionID] = useState<any>()
  const [curBuilding, setCurBuilding] = useState<any>()
  const [pages, setPages] = useState<number>(1)
  const [buildingForm, setBuildingForm] = useState<any>({})
  const canEdit = useCanEdit()
  const { dispatch, loading, building } = props
  const [searchForm] = Form.useForm()
  const { regions } = building

  let cities = unique(getCities(regions, regionId))

  useEffect(() => {
    dispatch({
      type: 'building/fetch',
      payload: {
        page: 1,
        page_size: 12,
      },
    })
    dispatch({
      type: 'building/getTreePermission',
    })
  }, [])

  const handleModalVisible = (flag?: any) => {
    setVisible(!!flag)
  }

  const addCommunity = () => {
    setVisible(true)
    setCurBuilding(null)
  }

  const handleChangeCommunity = (record?: any) => {
    setVisible(true)
    setCurBuilding(record)
  }

  const handleSubmit = async (values: any) => {
    const value = searchForm.getFieldsValue()
    if (curBuilding) {
      // 修改
      try {
        await dispatch({
          type: 'building/save',
          payload: {
            id: curBuilding.id,
            ...values,
          },
        })
        message.success('修改成功')
      } catch (err) {
        console.log(err)
      }
    } else {
      // 新建
      try {
        await dispatch({
          type: 'building/save',
          payload: {
            ...values,
          },
        })
        message.success('新增成功')
      } catch (err) {
        console.log(err)
      }
    }
    handleModalVisible(false)
    dispatch({
      type: 'building/fetch',
      payload: {
        page: pages,
        page_size: 12,
        ...value,
      },
    })
  }

  //删除社区
  const onRemove = (recordId: number) => {
    const values = searchForm.getFieldsValue()
    deleteBuilding([recordId])
      .then(res => {
        message.success('删除成功')
        dispatch({
          type: 'building/fetch',
          payload: {
            page: pages,
            page_size: 12,
            ...values,
          },
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  const handleSearch = (values: any) => {
    setBuildingForm(values)
    setPages(1)
    try {
      dispatch({
        type: 'building/fetch',
        payload: {
          ...values,
          page: 1,
          page_size: 12,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleTableChange = (page: any) => {
    setPages(page)
    try {
      dispatch({
        type: 'building/fetch',
        payload: {
          page: page,
          page_size: 12,
          ...buildingForm,
        },
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleFormReset = () => {
    searchForm.resetFields()
    setBuildingForm({})
    setPages(1)
    try {
      dispatch({
        type: 'building/fetch',
        payload: {
          page: 1,
          page_size: 12,
        },
      })
    } catch (err) {
      console.log(err)
    }

    setRegionID(null)
  }

  const regionSearchChange = (value: any) => {
    searchForm.setFieldsValue({
      cityId: null,
    })
    setRegionID(value)
  }

  const renderForm = () => {
    return (
      <Form form={searchForm} onFinish={handleSearch}>
        <Row>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="区域" name="regionId">
              <Select onChange={regionSearchChange} allowClear>
                {regions &&
                  regions.map((region: any) => (
                    <Option key={region.id} value={region.id}>
                      {region.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="城市" name="cityId">
              <Select allowClear>
                {cities &&
                  cities.map((cities: any) => (
                    <Option key={cities.id} value={cities.id}>
                      {cities.name}
                    </Option>
                  ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button onClick={handleFormReset}>重置</Button>
          </Col>
          {canEdit && (
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={() => addCommunity()}>
                <PlusOutlined />
                新增社区
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    )
  }

  const renderItem = (item: any) => {
    return (
      <ListItem key={item.id} className={styles.listItem}>
        {canEdit && (
          <div className={styles.updateDelete}>
            <Link to={`/system-setting/building/buildingSetting/${item.id}`}>楼栋配置</Link>
            <Divider type="vertical" />
            <a onClick={() => handleChangeCommunity(item)}>修改</a>
            <Divider type="vertical" />
            <TableDeleteBtn onDelete={() => onRemove(item.id)} />
          </div>
        )}
        <Card hoverable title={item.name}>
          <p>所在区域：{item.regionName}</p>
          <p>所在城市：{item.cityName}</p>
          <p className={styles.address}>详细地址：{item.address}</p>
        </Card>
      </ListItem>
    )
  }
  return (
    <>
      <FormContainer>{renderForm()}</FormContainer>
      <div className={styles.allBuildingTitle}>
        <p>全部社区</p>
      </div>
      <List
        loading={loading}
        split={true}
        grid={{ gutter: 16, column: 4 }}
        dataSource={building.buildingList.list}
        renderItem={renderItem}
      />
      <div className={styles.page}>
        <Pagination
          hideOnSinglePage={true}
          defaultCurrent={1}
          showSizeChanger={false}
          current={
            building.buildingList.pagination.current ? building.buildingList.pagination.current : 1
          }
          pageSize={12}
          total={building.buildingList.pagination.total}
          onChange={handleTableChange}
        />
      </div>
      <BuildingForm
        visible={visible}
        data={curBuilding}
        handleModalVisible={handleModalVisible}
        handleSubmit={handleSubmit}
        regions={regions}
        regionId={regionId}
        unique={unique}
      />
    </>
  )
}

export default connect(({ building, loading }: ConnectState) => ({
  building,
  loading: loading.effects['building/fetch'],
}))(Building)
