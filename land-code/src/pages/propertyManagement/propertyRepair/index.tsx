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
  queryInConnect,
} from '@/services/api'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const { Option } = Select
const { SubMenu } = Menu
const { TextArea } = Input

const PropertyRepair = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>()
  const [area, setArea] = useState<any[]>([])
  const [formdatas, setformdatas] = useState<any>({})
  const [form] = Form.useForm()
  const developerId = localStorage.getItem('developerId')

  const [currCommunityId, setCurrCommunityId] = useState<any>(null)
  const [treeCommunity, setTreeCommunity] = useState<any[]>([])

  const query = props.location.query
  const urlRegions = query.regionId
  const urlBuilding = query.buildingId


  const handleClick = (e: any) => {
    setCurrCommunityId(e.key)
    setformdatas({})
    form.resetFields()
    let currArea = area && area.find(item => item.id == parseInt(e.keyPath[1]))
    let currCommunity =
      currArea && currArea.buildings.find((item: any) => item.id == parseInt(e.keyPath[0]))
  }

  const fetch = useCallback(
    (pagination: any = { pageIndex: 1, pageCount: 10 }) => {
      setLoading(true)
      if (currCommunityId) {
        let data = {
          ...pagination,
          ...formdatas,
          projectId: developerId,
          buildingId: currCommunityId,
        }
        queryInConnect(data).then(res => {
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
      } else {
        setCurrCommunityId(res.regions[0].buildings[0].id)
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
            value: home.id,
            label: home.name,
          }
          houseArray.push(homeData)
        })
      })
    })

  const handleSearch = (values: any) => {
    let data = {
      startTime: values.timeRange ? moment(values.timeRange[0]).format('YYYY-MM-DD') : undefined,
      endTime: values.timeRange ? moment(values.timeRange[1]).format('YYYY-MM-DD') : undefined,
      mobile: values.phone ? values.phone : undefined,
      homeId: values.building ? values.building[2] : undefined,
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
          <Col span={9}>
            <FormItem label="时间" name="timeRange">
              <RangePicker />
            </FormItem>
          </Col>
          <Col span={6} style={{ paddingLeft: 10 }}>
            <FormItem label="手机号" name="phone">
              <Input />
            </FormItem>
          </Col>
          <Col span={8} style={{ paddingLeft: 10 }}>
            <FormItem label="房间号" name="building">
              <Cascader options={options} />
            </FormItem>
          </Col>
        </Row>
        <Row className={styles.headerTwo}>
          <Col span={6} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button onClick={handelReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }

  const handleTableChange = (query: any) => {
    fetch({
      pageIndex: query.current,
      pageCount: query.pageSize,
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (index: number) => index + 1,
    },
    {
      title: '报修时间',
      dataIndex: 'createdTime',
      render: (text: string) => (text ? text : '--'),
    },
    {
      title: '报修人姓名',
      dataIndex: 'nickName',
      render: (text: string) => (text ? text : '--'),
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      render: (text: string) => (text ? text : '--'),
    },
    {
      title: '房间',
      // dataIndex: 'blockHomeName',
      render: (record: any) => {
        return (
          <span>
            {record.buildingName}
            {record.blockHomeName}
          </span>
        )
      },
    },
    {
      title: '报修描述',
      dataIndex: 'repairReason',
      ellipsis: true,
      render: (text: string) => (text ? text : '--'),
    },
    {
      title: '图片',
      dataIndex: 'faultPhotos',
      render: (text: string) => {
        console.log(text, 'text')
        if (text && text != '') {
          const imageArray = text.split(',')
          return imageArray.map((img, index) => (
            <img key={index} src={img} width="50px" height="50px" />
          ))
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'publicTime',
      render: (text: string, record: any) => (
        <a href={`/property-management/record/${record.id}`} >
          查看详情
        </a>
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
        </div>
      </div>
    </>
  )
}
export default PropertyRepair
