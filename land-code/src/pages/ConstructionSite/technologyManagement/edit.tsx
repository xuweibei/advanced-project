import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Form, Input, message, Modal, Row, Space, Upload } from 'antd'
import styles from './index.less'
import ButtonUpload from '@/components/Uploader/ButtonUpload.js'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import StandardTable from '@/components/StandardTable'
import TableDeleteBtn from '@/components/Button/TableDeleteBtn'
import { PlusOutlined } from '@ant-design/icons'
import { iconList } from '@/utils/utils'
import {
  deleteTechnology,
  getTechnology,
  queryTechnologyContent,
  saveTechnology,
  saveTechnologyPoints,
  technologyList,
  technologyQuery,
  updateTechnology,
} from '@/services/api'
import ImagePicker from '@/components/ImagePicker'

const FormItem = Form.Item
const { TextArea } = Input
const { Search } = Input

export const ItemTypes = {
  PANEL: 'PANEL',
  POINT_ITEM: 'POINT_ITEM',
}

const AddModal = (props: any) => {
  const { data, id, handleSubmit, visible, onCancel } = props
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
  }, [data])
  const onSumbit = () => {
    form.validateFields().then(async (values: any) => {
      await handleSubmit(values)
      form.resetFields()
      message.success('提交成功！')
    })
  }

  return (
    <Modal
      title={data ? '修改子工艺' : '新增子工艺'}
      visible={visible}
      onCancel={() => onCancel()}
      onOk={() => onSumbit()}
    >
      <Form initialValues={data} form={form}>
        <FormItem label="子工艺名称" name="name" rules={[{ required: true, message: '姓名' }]}>
          <Input placeholder="输入建议"></Input>
        </FormItem>
        <FormItem label="描述" name="remarks" rules={[{ required: true, message: '姓名' }]}>
          <TextArea rows={3} placeholder="请输入描述"></TextArea>
        </FormItem>
      </Form>
    </Modal>
  )
}

const Edit = (props: any) => {
  const [visible, setVisible] = useState(false)
  const [defaultValue, setDefaultValue] = useState<any>()
  const [showIndex, setShowIndex] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [data, setData] = useState<any>()
  const [project, setProject] = useState<any>()
  const [icon, setIcon] = useState<any>()

  const companyId = props.match.params.companyId
  const id = props.match.params.technologyId

  const fetch = useCallback(
    (pagination: any = { page: 1, pageSize: 20 }) => {
      if (companyId && id) {
        let values = {
          companyId: companyId,
          technologyId: id,
          ...pagination,
        }
        technologyQuery(values).then(res => {
          setData(res.results)
        })
      }
      getTechnology(id).then(res => {
        setProject(res)
        iconList.map(item => {
          if (item.name == res.icon) {
            setIcon(item)
          }
        })
      })
    },
    [companyId]
  )
  useEffect(() => {
    fetch()
  }, [fetch])

  const handleSubmit = async (value: any) => {
    if (defaultValue) {
      let values = {
        ...value,
        id: defaultValue.id,
        pid: id,
      }
      await updateTechnology(values)
      setVisible(false)
      fetch()
    } else {
      let values = {
        ...value,
        pid: id,
      }
      await saveTechnology(values)
      setVisible(false)
      fetch()
    }
  }

  const handleCancel = () => {
    setDefaultValue(null)
    setVisible(false)
  }

  const UploadModal = () => {
    const [form] = Form.useForm()

    const okHandle = () => {
      form
        .validateFields()
        .then(async values => {
          let newValues = {
            id: id,
            ...values,
            icon: values.technologyIcon.name,
          }
          await updateTechnology(newValues)
          setUpdateModal(false)
          form.resetFields()
          fetch()
          message.success('修改成功！')
        })
        .catch(info => {
          console.log('Validate Failed:', info)
        })
    }
    return (
      <>
        <Modal
          visible={updateModal}
          title="修改名称，图标"
          onCancel={() => setUpdateModal(false)}
          onOk={() => okHandle()}
        >
          <Form
            form={form}
            initialValues={project}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
          >
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
              rules={[{ required: true, message: '请选择图标！' }]}
            >
              <ImagePicker value={icon && icon.url}></ImagePicker>
            </FormItem>
          </Form>
        </Modal>
      </>
    )
  }

  //实现拖拽点位
  const SetIndexModal = () => {
    const [points, setPoints] = useState<any>([])
    const roomDetail = {
      diagramUrl: require('../../../assets/images/gongyiBG.png'),
    }

    const Map = ({ img, onMove }: any) => {
      const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.POINT_ITEM,
        drop: onMove,
        collect: monitor => ({
          isOver: !!monitor.isOver(),
        }),
      })
      return (
        <img
          id="map"
          className={styles.settingPointImg}
          style={{ opacity: isOver ? 0.8 : 1 }}
          ref={drop}
          src={img}
        ></img>
      )
    }
    const onDoubleClick = useCallback(item => {
      if (points) {
        let pointiId = item.item.id
        setPoints((points: any[]) => points.filter(current => current.id !== pointiId))
      }
    }, [])

    const onMove = useCallback((item, monitor) => {
      let pointiId = item.item.id
      let pointName = item.item.name

      let object = document.getElementById('map')
      let rectObject = object && object.getBoundingClientRect()

      let deviceToMapX = rectObject && rectObject.left
      let deviceToMapY = rectObject && rectObject.top

      let imgHeight = rectObject && rectObject.height
      let imgWidth = rectObject && rectObject.width

      let x = monitor.getClientOffset().x
      let y = monitor.getClientOffset().y

      let finalX = deviceToMapX && imgWidth && (x - deviceToMapX) / imgWidth
      let finalY = deviceToMapY && imgHeight && (y - deviceToMapY) / imgHeight

      let newPoint = {
        id: pointiId,
        technologyContentId: pointiId,
        name: pointName,
        x: finalX && finalX.toFixed(3),
        y: finalY && finalY.toFixed(3),
      }
      if (points) {
        setPoints((points: any[]) => [
          ...points.filter(current => current.id !== newPoint.id),
          newPoint,
        ])
      }
    }, [])

    //可拖拽点位
    const DraggableComponent = ({ item, index, canDrag, positionId }: any) => {
      const [{ isDragging }, drag] = useDrag({
        item: { item, index, positionId, type: ItemTypes.POINT_ITEM },
        collect: monitor => ({
          isDragging: !!monitor.isDragging(),
        }),
        canDrag,
      })

      return (
        <div
          style={{ opacity: isDragging || !canDrag ? 0.5 : 1 }}
          ref={drag}
          key={item.id}
          className={styles.robotPointItem}
        >
          {item.name}
        </div>
      )
    }
    //重置点位
    const onReset = () => {
      setPoints([])
    }

    const okHandle = async () => {
      setPoints(points)
      let pointsList: any[] = []
      points.map((item: any) => {
        let data = {
          ...item,
          technologyId: id,
          buildingId: companyId,
        }
        pointsList.push(data)
      })
      await saveTechnologyPoints(id, pointsList)
      fetch()
      setShowIndex(false)
    }

    return (
      <Modal
        title="配置子工艺展示位置"
        visible={showIndex}
        onCancel={() => setShowIndex(false)}
        width={1400}
        footer={
          <>
            <Button onClick={() => onReset()}>重置</Button>
            <Button onClick={() => setShowIndex(false)}>取消</Button>
            <Button type="primary" onClick={okHandle}>
              确定
            </Button>
          </>
        }
      >
        <div className={styles.setPointContainer}>
          {roomDetail.diagramUrl && (
            <DndProvider backend={HTML5Backend}>
              <div className={styles.pointLocationSetting}>
                <div className={styles.roomPointContainer}>
                  {data &&
                    data.map((item: any, index: any) => (
                      <DraggableComponent
                        item={item}
                        key={item.id}
                        index={index}
                        onMove={onMove}
                        canDrag={points && !points.some((point: any) => point.id === item.id)}
                      />
                    ))}
                </div>
                <div>（拖动子工艺图标可在画面中间进行标注，标注后的样式将显示在首页展示端）</div>
                <div className={styles.setRoomImg}>
                  <div style={{ position: 'relative' }}>
                    <div className={styles.leftArea}>这里是数据展示区</div>
                    <div className={styles.rightArea}>这里是数据展示区</div>
                    <Map
                      img={
                        project && project.picture
                          ? project.picture
                          : require('../../../assets/images/gongyiBG.png')
                      }
                      style={{ width: 500 }}
                      onMove={onMove}
                    ></Map>
                    {points &&
                      points.map((item: any, index: any) => (
                        <div
                          key={index}
                          className={styles.roomPoint}
                          onDoubleClick={() => onDoubleClick({ item })}
                          style={{ left: item.x * 100 + '%', top: item.y * 100 + '%' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={styles.pointMark}></div>
                            <div className={styles.pointName}> {item.name.substring(0, 5)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </DndProvider>
          )}
        </div>
      </Modal>
    )
  }

  const Render = () => {
    return (
      <>
        <h2>星河湾半岛第五期</h2>
        <Card>
          <Row>
            <Col>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  style={{ width: '20px', height: '20px', marginRight: '10px' }}
                  src={icon && icon.url}
                />
                <h2 style={{ margin: '0' }}>{project && project.name}</h2>
              </div>
            </Col>
            <Col span={2} offset={1}>
              <Button type="primary" onClick={() => setUpdateModal(true)}>
                修改图片、名称
              </Button>
            </Col>
          </Row>
        </Card>
        <br />
      </>
    )
  }
  const ChildTechnology = () => {
    const [select, setSelect] = useState<any>()

    const changeItem = (data: any) => {
      setDefaultValue(data)
      setVisible(true)
    }
    const delTechnology = async (data: any) => {
      await deleteTechnology(data.id)
      message.success('删除成功！')
      fetch()
    }

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render: (text: any) => (text ? text : '--'),
      },
      {
        title: '描述',
        dataIndex: 'remarks',
        render: (text: any) => (text ? text : '--'),
      },
      {
        title: '工艺内容',
        dataIndex: 'number',
        render: (text: any) => (text ? text : '--'),
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text: any, record: any) => (
          <>
            <TableDeleteBtn
              title="你确定要删除子工艺及其包含内容吗？"
              onDelete={() => delTechnology(record)}
            />
            <Divider type="vertical" />
            <a onClick={() => changeItem(record)}>编辑</a>
          </>
        ),
      },
    ]
    const addChild = () => {
      setDefaultValue(null)
      setVisible(true)
    }
    const handleChange = (query: any) => {
      fetch({
        page: query.current,
        page_size: query.pageSize,
      })
    }
    const technologyOnSearch = () => {
      technologyList({ value: select, technologyId: id }).then(res => {
        console.log(select,'resss')
        console.log(res,'resss')
        setData(res)
      })
    }
    return (
      <>
        <Card>
          <h2>子工艺管理</h2>
          <Row>
            <Col span={2}>
              <Button onClick={() => addChild()} type="primary">
                新增子工艺
              </Button>
            </Col>
            <Col span={6} offset={14}>
              <Input
                placeholder="请输入"
                style={{ height: '100%' }}
                onChange={v => {
                  setSelect(v.target.value)
                }}
              ></Input>
            </Col>
            <Col span={2}>
              <Button onClick={technologyOnSearch} type="primary">
                搜索
              </Button>
            </Col>
          </Row>
          <br />
          <StandardTable
            columns={columns}
            showPagination={true}
            data={{ list: data }}
            onChange={handleChange}
          />
        </Card>
        <br />
      </>
    )
  }
  const Dispose = () => {
    const changeImg = async (data: any) => {
      let value = {
        id: id,
        picture: data+'',
      }
      await updateTechnology(value)
      fetch()
    }
    return (
      <Card>
        <h2>首页展示配置</h2>
        <Row>
          <ButtonUpload onChange={(v: any) => changeImg(v)}>
            {project && project.picture ? '重新上传' : '导入图片'}
          </ButtonUpload>
        </Row>
        <br />
        <Button type="primary" onClick={() => setShowIndex(true)}>
          配置内容位置
        </Button>
        <br />
        <h2>预览：</h2>
        <Row>
          <Col span={24}>
            <div className={styles.leftArea}>这里是数据展示区</div>
            <div className={styles.rightArea}>这里是数据展示区</div>
            {project &&
              project.pointPositions &&
              project.pointPositions.map((item: any, index: any) => (
                <div
                  key={index}
                  className={styles.roomPoint}
                  style={{ left: item.x * 100 + '%', top: item.y * 100 + '%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={styles.pointMark}></div>
                    <div className={styles.pointName}> {item.name.substring(0, 5)}</div>
                  </div>
                </div>
              ))}

            <img
              style={{
                width: '100%',
              }}
              src={
                project && project.picture
                  ? project.picture
                  : require('../../../assets/images/gongyiBG.png')
              }
            />
          </Col>
        </Row>
      </Card>
    )
  }

  return (
    <>
      <UploadModal />
      <SetIndexModal />
      <AddModal
        visible={visible}
        id={id}
        onCancel={handleCancel}
        data={defaultValue}
        handleSubmit={handleSubmit}
      />
      <Render />
      <ChildTechnology />
      <Dispose />
    </>
  )
}
export default Edit
