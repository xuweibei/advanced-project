import React, { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, message, Modal, Row, } from 'antd'
import styles from './index.less'
import ButtonUpload from '@/components/Uploader/ButtonUpload.js'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { getLightTechnology, getTechnology, saveTechnologyPoints, technologyContentList, updateTechnology } from '@/services/api'

export const ItemTypes = {
  PANEL: 'PANEL',
  POINT_ITEM: 'POINT_ITEM',
}

const HightLightEdit = () => {
  const [data, setData] = useState<any>()
  const [pagePoints, setPagePoints] = useState<any>()
  const [showIndex, setShowIndex] = useState(false)
  const [lightTechnology, setLightTechnology] = useState<any>()

  console.log(data,'lightTechnology')

  const fetch = useCallback(()=>{
    let data = {
      technologyId:-1,
      companyId:1,
    }
    technologyContentList(data).then(res=>{
      setPagePoints(res)
    })
    getLightTechnology(1).then(res=>{
        setLightTechnology(res)
    })
    getTechnology(76).then(res=>{
      setData(res.pointPositions)
    })

  },[])

  useEffect(() => {
    fetch()
  }, [fetch])

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
      let pointiId = item.item.id
      setPoints((points: any[]) => points.filter(current => current.id !== pointiId))
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
        technologyContentId:pointiId,
        name: pointName,
        x: finalX && finalX.toFixed(3),
        y: finalY && finalY.toFixed(3),
      }
      setPoints((points: any[]) => [
        ...points.filter(current => current.id !== newPoint.id),
        newPoint,
      ])
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
    //修改点位
    const submitPoint = async () => {
      setPoints(points)
      let pointsList: any[] = []
      points.map((item: any) => {
        let data = {
          ...item,
          technologyId: lightTechnology.id,
          buildingId: 1,
        }
        pointsList.push(data)
      })
      await saveTechnologyPoints(lightTechnology.id, pointsList)
      fetch()
      setShowIndex(false)
    }
    console.log(points,'points')
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
            <Button type="primary" onClick={() => submitPoint()}>
              确定
            </Button>
          </>
        }
        onOk={() => submitPoint()}
      >
        <div className={styles.setPointContainer}>
          {roomDetail.diagramUrl && (
            <DndProvider backend={HTML5Backend}>
              <div className={styles.pointLocationSetting}>
                <div className={styles.roomPointContainer}>
                  {pagePoints &&
                    pagePoints.map((item:any, index:any) => (
                      <DraggableComponent
                        item={item}
                        key={item.id}
                        index={index}
                        onMove={onMove}
                        canDrag={!points.some((point: { id: number }) => point.id === item.id)}
                      />
                    ))}
                </div>
                <div>（拖动子工艺图标可在画面中间进行标注，标注后的样式将显示在首页展示端）</div>
                <div className={styles.setRoomImg}>
                  <div style={{ position: 'relative' }}>
                    <Map img={
                        lightTechnology && lightTechnology.picture
                          ? lightTechnology.picture
                          : require('../../../assets/images/gongyiBG.png')
                      } style={{ width: 500 }} onMove={onMove}></Map>
                    {points&&
                      points.map((item:any, index:any) => (
                        <div
                          key={index}
                          className={styles.roomPoint}
                          onDoubleClick={() => onDoubleClick({ item })}
                          style={{ left: item.x * 100 + '%', top: item.y * 100 + '%' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div className={styles.pointName}> {item.name.substring(0, 5)}</div>
                            <div className={styles.highlightContent}>

                            </div>
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              style={{ width: '20px', height: '20px', marginRight: '20px' }}
              src={require('../../../assets/img/icon4.png')}
            />
            <h2 style={{ margin: '0' }}>亮点工艺</h2>
          </div>
        </Card>
        <br />
      </>
    )
  }

  const Dispose = () => {
    const changeImg = async (data: any) => {
      let value = {
        id:lightTechnology.id,
        picture:data+'',
      }
      await updateTechnology(value)
      message.success('上传成功')
      fetch()
    }
    return (
      <Card>
        <h2>首页展示配置</h2>
        <Row>
        <ButtonUpload onChange={(v: any) => changeImg(v)}>
            {lightTechnology&&lightTechnology.picture ? '重新上传':'导入图片'  }
          </ButtonUpload>
        </Row>
        <br />
        <Button type="primary" onClick={() => setShowIndex(true)}>
          配置内容位置
        </Button>
        <br />
        <h2>预览：</h2>
        <Row>
          <Col span={24} style={{ position: 'relative' }}>
            {data&&!!data.length &&
              data.map((item: any, index: any) => (
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
              src={lightTechnology&&lightTechnology.picture?lightTechnology.picture:require('../../../assets/images/gongyiBG.png')}
            />
          </Col>
        </Row>
      </Card>
    )
  }

  return (
    <>
      <SetIndexModal />
      <Render />
      <Dispose />
    </>
  )
}
export default HightLightEdit
