import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'umi'
import { CopyOutlined } from '@ant-design/icons'

import {
  Card,
  Skeleton,
  DatePicker,
  Row,
  Col,
  Form,
  Input,
  Button,
  Badge,
  message,
  Select,
  Divider,
  Tag,
} from 'antd'
import {
  getDavinciHostCount,
  // getHostInstallCountToday,
  getAllHostList,
  getHostEditions,
  getProjectList,
  //新
  queryDeveloperRegions,
  getHostDistribution,
  exportExce,
  queryHostTodayStatusNum,
} from '@/services/api'
import moment from 'moment'

import { disabledDate } from '@/utils/utils'
import useApiLoading from '@/hooks/useApiLoading'
import styles from './index.less'
import FormContainer from '@/components/FormContainer'
import StandardTable from '@/components/StandardTable'
import UltraBarChart from '@/components/eCharts/UltraBarChart'
import copy from 'copy-to-clipboard'
import qs from 'qs'

const { MonthPicker } = DatePicker
const { Option } = Select

interface AllHostList {
  homeId?: string
  id?: number
  hardWard?: string
  hostVersion?: string
  status?: string
  online?: boolean
  projectName?: string
}

export default function IndexPage() {
  const [developerUserList, setDeveloperUserList] = useState<any>([{ id: 0, name: '全部' }])
  const [selectDeveloperUser, setSelectDeveloperUser] = useState<any>(0)
  const [buildingList, setBuildingList] = useState<any>([{ id: 0, name: '全部' }])
  const [selectBuilding, setSelectBuilding] = useState<any>(0)
  const [allHostNum, setAllHostNum] = useState<any>()
  const [allBindNum, setAllBindNum] = useState<any>()
  const [deliveryNum, setDeliveryNum] = useState<any>()
  const [activationNum, setActivationNum] = useState<any>()
  const [bindNum, setBindNum] = useState<any>()
  const [repairNum, setRepairNum] = useState<any>()
  const [scrapNum, setScrapNum] = useState<any>()
  const [onlineNum, setOnlineNum] = useState<any>()
  const [offlineNum, setOfflineNum] = useState<any>()
  const [fengchaoNum, setFengchaoNum] = useState<any>()
  const [dafenqiNum, setDafenqiNum] = useState<any>()
  const [hostInstallCountToday, setHostInstallCountToday] = useState<any>()
  const [hostBindCountToday, setHostBindCountToday] = useState<any>()
  const [hostDismantleCountToday, setHostDismantleCountToday] = useState<any>()
  const [hostRepairCountToday, setHostRepairCountToday] = useState<any>()
  const [hostEditions, sethostEditions] = useState([])
  const [hostEditionsList, setHostEditionsList] = useState([])

  const [formValues, setFormValues] = useState<any>({})
  const [projectList, setprojectList] = useState([])

  const { api, loading } = useApiLoading(getAllHostList)
  const [data, setData] = useState({})
  const [filters, setFilters] = useState<any>({})
  const [pagination, setPagination] = useState({ pageIndex: 1, pageCount: 10 })
  // const { api: getHostHistoryapi, loading: loadingHistory } = useApiLoading(getHostHistory)
  const FormItem = Form.Item
  const [form] = Form.useForm()
  const statusDataColor = {
    area0: '#0090FF',
    area1: '#00CBFF',
  }

  //获取开发商列表
  useEffect(() => {
    queryDeveloperRegions().then(res => {
      let DeveloprtList = [...developerUserList, ...res]
      setDeveloperUserList(DeveloprtList)
    })
  }, [])
  //顶部数据栏
  useEffect(() => {
    let data = {
      regionId: selectDeveloperUser == 0 ? null : selectDeveloperUser,
      buildingId: selectBuilding == 0 ? null : selectBuilding,
    }
    console.log(data, 'datadatadata')

    queryHostTodayStatusNum(data).then(res => {
      setAllHostNum(res.totalCount) //主机总数
      setOnlineNum(res.onlineCount) //在线数量
      setOfflineNum(res.offlineCount) //离线数量
      setAllBindNum(res.bindPeopleCount) //绑定总人数
      setDeliveryNum(res.factoryCount) //出厂数量
      setActivationNum(res.installCount) //激活数量
      setBindNum(res.bindCount) //绑定数量
      setRepairNum(res.repairCount) //报修数量
      setScrapNum(res.scrapCount) //报废
      setHostInstallCountToday(res.todayInstallCount) //今日安装主机
      setHostBindCountToday(res.todayBindCount) //今日绑定主机
      setHostDismantleCountToday(res.toDayDismantleHostCount) //今日拆除主机
      setHostRepairCountToday(res.toDayRepairHostCount) //今日报修主机
    })

    //查询硬件版本
    getDavinciHostCount(data).then(res => {
      const fengchao = res.find((item: any) => item.hardward == 'Raspberry')
      const dafenqi = res.find((item: any) => item.hardward === 'ALLWINNER')
      setFengchaoNum(fengchao ? fengchao.num : 0)
      setDafenqiNum(dafenqi ? dafenqi.num : 0)
    })

    //主机版本
    getHostEditions(data).then(res => {
      sethostEditions(res)
    })

    //主机版本分布
    getHostDistribution(data).then(res => {
      setHostEditionsList(res.data)
    })
  }, [selectDeveloperUser, selectBuilding])

  useEffect(() => {
    getProjectList().then(res => {
      setprojectList(res)
    })
  }, [])

  useEffect(() => {
    if (filters.online && filters.online.length == 1) {
      var online = filters.online[0]
    } else {
      var online = undefined
    }
    let data
    if (filters) {
      data = {
        projectId: filters.projectId?.toString(),
        status: filters.status?.toString(),
        hardWard: filters.hardWard?.toString(),
        isOnLine: online,
        hostVersion: filters.hostVersion?.toString(),
        regionId: selectDeveloperUser == 0 ? null : selectDeveloperUser,
        buildingId: selectBuilding == 0 ? null : selectBuilding,
      }
    }
    var args = { ...pagination, ...formValues, ...data }
    api(args).then(res => {
      setData({
        list: res.data.hostArr,
        pagination: {
          total: res.data.hostCount,
          current: pagination.pageIndex,
          pageSize: pagination.pageCount,
        },
      })
    })
  }, [pagination, formValues, filters, selectDeveloperUser, selectBuilding])

  const handleCopy = (value: any) => {
    if (copy(value)) {
      message.success('ID号已复制')
    } else message.error('复制失败，请手动复制')
  }
  const onTableChange = (paginationsdata: any, filters: any) => {
    setFilters(filters)
    setPagination({ pageIndex: paginationsdata.current || 1, pageCount: paginationsdata.pageSize })
  }
  const columns = [
    {
      title: '主机ID',
      dataIndex: 'homeId',
      ellipsis: true,
      render: (text: any) => (
        <span>
          <CopyOutlined style={{ color: '#999999' }} onClick={() => handleCopy(text)} />
          {text ? text : '--'}
        </span>
      ),
    },
    {
      title: '主机硬件型号',
      dataIndex: 'hardWard',
      filters: [
        { value: 'Raspberry', text: '蜂巢' },
        { value: 'ALLWINNER', text: 'AI MIND' },
      ],
      filteredValue: filters.hardWard || null,
      render: (text: any) =>
        text
          ? text.toUpperCase() == 'ALLWINNER'
            ? 'AI MIND'
            : text == 'Raspberry'
            ? '蜂巢'
            : text
          : '蜂巢',
    },
    {
      title: '当前版本号',
      dataIndex: 'hostVersion',
      filters: hostEditions.map((item: any) => ({
        text: item,
        value: item == '无版本信息' ? 'nullVersion' : item,
      })),
      filteredValue: filters.hostVersion || null,
      render: (text: any) => (text === 'unknown' ? '--' : text ? text : '--'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        { value: 'FACTORY', text: '出厂' },
        { value: 'SCRAP', text: '报废' },
        { value: 'INSTALL', text: '激活' },
        { value: 'REPAIR,REPAIRING', text: '返修' },
        { value: 'BIND', text: '绑定' },
      ],
      filteredValue: filters.status || null,
      render: (text: any) => {
        if (text == 'FACTORY') {
          return '出厂'
        } else if (text == 'SCRAP') {
          return '报废'
        } else if (text == 'REWORK') {
          return '返修'
        } else if (text == 'INSTALL') {
          return '激活'
        } else if (text == 'REPAIR') {
          return '返修'
        } else if (text == 'REPAIRING') {
          return '返修中'
        } else if (text == 'BIND') {
          return '绑定'
        } else {
          return '--'
        }
      },
    },
    {
      title: '是否在线',
      dataIndex: 'online',
      filters: [
        { value: true, text: '在线' },
        { value: false, text: '离线' },
      ],
      filteredValue: filters.online || null,
      render: (online: any) => (
        <Badge status={online ? 'success' : 'error'} text={online ? '在线' : '离线'} />
      ),
    },
    {
      title: '所属客户',
      dataIndex: 'developerName',
      // filters: projectList.map((item: any) => ({ text: item.projectName, value: item.id })),
      // filteredValue: filters.projectId || null,
      render: (text: string, record: any) => (text ? text : '--'),
    },
    {
      title: '关联社区',
      dataIndex: 'buildingName',
      render: (text: string, record: any) => (text ? text : '--'),
    },
    {
      title: '激活信息',
      dataIndex: 'blockHomeName',
      render: (text: string, record: any) => (text ? text : '--'),
    },
    {
      title: '操作',
      render: (text: string, record: AllHostList) => (
        <a href={`/host-management/host/list/${record.homeId}`} target="_blank">
          详情
        </a>
      ),
    },
  ]

  const handleFormReset = () => {
    setFormValues({})
    setFilters({})
    form.resetFields()
  }

  const handleSearch = (formValues: any) => {
    if (formValues) {
      let values = {}
      const { timeRange = [], hostId } = formValues
      if (hostId || timeRange.length) {
        values = {
          hostId: hostId ? hostId : undefined,
        }
      }
      setFormValues(values)
      setPagination({ pageIndex: 1, pageCount: 10 })
    }
  }

  const handleFormExport = useCallback(() => {
    if (filters.online && filters.online.length == 1) {
      var online = filters.online[0]
    } else {
      var online = undefined
    }
    let data = {
      projectId: filters.projectId?.toString() ? filters.projectId?.toString() : null,
      status: filters.status?.toString() ? filters.status?.toString() : null,
      hardWard: filters.hardWard?.toString() ? filters.hardWard?.toString() : null,
      isOnLine: online === undefined ? null : online,
      hostVersion: filters.hostVersion?.toString() ? filters.hostVersion?.toString() : null,
      regionId: selectDeveloperUser == 0 ? null : selectDeveloperUser,
      buildingId: selectBuilding == 0 ? null : selectBuilding,
      hostId: formValues.hostId ? formValues.hostId : null,
      developerId: localStorage.getItem('developerId'),
    }
    exportExce(data)
  }, [formValues, filters, selectDeveloperUser, selectBuilding])

  const renderForm = () => {
    return (
      <Form form={form} onFinish={handleSearch} layout="inline">
        <FormItem label="主机ID" name="hostId">
          <Input style={{ width: 300 }} />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button onClick={handleFormReset}>重置</Button>
          <Button type="primary" onClick={handleFormExport}>
            导出
          </Button>
        </FormItem>
      </Form>
    )
  }

  //选择开发商
  const onChangeCurrDeveloprt = (value: any) => {
    setSelectDeveloperUser(value)
    //根据所选开发商ID获取社区列表
    const CurrDeveloper = developerUserList.find((item: any) => item.id === value)
    if (CurrDeveloper.buildings) {
      setBuildingList([{ id: 0, name: '全部' }, ...CurrDeveloper.buildings])
      onChangeCurrBuilding(0)
    } else {
      setBuildingList([{ id: 0, name: '全部' }])
      onChangeCurrBuilding(0)
    }
  }
  let hostState = [
    {
      name: '出厂',
      value: deliveryNum,
    },
    {
      name: '激活',
      value: activationNum,
    },
    {
      name: '绑定',
      value: bindNum,
    },
    {
      name: '报修中',
      value: repairNum,
    },
    {
      name: '报废',
      value: scrapNum,
    },
  ]
  let todaysData = [
    {
      title: '今日激活',
      value: hostInstallCountToday,
      src: require('../../../assets/images/status1.png'),
    },
    {
      title: '今日绑定',
      value: hostBindCountToday,
      src: require('../../../assets/images/status2.png'),
    },
    {
      title: '今日拆除',
      value: hostDismantleCountToday,
      src: require('../../../assets/images/status3.png'),
    },
    {
      title: '今日报修',
      value: hostRepairCountToday,
      src: require('../../../assets/images/status4.png'),
    },
  ]

  //选择楼盘
  const onChangeCurrBuilding = (value: any) => {
    console.log(value, 'onChangeCurrBuilding')
    setSelectBuilding(value)
  }
  return (
    <>
      <Row gutter={24}>
        <Col lg={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <label>区域：</label>
          <Select
            style={{ width: '50%' }}
            onChange={onChangeCurrDeveloprt}
            value={selectDeveloperUser}
          >
            {developerUserList &&
              developerUserList.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Col>
        <Col lg={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <label>关联社区:</label>
          <Select style={{ width: '50%' }} onChange={onChangeCurrBuilding} value={selectBuilding}>
            {buildingList &&
              buildingList.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </Col>
      </Row>
      <Row
        gutter={24}
        style={{
          margin: '28px 0',
        }}
      >
        <Col lg={5} style={{ padding: '0' }}>
          <div className={styles.statistics}>
            <div className={styles.leftTitle}>数据统计</div>
            <Divider className={styles.divider} />
            <div className={styles.allServiceNum}>
              <div className={styles.hostDataItem}>
                <div className={styles.deviceTitle}>设备总数</div>
                <div className={styles.deviceNum}>{allHostNum}台</div>
              </div>
              <Divider className={styles.vertucalDivider} type="vertical"></Divider>
              <div className={styles.hostDataItem}>
                <div className={styles.deviceTitle}>绑定总人数</div>
                <div className={styles.bindNum}>{allBindNum}人</div>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={19} style={{ padding: '0 0 0 10px' }}>
          <div className={styles.statistics}>
            <div className={styles.rightTitle}>主机状态</div>
            <Divider className={styles.divider} />
            <div className={styles.device}>
              <div style={{ display: 'flex', width: '60%' }}>
                {hostState &&
                  hostState.map((item: any) => {
                    return (
                      <>
                        <div className={styles.deviceCard}>
                          <div className={styles.deviceTitle}>{item.name}</div>
                          <div className={styles.deviceValue}>{item.value}台</div>
                        </div>
                        {item && item.name && item.name != '报废' && (
                          <Divider
                            type="vertical"
                            style={{ height: '60px', margin: '54px 0' }}
                          ></Divider>
                        )}
                      </>
                    )
                  })}
              </div>
              <Divider type="vertical" style={{ height: '134px', marginTop: '16px' }}></Divider>
              <div
                style={{
                  width: '40%',
                  height: '170px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div className={styles.lineDevices}>
                  <div className={styles.inlineDevice}>
                    <img src={require('../../../assets/images/online.png')} />
                    <div className={styles.inlineTitle}>在线</div>
                    <div className={styles.lineValue}>
                      {onlineNum}
                      <span style={{ fontSize: '24px' }}>台</span>
                    </div>
                  </div>
                  <div className={styles.inlineDevice}>
                    <img src={require('../../../assets/images/offline.png')} />
                    <div className={styles.offlineTitle}>离线</div>
                    <div className={styles.lineValue}>
                      {offlineNum}
                      <span style={{ fontSize: '24px' }}>台</span>
                    </div>
                  </div>
                </div>
                <Divider className={styles.divider} />
                <div className={styles.lineDevices}>
                  <div className={styles.inlineDevice}>
                    <Tag color="blue">蜂巢</Tag>
                    <div className={styles.lineValue}>
                      {fengchaoNum}
                      <span style={{ fontSize: '24px' }}>台</span>
                    </div>
                  </div>
                  <div className={styles.inlineDevice}>
                    <Tag color="green">达芬奇</Tag>
                    <div className={styles.lineValue}>
                      {dafenqiNum}
                      <span style={{ fontSize: '24px' }}>台</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col lg={24}>
          <div className={styles.todayData}>今日数据</div>
          <Divider className={styles.divider} />
          <div className={styles.todaysValue}>
            <Row gutter={24}>
              {todaysData &&
                todaysData.map((item: any) => {
                  return (
                    <Col lg={6}>
                      <div className={styles.todayItem}>
                        <div style={{ marginRight: '56px' }}>
                          <div className={styles.todayTitle}>{item.title}</div>
                          <div className={styles.todayNum}>
                            {item.value}
                            <span style={{ fontSize: '14px', color: '#999999' }}>台</span>
                          </div>
                        </div>
                        <img src={item.src} />
                      </div>
                    </Col>
                  )
                })}
            </Row>
          </div>
        </Col>
      </Row>
      <Card bordered={false}>
        <h3>主机版本分布</h3>
        <UltraBarChart
          data={hostEditionsList}
          className={styles.chartContent}
          color={statusDataColor}
          dataName={'hostVersion'}
          dataValues={'count'}
        />
      </Card>
      <Card bordered={false} className={styles.cards}>
        <FormContainer>{renderForm()}</FormContainer>
        <StandardTable
          rowKey="homeId"
          loading={loading}
          // showPagination={showPagination(data)}
          data={data}
          columns={columns}
          onChange={onTableChange}
        />
      </Card>
    </>
  )
}
