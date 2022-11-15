import React, { PureComponent, useState, useEffect, useCallback, FC } from 'react'
import { Dispatch, ConnectProps, connect, Link } from 'umi'
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
  Radio,
  Space,
  Row,
  Col,
  message,
  Popconfirm,
  DatePicker,
  Skeleton,
} from 'antd'
import Line from '../../../components/Charts/Line'
import { ColumnsType } from 'antd/lib/table'
import styles from './parkingDetail.less'
import StandardTable from '@/components/StandardTable'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { ConnectState } from '@/models/connect'
import useLocation from '../../../hooks/useLocation'
import XlsUploader from '../../../components/XlsUploader'
import DaliyDataCard from '@/components/Cards/DaliyDataCard'
import GridContent from '@/components/PageHeaderWrapper/GridContent'
import moment from 'moment'
import {
  getAllBuildingsByRoleId,
  getWorkerListUsingGET,
  queryParkingInfo,
  delParking,
  updateParking,
  addParking,
  removeParkingsById,
  removeParkings,
  getALlBuildingByDeveloperId,
  getCameraOpenCountByMonth,
  getCameraCount,
  getCameraNum,
} from '../../../services/api'
import useCanEdit from '@/hooks/useCanEdit'
import { PHONE_REGEXP, disabledDate } from '../../../utils/utils'
import monitornum from '@/assets/img/moniter_data.png'

const ListItem = List.Item
const FormItem = Form.Item
const { Option } = Select
const { MonthPicker } = DatePicker
const LINE_COLORS = ['#1890ff']

const allCommunities = [
  {
    address: '全部',
    id: 0,
    name: '全部社区',
  },
]

interface BuildingProps extends ConnectProps {
  dispatch: Dispatch
  form: any
  parking: any
  loading: any
  match: any
}

const CAMERA_TYPES = [
  { id: '1', name: '有线摄像机' },
  { id: '2', name: '无线移动侦测相机' },
]

const CAMERA_SCALE = [
  { id: '1', value: 1 },
  { id: '2', value: 1.5 },
  { id: '3', value: 2 },
  { id: '4', value: 2.5 },
  { id: '5', value: 3 },
]

const ParkingForm: FC<any> = props => {
  const { modalVisible, handleSubmit, data, projectId, setModalVisible } = props
  const [form] = Form.useForm()
  const [isYSCamera, setIsYSCamera] = useState<boolean>(false)

  const {
    regions,
    data: location,
    setData: setLocation,
    area,
    setArea,
    city,
    setCity,
    building,
    setBuilding,
    cityOptions,
    buildingOptions,
  } = useLocation()

  useEffect(() => {
    setIsYSCamera(data && data.providerType === '2' ? true : false)
  }, [data])

  useEffect(() => {
    form.resetFields()
    if (data) {
      setLocation([[data.regionId], [data.cityId], [data.buildingId]])
    } else {
      setLocation([])
    }
  }, [data])

  const okHandle = () => {
    form
      .validateFields()
      .then(values => {
        if (data) {
          let params = {
            ...values,
            id: data.id,
            projectId: projectId,
          }
          handleSubmit(params)
        } else {
          let params = {
            ...values,
            projectId: projectId,
          }
          handleSubmit(params)
        }
        setLocation([])
        form.resetFields()
      })
      .catch(e => {
        console.log('获取form数据失败', e)
      })
  }

  const onChange = (e: any) => {
    if (e == 1) {
      setIsYSCamera(false)
    } else if (e == 2) {
      setIsYSCamera(true)
    }
    return e
  }
  const onCancel = () => {
    if (!data) {
      setLocation([])
    }
    if (
      (data && data.regionId != location[0]) ||
      (data && data.cityId != location[1]) ||
      (data && data.buildingId != location[2])
    ) {
      setLocation([[data.regionId], [data.cityId], [data.buildingId]])
    }
    setModalVisible(false)
    form.resetFields()
  }
  const changeArea = (v: any) => {
    setArea(v)
    form.setFieldsValue({
      cityId: '',
      buildingId: '',
    })
  }

  const changeCity = (v: any) => {
    setCity(v)
    form.setFieldsValue({
      buildingId: '',
    })
  }

  const changeBuilding = (v: any) => {
    setBuilding(v)
  }

  return (
    <Modal
      title={`${data ? '修改' : '添加'}车位`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Form form={form} initialValues={data}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="所在区域"
          name="regionId"
          rules={[{ required: true, message: '请配置区域！' }]}
        >
          <Select showSearch onChange={v => changeArea([v])}>
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
          label="城市"
          name="cityId"
          rules={[{ required: true, message: '请选择城市！' }]}
        >
          <Select showSearch onChange={v => changeCity([v])}>
            {cityOptions &&
              cityOptions.map((city: any, index: any) => (
                <Option key={index} value={city.id}>
                  {city.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="社区"
          name="buildingId"
          rules={[{ required: true, message: '请选择社区！' }]}
        >
          <Select onChange={v => changeBuilding([v])}>
            {buildingOptions &&
              buildingOptions.map((build: any, index: any) => (
                <Option key={index} value={build.id}>
                  {build.name}
                </Option>
              ))}
          </Select>
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="姓名"
          name="owner"
          rules={[{ required: true, message: '请输入业主姓名！' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="手机号"
          name="mobile"
          rules={[{ required: true, pattern: PHONE_REGEXP, message: '请输入合法的手机号' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="车位号"
          name="placeNo"
          rules={[{ required: true, message: '请输入车位号！' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="门牌号"
          name="roomNo"
          rules={[{ required: true, message: '请输入门牌号！' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备型号"
          name="providerType"
          getValueFromEvent={onChange}
          rules={[{ required: true, message: '请选择设备类型' }]}
        >
          <Select allowClear>
            {CAMERA_TYPES.map((item: any, index: any) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>

        {isYSCamera && (
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="放大系数"
            name="scale"
            rules={[{ required: true, message: '请选择摄像头放大系数' }]}
          >
            <Select allowClear>
              {CAMERA_SCALE.map((item: any, index: any) => (
                <Option key={item.id} value={item.value}>
                  {item.value}
                </Option>
              ))}
            </Select>
          </FormItem>
        )}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="设备序列号"
          name="monitorNo"
          rules={[{ required: true, message: '请输入设备序列号！' }]}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  )
}

const Building: FC<BuildingProps> = props => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
  const [parkingListData, setParkingListData] = useState<any>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [curParking, setCurParking] = useState<any>()
  const [query, setQuery] = useState<{ place_no: any }>()
  const [allBuildings, setAllBuildings] = useState<any>([])
  const [selectBuilding, setSelectBuilding] = useState<any>(0)
  const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
    current: 1,
    pageSize: 10,
  })
  const [historyOpenMonth, setHistoryOpenMonth] = useState<any>(moment())
  const [parkNo, setParkNo] = useState<any>()
  const [filters, setFilters] = useState<any>({})
  const [formValues, setformValues] = useState<any>({})
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false)
  const [launchOpenTimes, setLaunchOpenTimes] = useState<any>([])
  const [cameraCount, setCameraCount] = useState<number>(0)
  const canEdit = useCanEdit()

  const cameraAllNum = [
    {
      count: cameraCount,
    },
  ]
  useEffect(() => {
    let params
    if (selectBuilding === 0) {
      params = {
        developerId: localStorage.getItem('developerId'),
      }
    } else {
      params = {
        developerId: localStorage.getItem('developerId'),
        buildingId: selectBuilding,
      }
    }
    getCameraNum(params).then(res => {
      setCameraCount(res)
    })
  }, [selectBuilding])

  useEffect(() => {
    getALlBuildingByDeveloperId().then(res => {
      let data = allCommunities.concat(res)
      setAllBuildings(data)
    })
  }, [])
  useEffect(() => {
    setLoadingHistory(true)
    let params
    if (selectBuilding === 0) {
      params = {
        date: historyOpenMonth.startOf('month').format('YYYY-MM'),
        developerId: localStorage.getItem('developerId'),
      }
    } else {
      params = {
        date: historyOpenMonth.startOf('month').format('YYYY-MM'),
        developerId: localStorage.getItem('developerId'),
        building_id: selectBuilding,
      }
    }
    getCameraOpenCountByMonth(params).then(res => {
      let data
      if (res) {
        const today = moment()
        data = res.filter((item: any) => moment(item.dat).isSameOrBefore(today, 'date'))
      }
      setLaunchOpenTimes(res)
      setLoadingHistory(false)
    })
  }, [selectBuilding])

  const fetchData = useCallback(() => {
    let data: any = {}
    if (selectBuilding === 0) {
      data = {
        page: pagination.current,
        page_size: pagination.pageSize,
        developerId: localStorage.getItem('developerId'),
        ...data,
      }
    } else {
      data = {
        page: pagination.current,
        page_size: pagination.pageSize,
        developerId: localStorage.getItem('developerId'),
        building_id: selectBuilding,
        ...data,
      }
    }
    if (formValues.parkNo) {
      data = {
        page: pagination.current,
        page_size: pagination.pageSize,
        place_no: formValues.parkNo,
        ...data,
        ...query,
      }
    } else {
      data = {
        page: pagination.current,
        page_size: pagination.pageSize,
        ...data,
        ...query,
      }
    }
    queryParkingInfo({
      ...data,
      provider_type: filters.providerType ? filters.providerType : null,
      // projectId: props.match.params.id,
    }).then((res: any) => {
      const data = {
        pagination: {
          ...pagination,
          total: res.data.count,
        },
        list: res.data.results,
      }
      setParkingListData(data)
    })
  }, [pagination, query, formValues, selectBuilding, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    getALlBuildingByDeveloperId().then(res => {
      let data = allCommunities.concat(res)
      setAllBuildings(data)
    })
  }, [])

  useEffect(() => {
    let params
    if (selectBuilding === 0) {
      params = {
        developerId: localStorage.getItem('developerId'),
      }
    } else {
      params = {
        developerId: localStorage.getItem('developerId'),
        buildingId: selectBuilding,
      }
    }
    getCameraCount(params).then((res: any) => {
      setCameraCount(res)
    })
  }, [selectBuilding])

  useEffect(() => {
    setLoadingHistory(true)
    let params
    if (selectBuilding === 0) {
      params = {
        date: historyOpenMonth.startOf('month').format('YYYY-MM'),
        developerId: localStorage.getItem('developerId'),
      }
    } else {
      params = {
        date: historyOpenMonth.startOf('month').format('YYYY-MM'),
        developerId: localStorage.getItem('developerId'),
        buildingId: selectBuilding,
      }
    }
    getCameraOpenCountByMonth(params).then(res => {
      let data
      if (res) {
        const today = moment()
        data = res.filter((item: any) => moment(item.dat).isSameOrBefore(today, 'date'))
      }
      setLaunchOpenTimes(data)
      setLoadingHistory(false)
    })
  }, [selectBuilding])

  const search = () => {
    setformValues({ parkNo: parkNo })
    setPagination({
      current: 1,
      pageSize: 10,
    })
  }

  const handleUpdateModalVisible = (flag: boolean, record: any) => {
    setCurParking(record ? record : null)
    setModalVisible(flag)
  }

  const changeSelBuilding = (value: any) => {
    setSelectBuilding(value)
    setformValues({})
    setParkNo('')
    setPagination({ current: 1, pageSize: 10 })
  }

  const handleTableChange = useCallback((pagination: any, filters: any) => {
    setPagination(pagination)
    setFilters(filters)
  }, [])

  const changParkNo = ({ target: { value } }: any) => {
    setParkNo(value)
  }
  //修改单个车位信息
  const handleSubmit = (values: any) => {
    if (values.id) {
      updateParking(values.id, values)
        .then(res => {
          message.success('修改成功')
          // setQuery(values.placeNo)
          setModalVisible(false)
          fetchData()
        })
        .catch(e => {
          // message.error('修改单个车位信息出错', e)
          console.log('修改单个车位信息出错', e)
        })
    } else {
      addParking(values)
        .then(res => {
          message.success('添加单个车位信息成功')
          // setQuery(values.placeNo)
          setModalVisible(false)
        })
        .catch(e => {
          // message.error('添加单个车位信息出错', e)
          console.log('添加单个车位信息出错', e)
        })
    }
  }

  //删除
  //删除单个车位
  const onRemoveParking = (record: any) => {
    removeParkingsById(record.id)
      .then(res => {
        message.success('删除成功')
        // setQuery(record.placeNo)
        fetchData()
      })
      .catch(e => {
        message.error('删除失败', e)
      })
  }
  //删除多选车位
  const batchRemove = () => {
    removeParkings(selectedRowKeys)
      .then(res => {
        message.success('删除成功')
        setQuery(selectedRowKeys[0].placeNo)
        fetchData()
      })
      .catch(e => {
        message.error('删除失败', e)
      })
  }

  /**
   * 获取监控打开次数历史数据。按月查天
   */
  const getOpenHistoryData = (historyOpenMonth: any) => {
    historyOpenMonth = historyOpenMonth.clone()
    const date = historyOpenMonth.startOf('month').format('YYYY-MM')
    let params
    if (selectBuilding === 0) {
      params = {
        date: date,
        developerId: localStorage.getItem('developerId'),
      }
    } else {
      params = {
        date: date,
        developerId: localStorage.getItem('developerId'),
        buildingId: selectBuilding,
      }
    }

    getCameraOpenCountByMonth(params).then(res => {
      let data
      if (res) {
        const today = moment()
        data = res.filter((item: any) => moment(item.dat).isSameOrBefore(today, 'date'))
      }
      setLaunchOpenTimes(res)

      setLoadingHistory(false)
    })
  }

  const renderForm = (canEdit: any) => {
    return (
      <Row>
        <Col span={4}>
          <Input
            placeholder="车位号,业主姓名,手机号,门牌号"
            value={parkNo}
            onChange={changParkNo}
          />
        </Col>
        <Col span={4} style={{ textAlign: 'center' }}>
          <Button htmlType="submit" type="primary" onClick={() => search()}>
            <SearchOutlined />
            查询
          </Button>
        </Col>
        <Col span={4}>
          <XlsUploader />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => handleUpdateModalVisible(true, null)}>
            <PlusOutlined />
            新增车位
          </Button>
        </Col>
        <Col span={4}>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="确定要批量删除吗?"
              onConfirm={batchRemove}
              okText="是"
              cancelText="否"
            >
              <Button type="primary" style={{ marginLeft: 5 }}>
                批量删除
              </Button>
            </Popconfirm>
          )}
        </Col>
      </Row>
    )
  }

  const onOpenMonthChange = (historyOpenMonth: any) => {
    getOpenHistoryData(historyOpenMonth)
    setHistoryOpenMonth(historyOpenMonth)
  }

  const renderOpenLineChart = () => {
    if (loadingHistory) {
      return <Skeleton />
    }
    // const { launchOpenTimes } = cameraData
    if (launchOpenTimes.length == 0) {
      return (
        <div className={styles.nodata}>
          <img className={styles.nodataimg} src={monitornum} />
          <p className={styles.nodatap}>暂无数据</p>
        </div>
      )
    }
    const data = [].concat(
      launchOpenTimes.map((item: any) => ({
        x: '' + moment(item.dat).date(),
        y: item.coun,
        name: '监控打开次数',
        color: 1,
      }))
    )
    const scale = {
      x: { alias: '日期', min: 1, tickInterval: 1, max: 31, type: 'linear' },
      y: { min: 0, type: 'pow' },
    }
    return <Line data={data} scale={scale} color={['color', (color: any) => LINE_COLORS[color]]} />
  }
  console.log(parkingListData)
  const getColumns = (): ColumnsType => {
    const columns: ColumnsType = [
      {
        title: '城市',
        dataIndex: 'cityName',
      },
      {
        title: '社区',
        dataIndex: 'buildingName',
      },
      {
        title: '监控类型',
        dataIndex: 'providerType',
        filters: [
          { value: '1', text: '有线' },
          { value: '2', text: '无线' },
        ],
        filterMultiple: false,
        filteredValue: filters.providerType || null,
        render: (text: any, record: any) => (
          <span>{(text = record.providerType == '2' ? '无线' : '有线')}</span>
        ),
      },
      {
        title: '车位号',
        dataIndex: 'placeNo',
      },
      {
        title: '姓名',
        dataIndex: 'owner',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '门牌号',
        dataIndex: 'roomNo',
      },
    ]
    if (canEdit) {
      columns.push({
        title: '操作',
        render: (text: any, record: any) => (
          <>
            {record.providerType == 2 && (
              <>
                <Link to={`/parking-management/camera-project/list/realtime/${record.id}`}>
                  查看监控详情
                </Link>
                <Divider type="vertical" />
              </>
            )}
            <a
              className={styles.updateButton}
              onClick={() => handleUpdateModalVisible(true, record)}
            >
              修改
            </a>

            <Divider type="vertical" />
            <Popconfirm
              className={styles.deleteButton}
              title="确定要删除吗?"
              onConfirm={() => onRemoveParking(record)}
              okText="是"
              cancelText="否"
            >
              <a className={styles.tableDelete}>删除</a>
            </Popconfirm>
          </>
        ),
      })
    }
    return columns
  }

  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: 10 }}>
        <Col lg={24}>
          <label>选择社区：</label>
          <Select
            style={{ width: '30%' }}
            value={selectBuilding}
            onChange={v => changeSelBuilding(v)}
          >
            {allBuildings.map((item: any, index: any) => (
              <Option key={index} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <GridContent>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col md={8} sm={24}>
            <DaliyDataCard title="云监控总数" value={cameraAllNum} />
          </Col>
        </Row>
        <Card bordered={false} style={{ marginBottom: 25, borderRadius: 20 }}>
          <div className={styles.lineChartHeader}>
            <h4 className={styles.lineCharth}>监控打开历史数据</h4>
            <MonthPicker
              placeholder="请选择月份"
              value={historyOpenMonth}
              format="YYYY年MM月"
              disabledDate={disabledDate}
              onChange={onOpenMonthChange}
            />
          </div>
          {renderOpenLineChart()}
        </Card>
      </GridContent>
      <div>
        {canEdit && (
          <div style={{ flexWrap: 'nowrap' }}>
            <div>{renderForm(canEdit)}</div>
          </div>
        )}
      </div>
      <Card>
        <StandardTable
          data={parkingListData}
          columns={getColumns()}
          rowKey={(record: any) => record.id}
          selectedRowKeys={canEdit ? selectedRowKeys : null}
          onSelectRow={v => setSelectedRowKeys(v)}
          onChange={handleTableChange}
        />
      </Card>
      <ParkingForm
        data={curParking}
        handleSubmit={handleSubmit}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </>
  )
}

export default connect(({ parking, loading }: ConnectState) => ({
  parking,
  loading: loading.models.account,
}))(Building)
