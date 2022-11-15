import TechnologyCard from '@/components/technologyCard/technologyCard'
import { Select, Row, Col, Input, Button, Modal, Card, Radio, Form, Upload, message } from 'antd'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { ConnectProps, ConsoleModelState, Dispatch } from 'umi'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import { iconList } from '@/utils/utils'

import img1 from '../../../assets/images/gongyiBG.png'
import lightIcon from '../../../assets/img/icon4.png'
import {
  deleteTechnology,
  getTechnology,
  queryTechnologyContent,
  saveTechnology,
  technologyList,
} from '@/services/api'
import ImagePicker from '@/components/ImagePicker'
interface ConsoleProps extends ConnectProps {
  dispatch: Dispatch
  consoleDatas: ConsoleModelState
  loading: boolean
}
const { Option } = Select
const FormItem = Form.Item

const building = [
  {
    index: 1,
    name: '星河湾',
  },
  {
    index: 2,
    name: '新柏石',
  },
  {
    index: 3,
    name: '世贸大厦',
  },
  {
    index: 4,
    name: '东方明珠',
  },
  {
    index: 5,
    name: '新天地',
  },
  {
    index: 6,
    name: '陆家嘴中心大楼',
  },
]

const TechnologyManagement: FC<ConsoleProps> = props => {
  const [visible, setVisible] = useState(false)
  const [companyId, setCompany] = useState<any>(1)
  const [data, setData] = useState<any>()
  const [lighhtNumber, setLighhtNumber] = useState<any>(0)
  const [lightTechnology, setLightTechnology] = useState<any>()

  const lightTechnologyId = 76
  const fetch = useCallback(() => {
    if (companyId) {
      let values = {
        companyId: companyId,
        technologyId: 0,
      }
      technologyList(values).then(res => {
        setData(res)
      })
      let value = {
        companyId: companyId,
        technologyId: -1,
      }
      queryTechnologyContent(value).then(res => {
        setLighhtNumber(res.count)
      })
      // let data ={
      //   companyId:companyId,
      //   technologyId:-1,
      // }
      getTechnology(lightTechnologyId).then(res => {
        setLightTechnology(res)
      })
    }
  }, [companyId])

  useEffect(() => {
    fetch()
  }, [fetch])

  const UploadModal = () => {
    const [create, setCreate] = useState(false)
    const [technologyIcon, setTechnologyIcon] = useState<any>()
    const [form] = Form.useForm()

    const UploadButton = () => {
      return (
        <div className={styles.uploadButton}>
          <PlusOutlined />
        </div>
      )
    }
    const iconSelect = (item: any) => {
      setTechnologyIcon(item)
      setCreate(false)
    }
    const SelectIcon = () => {
      return (
        <Modal visible={create} title="选择图标" width={800} onCancel={() => setCreate(false)}>
          <Row>
            {iconList &&
              iconList.map((item: any) => {
                return (
                  <Col span={6} style={{ marginBottom: '20px' }} onClick={() => iconSelect(item)}>
                    <img src={item.url} />
                  </Col>
                )
              })}
          </Row>
        </Modal>
      )
    }
    const okHandle = () => {
      form
        .validateFields()
        .then(async values => {
          console.log(values,'values')
          let newValues = {
            ...values,
            icon:values.technologyIcon.name,
            pid: 0,
          }
          await saveTechnology(newValues)
          setVisible(false)
          form.resetFields()
          fetch()
          message.success('添加成功！')
        })
        .catch(info => {
          console.log('Validate Failed:', info)
        })
    }
    return (
      <>
        <SelectIcon />
        <Modal
          visible={visible}
          title="新建工艺大类"
          onCancel={() => setVisible(false)}
          onOk={() => okHandle()}
        >
          <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
            <FormItem
              label="名称"
              name="name"
              rules={[{ required: true, message: '请输入工艺名称！' }]}
            >
              <Input></Input>
            </FormItem>

            <FormItem
              label="图标"
              name="technologyIcon"
              rules={[{ required: true, message: '请选择图片' }]}
            >
              <ImagePicker></ImagePicker>
            </FormItem>
          </Form>
        </Modal>
      </>
    )
  }

  const RenderForm = () => {
    return (
      <Card>
        <Row>
          <Select style={{ width: '400px' }} defaultValue="星河湾五期" disabled>
            {/* {building.map((item: any, index: any) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              )
            })} */}
          </Select>
        </Row>
        <Button type="primary" style={{ marginTop: '30px' }} onClick={() => setVisible(true)}>
          新增工艺大类
        </Button>
      </Card>
    )
  }
  const delItem = async (id: any) => {
    await deleteTechnology(id)
    message.success('删除成功')
    fetch()
  }
  const TechnologyDetail = () => {
    return (
      <Row gutter={8} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Col span={6}>
          <TechnologyCard
            companyId={companyId}
            img={lightTechnology && lightTechnology.picture ? lightTechnology.picture : img1}
            title="亮点工艺"
            id={-1}
            number={lighhtNumber}
            icon={lightIcon}
            isLight={true}
          ></TechnologyCard>
        </Col>
        {data &&
          data.map((item: any) => {
            return (
              <Col span={6}>
                <TechnologyCard
                  companyId={companyId}
                  item={item}
                  id={item.id}
                  img={item.picture ? item.picture : img1}
                  title={item.name}
                  number={item.subTechnologyCount ? item.subTechnologyCount : 0}
                  childNumber={item.technologyContentCount ? item.technologyContentCount : 0}
                  icon={item.icon}
                  isLight={false}
                  delItem={delItem}
                ></TechnologyCard>
              </Col>
            )
          })}
      </Row>
    )
  }

  return (
    <>
      <UploadModal />
      <RenderForm />
      <TechnologyDetail />
    </>
  )
}

export default TechnologyManagement
