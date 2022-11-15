import { Button, Radio, Select, DatePicker, List, Carousel } from 'antd'
import Slider from '@ant-design/react-slick'
import moment from 'moment'
import React, { FC, useEffect, useState } from 'react'
import { connect, ConnectProps, ConsoleModelState, Dispatch, Link, useModel } from 'umi'
import {
  getHistoryBackPhotos,
  getProjectManagerList,
  getBuildNode,
  getWorkList,
  technologyList,
  getArchivesTypeList,
  getDigitalRecordList,
  getTechnology,
  technologyContentList,
  getLightTechnology,
  getTechnologyContent,
  getConstructionNode,
} from '@/services/api'
import TowLineChart from '@/components/eCharts/towLineChart'
import NewRadio from '@/components/Radio'
import EZUIPlayer from '@/components/YSPlayer/EZUIPlayer'
import rectangle from '@/assets/images/rectangle.png'
import noise from '@/assets/images/noise.png'
import wind from '@/assets/images/wind.png'
import pm25 from '@/assets/images/pm25.png'
import pm10 from '@/assets/images/pm10.png'
import real_process from '@/assets/images/real_process.png'
import plan_process from '@/assets/images/plan_process.png'
import styles from '../Dashboard/index.less'
import Modal from '../../../components/Modal'
import { SampleNextArrow, SamplePrevArrow } from '../Dashboard/sliderArrow'
import { SimpleNextArrow, SimplePrevArrow } from './simpleSliderArrow'
import { iconList } from '@/utils/utils'
import img1 from '../../../assets/images/containerBG.png'
import checkLiveStreamingIcon from '../../../assets/images/checkLiveStreamingIcon.png'
import liveStreamingIcon from '../../../assets/images/liveStreamingIcon.png'

const buildingList = [
  {
    index: 1,
    name: '星河湾五期',
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
interface ConsoleProps extends ConnectProps {
  dispatch: Dispatch
  consoleDatas: ConsoleModelState
  loading: boolean
}
const formatTime = (date:any)=>{
  let year = date.getFullYear()
  let mouth = date.getMonth()+1
  let day = date.getDate()
  let today = date.getDay()
  let hours = date.getHours()
  let minutes = date.getMinutes()<10?'0'+ date.getMinutes():date.getMinutes()
  let s = date.getSeconds()<10?'0'+ date.getSeconds():date.getSeconds()
  var week = ''
  if (today == 0) {
    week = '星期日'
  } else if (today == 1) {
    week = '星期一'
  } else if (today == 2) {
    week = '星期二'
  } else if (today == 3) {
    week = '星期三'
  } else if (today == 4) {
    week = '星期四'
  } else if (today == 5) {
    week = '星期五'
  } else if (today == 6) {
    week = '星期六'
  }
  let nowTime = year+'-'+mouth+'-'+day+' '+week+' '+hours+':'+minutes+':'+s
  return nowTime
}
const getTimeNow = ()=>{
  const [date, setDate] = useState<any>(formatTime(new Date()))
  
  useEffect(() => {
    function tick() {
      let d = new Date()
      setDate(formatTime(d))
    }
    const timerID = setInterval(tick, 1000)

    return function clearTick() {
      clearInterval(timerID)
    }
  },[date])
  return date
}

const Dashboard: FC<ConsoleProps> = props => {
  const [projectName, setProjectName] = useState(buildingList[0].name)
  const [showGongyi, setShowGongyi] = useState(false)
  const [showCraftModal, setShowCraftModal] = useState(false)
  const [historyBackModalVisible, setHistoryBackModalVisible] = useState(false)
  const [showImportantNodeModal, setShowImportantNodeModal] = useState(false)
  const [singleDetail, setSingleDetail] = useState<any>()
  const [selectBuilding, setSelectBuilding] = useState(false)
  const [showDigitalFiles, setShowDigitalFiles] = useState(false)
  const [openWorkDetail, setOpenWorkDetail] = useState(false)
  const [workItem, setWorkItem] = useState<any>()
  const [working, setWorking] = useState<any>()
  const [showLight, setShowLight] = useState(false)
  const [showLightModal, setShowLightModal] = useState(false)
  const [lightModal, setLightModal] = useState<any>()
  const [numberTitle, setNumberTitle] = useState<any>()
  const [technologyImg, setTechnologyImg] = useState<any>()

  const [pageShow, setPageShow] = useState<any>(1)
  const [ShowMachine, setShowMachine] = useState<boolean>(false)
  const [machine, setMachine] = useState<any>(1)
  const [historyBackMachine, setHistoryBackMachine] = useState<any>(1)
  const [histortBackData, setHistortBackData] = useState<any>()
  const [historyBackList, setHistoryBackList] = useState<any>([]) //历史回溯数据
  const [constructionNode, setConstructionNode] = useState<any>([]) //重要节点数据
  const [openGenerateVideo, setOpenGenerateVideo] = useState<boolean>(false)
  const [generateVideoImg, setGenerateVideoImg] = useState<any>()
  const [projectModalVisiable, setProjectModalVisiable] = useState<boolean>(false)
  const [projectManagerList, setProjectManagerList] = useState<any>([])
  const [buildProcessModalVisiable, setBuildProcessModalVisiable] = useState<boolean>(false)
  const [planTime, setPlanTime] = useState<any>([])
  const [realTime, setRealTime] = useState<any>([])
  const [technology, setTechnology] = useState<any>([])
  const [archivesTab, setArchivesTab] = useState<any>([])
  const [archivesList, setArchivesList] = useState<any>([])
  const [technologyPoints, setTechnologyPoints] = useState<any>([])
  const [openTechnologyDetail, setOpenTechnologyDetail] = useState(false)
  const [craftList, setCraftList] = useState<any>([])
  const [openHistoryDetail, setOpenHistoryDetail] = useState<any>(false)
  const [openFilesDetail, setOpenFilesDetail] = useState<any>(false)
  const [picture, setPicture] = useState<any>()
  const [blueprint, setBlueprint] = useState<any>()
  const [file, setFile] = useState<any>()
  const [video, setVideo] = useState<any>()
  const [archivesType, setArchivesType] = useState<any>()
  window.onresize = function() {
    adaptation()
  }
  const { initialState } = useModel('@@initialState')
  const { currentUser } = initialState || {}

  const premission =
    currentUser &&
    currentUser.permissions.find(
      permission => permission.isLeafNode && permission.path !== '/dashboard/console'
    )

  // rem适配
  const adaptation = () => {
    const docEl = document.documentElement
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = clientWidth / 10 + 'px'
  }

  useEffect(() => {
    adaptation()
  }, [])

  //获取项目数据
  useEffect(() => {
    let data = {
      buildingId: 1,
      page: 1,
      pageSize: 100,
    }
    getProjectManagerList(data).then(res => {
      setProjectManagerList(res.results)
    })
  }, [])

  //获取项目进度数据
  useEffect(() => {
    let data = {
      buildingId: undefined,
      constructionManageId: 1, //项目id
    }
    getBuildNode(data)
      .then(res => {
        let plantime: any[] = []
        let realtime: any[] = []

        res.forEach((item: any) => {
          plantime.push({ date: item.name, value: item.planCompletionTime })
          realtime.push({ date: item.name, value: item.actualCompletionTime })
        })

        setPlanTime(plantime)
        setRealTime(realtime)
      })
      .catch(e => {
        console.log('获取失败', e)
      })
  }, [])

  //获取历史回溯数据
  useEffect(() => {
    //TODO机位变化历史回溯 抓拍图片/视频列表变化
    // getHistoryBackList(historyBackMachine).then(res=>{
    //   setHistoryBackList(res)
    // })
    let time = moment()
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
    let data = histortBackData ? histortBackData : time
    let arg = {
      buildingId: 1,
      deviceSerial: 'E73143301',
      channelNo: historyBackMachine.toString(),
      beginDate: data,
      endDate: data,
    }
    getHistoryBackPhotos(arg).then(res => {
      setHistoryBackList(res)
    })
  }, [historyBackMachine, histortBackData])

  //获取重要节点数据
  useEffect(() => {
    let arg = {
      buildingId: 1,
      deviceSerial: 'E73143301',
      constructionManageId: undefined,
    }
    getConstructionNode(arg).then(res => {
      setConstructionNode(res)
    })
  }, [])

  const setting = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
  }

  //获取重要工作信息
  useEffect(() => {
    let data = {
      buildingId: 1,
      page: 1,
      pageSize: 10,
    }
    getWorkList(data).then(res => {
      setWorkItem(res.results)
    })
  }, [])

  //获取工艺内容
  useEffect(() => {
    let data = {
      companyId: 1,
      technologyId: 0,
    }
    technologyList(data).then(res => {
      let technologyList: any[] = []
      res.map((items: any) => {
        const icon = iconList.find((item: any) => {
          return item.name == items.icon
        })
        let data = {
          ...items,
          icon: icon && icon.url,
        }
        technologyList.push(data)
      })

      setTechnology(technologyList)
    })
  }, [])

  //获取档案类型信息
  useEffect(() => {
    let data = {
      type: 'picture',
    }
    getDigitalRecordList(data).then(res => {
      let item = {
        ...res,
        title: '图片',
        type: 'picture',
      }
      setPicture(item)
    })
    getDigitalRecordList({ type: 'video' }).then(res => {
      let item = {
        ...res,
        title: '视频',
        type: 'video',
      }
      setVideo(item)
    })
    getDigitalRecordList({ type: 'blueprint' }).then(res => {
      let item = {
        ...res,
        title: '图纸',
        type: 'blueprint',
      }
      setBlueprint(item)
    })
    getDigitalRecordList({ type: 'file' }).then(res => {
      setFile(getPDFFiles(res))
    })
  }, [])

  const getPDFFiles = (data: any) => {
    let newFileList: any = []
    data.results.map((item: any) => {
      if (item.url.substring(item.url.length - 3) == 'pdf') {
        newFileList.push(item)
      }
    })
    let item = {
      results: newFileList,
      count: newFileList.length,
      title: '文件',
      type: 'file',
    }
    return item
  }

  const lightSetting = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const machineOptions = [
    { label: '机位1', value: 1 },
    { label: '机位2', value: 2 },
    { label: '机位3', value: 3 },
  ]
  const pageOptions = [
    {
      label: '现场直播',
      value: 1,
      checkicon: <img src={checkLiveStreamingIcon} className={styles.liveStreamingIcon} />,
      icon: <img src={liveStreamingIcon} className={styles.liveStreamingIcon} />,
    },
    { label: '历史回溯', value: 2 },
    { label: '重要节点', value: 3 },
  ]

  const pageOnChange = (value: any) => {
    setPageShow(value)
    if (value == 1) {
      setShowMachine(!ShowMachine)
      setShowGongyi(false)
      setHistoryBackModalVisible(false)
      setShowImportantNodeModal(false)
    } else if (value == 2) {
      setShowMachine(false)
      setHistoryBackModalVisible(true)
      setShowImportantNodeModal(false)
    } else if (value == 3) {
      setShowMachine(false)
      setHistoryBackModalVisible(false)
      setShowImportantNodeModal(true)
    }
  }


  const startVideo = () => {
    alert('暂无视频资源')
  }

  const project = (
    <div className={styles.project} onClick={() => setProjectModalVisiable(!projectModalVisiable)}>
      <div className={styles.projectTitleLine}>
        <div className={styles.projectTitleName}>
          <img src={rectangle} className={styles.projectTitleRectangle}></img>
          <div className={styles.projectTitle}>项目信息</div>
        </div>
        {/* <div className={styles.projectTitlePeople}>现场负责人：某某某</div> */}
      </div>
      <div className={styles.projectContentBox}>
        <div style={{width:'50%',display:'flex',flexDirection:'column',alignItems:'center'}}>
          {projectManagerList && projectManagerList[0] && (
            <div className={styles.projectArea}>
              <div className={styles.projectAreaTitle}>{projectManagerList[0].name}</div>
              <div className={styles.projectAreaNumber}>{projectManagerList[0].content}</div>
            </div>
          )}
          {projectManagerList && projectManagerList[1] && (
            <div className={styles.projectArea}>
              <div className={styles.projectAreaTitle}>{projectManagerList[1].name}</div>
              <div className={styles.projectProcessNumber}>{projectManagerList[1].content}</div>
            </div>
          )}
        </div>
        <div style={{width:'50%',display:'flex',flexDirection:'column',alignItems:'center'}}>
          {projectManagerList && projectManagerList[2] && (
            <div className={styles.projectArea}>
              <div className={styles.projectAreaTitle}>{projectManagerList[2].name}</div>
              <div className={styles.projectFloorNumber}>{projectManagerList[2].content}</div>
            </div>
          )}
          {projectManagerList && projectManagerList[3] && (
            <div className={styles.projectArea}>
              <div className={styles.projectAreaTitle}>{projectManagerList[3].name}</div>
              <div className={styles.projectLeader}>{projectManagerList[3].content}</div>
            </div>
          )}
        </div>
      </div>

      {/* <div className={styles.projectSchedule}>目前进度</div>
      <div className={styles.schedule}>
        <ScheduleBar percent="0.6" className={styles.scheduleBar} />
      </div> */}
    </div>
  )

  const environment = (
    <div className={styles.environment}>
      <div className={styles.projectTitleLine}>
        <div className={styles.projectTitleName}>
          <img src={rectangle} className={styles.projectTitleRectangle}></img>
          <div className={styles.projectTitle}>环境数据</div>
        </div>
        {/* <div className={styles.projectTitle}>环境数据</div> */}
      </div>
      <div className={styles.envItemBox}>
        <div className={styles.envItem}>
          <img src={noise} className={styles.envIcon}></img>
          <div className={styles.envText}>温度：29˚C</div>
        </div>
        <div className={styles.envItem}>
          <img src={wind} className={styles.envIcon}></img>
          <div className={styles.envText}>湿度：72.3%</div>
        </div>
      </div>
      <div className={styles.envItemBox}>
        <div className={styles.envItem}>
          <img src={pm25} className={styles.envIcon}></img>
          <div className={styles.envText}>PM2.5:149</div>
        </div>
        <div className={styles.envItem}>
          <img src={pm10} className={styles.envIcon}></img>
          <div className={styles.envText}>PM10:249</div>
        </div>
      </div>
    </div>
  )

  const buildProcess = (
    <div
      className={styles.buildProcess}
      onClick={() => setBuildProcessModalVisiable(!buildProcessModalVisiable)}
    >
      <div className={styles.processTitleLine}>
        <div className={styles.projectTitleName}>
          <img src={rectangle} className={styles.projectTitleRectangle}></img>
          <div className={styles.projectTitle}>建设进度</div>
        </div>
        {/* <div className={styles.projectTitle}>建设进度</div> */}
        <div className={styles.projectTitleTextBox}>
          <div className={styles.projectTitleTextBox}>
            <img src={real_process} className={styles.processIcon}></img>
            <div className={styles.projectTitleText}>实际日期</div>
          </div>
          <div className={styles.projectTitleTextBox}>
            <img src={plan_process} className={styles.processIcon}></img>
            <div className={styles.projectTitleText}>计划日期</div>
          </div>
        </div>
      </div>
      <div className={styles.processLineChart}>
        <TowLineChart
          type="line"
          data1={realTime}
          data2={planTime}
          className={styles.chartContent}
        />
      </div>
    </div>
  )

  //单个内容显示Modal
  const showDetail = (data: any) => {
    setSingleDetail(data)
    setOpenTechnologyDetail(true)
    setShowCraftModal(false)
  }
  const showHistoryDetail = (data: any) => {
    setSingleDetail(data)
    setOpenHistoryDetail(true)
    setHistoryBackModalVisible(false)
  }
  const showFilesDetail = (data: any) => {
    setSingleDetail(data)
    setOpenFilesDetail(true)
    setShowDigitalFiles(false)
  }
  //显示工艺背景图
  const showCraftBG = async (data: any) => {
    setTechnologyImg(data.picture)
    let finalList: any[] = []
    const technology = await getTechnology(data.id).then(res => {
      let newList: any[] = []
      res.pointPositions &&
        res.pointPositions.map((item: any) => {
          let data = {
            ...item,
            left: item.x * 100 + '%',
            top: item.y * 100 + '%',
          }
          newList.push(data)
        })
      return newList
    })
    technology.map(item => {
      getTechnologyContent(item.technologyContentId).then(res => {
        let data = {
          ...res,
          ...item,
        }
        finalList.push(data)
      })
    })
    setShowGongyi(true)
    setTechnologyPoints(finalList)
  }

  //关闭工艺展示窗口
  const closeModal = () => {
    setShowCraftModal(false)
  }
  const closeHistoryBackModal = () => {
    setHistoryBackModalVisible(false)
  }
  const closeImportantNodeModal = () => {
    setShowImportantNodeModal(false)
  }
  //动态更改楼盘项目
  const changeBuilding = (data: any) => {
    setProjectName(data.name)
    setSelectBuilding(false)
  }

  //显示数字档案弹窗
  const showDigitalFile = (data: any) => {
    let values = {
      type: data.type,
    }
    getArchivesTypeList(values).then(res => {
      let allItem = {
        label: '全部',
        value: null,
      }
      let list: { label: any; value: any }[] = []
      list.push(allItem)
      res.map((item: any) => {
        let data = {
          label: item.name,
          value: item.id,
        }
        list.push(data)
      })
      setArchivesTab(list)
    })
    setArchivesList(data)
    setArchivesType(data)
    setNumberTitle(data.title)
    setShowDigitalFiles(true)
  }

  //选择数字档案弹窗里的类型
  const changeDigital = (data: any) => {
    if (data) {
      let value = {
        type: archivesList && archivesList.type,
        archivesTypeIds: data,
      }
      getDigitalRecordList(value).then(res => {
        if (archivesType && archivesType.type == 'file') {
          setArchivesList(getPDFFiles(res))
        } else {
          setArchivesList(res)
        }
      })
    } else {
      let value = {
        type: archivesType && archivesType.type && archivesType.type,
      }
      getDigitalRecordList(value).then(res => {
        if (archivesType && archivesType.type == 'file') {
          setArchivesList(getPDFFiles(res))
        } else {
          setArchivesList(res)
        }
      })
    }
  }

  let id: any = null

  const start = function(data: any) {
    let deg = 0
    let time = new Date().getTime()
    setGenerateVideoImg(data[deg].ossPicUrl)
    requestAnimationFrame(function change() {
      let current = new Date().getTime()
      if (deg < data.length - 1) {
        if (current - time >= 500) {
          time = current
          setGenerateVideoImg(data[++deg].ossPicUrl)
        }

        id = requestAnimationFrame(change)
      } else stop
    })
  }
  const stop = function() {
    cancelAnimationFrame(id)
  }
  const histortBackDataOnChange = (date: any, dateString: any) => {
    setHistortBackData(dateString)
  }
  const openWorkModal = (data: any) => {
    setOpenWorkDetail(true)
    setWorking(data)
  }
  const openLightModal = (data: any) => {
    setShowLightModal(true)
    let list = data.picture.split(',')
    let newData = {
      ...data,
      url: list,
    }
    setLightModal(newData)
  }

  //显示亮点工艺
  const openLightTechnology = async () => {
    getLightTechnology(1).then(res => {
      setTechnologyImg(res.picture)
    })
    setShowLight(true)
    const lightPoint = await getTechnology(76).then(res => {
      let newList: any[] = []
      res.pointPositions &&
        res.pointPositions.map((item: any) => {
          let data = {
            ...item,
            left: item.x * 100 + '%',
            top: item.y * 100 + '%',
          }
          newList.push(data)
        })
      setShowGongyi(true)
      return newList
    })
    let finalList: any[] = []
    lightPoint.map(item => {
      technologyContentList({ technologyId: -1 }).then(res => {
        res.map((data: any) => {
          if (data.id == item.technologyContentId) {
            let datas = {
              ...item,
              ...data,
            }
            finalList.push(datas)
          }
        })
      })
    })
    setTechnologyPoints(finalList)
  }
  const showTechnology = (data: any) => {
    technologyContentList({
      primaryTechnologyId: data.technologyId,
      technologyId: data.technologyContentId,
    }).then(res => {
      let list: any[] = []
      res.forEach((item: any) => {
        let data = {
          ...item,
          url: item.picture.split(','),
        }
        list.push(data)
      })
      setCraftList(list)
    })
    setShowCraftModal(true)
  }
  return (
    <div className={styles.root}>
      {/* //重要工作详情Modal */}
      <Modal
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        isOpenModal={openFilesDetail}
        close={() => {
          setOpenFilesDetail(false), setShowDigitalFiles(true)
        }}
      >
        <div className={styles.modalItem}>
          {singleDetail && (
            <>
              <div className={styles.title}>{singleDetail.name}</div>
              <div>
                {singleDetail.type == 'video' ? (
                  <video
                    src={singleDetail.url}
                    autoPlay
                    controls
                    className={styles.craftImg}
                    width="31.25vw"
                  ></video>
                ) : singleDetail.type == 'file' ? (
                  <div>
                    <embed className={styles.pdf} src={singleDetail.url}></embed>
                  </div>
                ) : (
                  <img className={styles.craftImg} src={singleDetail.url} />
                )}
              </div>
            </>
          )}
        </div>
      </Modal>
      {/* //历史回溯图片Modal */}
      <Modal
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        isOpenModal={openHistoryDetail}
        close={() => {
          setOpenHistoryDetail(false), setHistoryBackModalVisible(true)
          // setOpenDetail(false), setShowDigitalFiles(true)
        }}
      >
        <div className={styles.modalItem}>
          {singleDetail && (
            <>
              <div className={styles.title}>{singleDetail.title}</div>
              <div>
                <img className={styles.craftImg} src={singleDetail.ossPicUrl} />
                {/* <video src="https://media.w3.org/2010/05/sintel/trailer.mp4" controls width='31.25vw'></video> */}
              </div>
            </>
          )}
        </div>
      </Modal>
      {/* //工艺详情Modal */}
      <Modal
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        isOpenModal={openTechnologyDetail}
        close={() => {
          setOpenTechnologyDetail(false), setShowCraftModal(true)
        }}
      >
        <div className={styles.modalItem}>
          {singleDetail && (
            <div style={{ width: '64vw', height: '40vw', overflow: 'scroll' }}>
              <div className={styles.title}>{singleDetail.name}</div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {singleDetail.video && (
                  <video
                    style={{ width: '60vw' }}
                    src={singleDetail.video}
                    controls
                    autoPlay
                    width="31.25vw"
                  ></video>
                )}
                {singleDetail.picture && (
                  <Slider
                    {...lightSetting}
                    prevArrow={<SimplePrevArrow />}
                    nextArrow={<SimpleNextArrow />}
                    className={styles.lightSlider}
                  >
                    {singleDetail.url.map((item: any, index: any) => {
                      return <img className={styles.imgModal} key={index} src={item} />
                    })}
                  </Slider>
                )}
                {singleDetail.textDescription && <div>{singleDetail.textDescription}</div>}
              </div>
            </div>
          )}
        </div>
      </Modal>
      {/* //历史回溯Modal */}
      <Modal
        isOpenModal={historyBackModalVisible}
        close={() => {
          closeHistoryBackModal(), setOpenHistoryDetail(false)
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className={styles.historyBackModalBody}>
          <div className={styles.modalTitle}>历史回溯</div>
          <div className={styles.modalContent}>
            <div
              style={{
                display: 'flex',
                // justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              {historyBackList &&
                historyBackList.map((item: any, index: any) => {
                  return (
                    <div
                      key={index}
                      className={styles.craftCard}
                      style={{ backgroundImage: 'url(' + item.ossPicUrl + ')' }}
                      onClick={() => showHistoryDetail(item)}
                    >
                      <div className={styles.istoryBackCardContent}>
                        <div>{item.takeTime}</div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
          <div className={styles.modalBottomBox}>
            <div style={{ display: 'flex' }}>
              <NewRadio
                options={machineOptions}
                value={1}
                style={styles.modalBottomRadioGroup}
                onChange={value => setHistoryBackMachine(value)}
                textStyle={styles.notCheckPageText}
                textCheckStyle={styles.checkPageText}
              />
              <Button
                className={styles.modalButton}
                onClick={() => {
                  start(historyBackList)
                  setOpenGenerateVideo(true)
                }}
              >
                生成视频
              </Button>
            </div>
            <DatePicker
              inputReadOnly
              allowClear={false}
              bordered={false}
              className={styles.datePickerStyle}
              onChange={histortBackDataOnChange}
            />
          </div>
        </div>
      </Modal>
      {/* //重要节点Modal */}
      <Modal
        isOpenModal={showImportantNodeModal}
        close={() => closeImportantNodeModal()}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className={styles.ImportantNodeModal}>
          <div className={styles.modalTitle}>重要节点</div>
          <div
            style={{
              display: 'flex',
              height: '29.0625vw',
              // justifyContent: 'space-between',
              flexWrap: 'wrap',
              overflowY: 'scroll',
            }}
          >
            {constructionNode &&
              constructionNode.map((item: any, index: any) => {
                if (item.photos && item.photos.length > 0) {
                  return (
                    <div
                      key={index}
                      className={styles.craftCard}
                      style={{
                        backgroundImage: 'url(' + item.photos[0].ossPicUrl + ')',
                        position: 'relative',
                      }}
                      onClick={() => {
                        start(item.photos)
                        setOpenGenerateVideo(true)
                      }}
                    >
                      <div className={styles.craftCardContent}>
                        <div>{item.name}</div>
                      </div>
                    </div>
                  )
                } else {
                  return null
                }
              })}
          </div>
        </div>
      </Modal>
      {/* 工艺展示Modal */}
      <Modal
        isOpenModal={showCraftModal}
        close={() => closeModal()}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className={styles.craftModal}>
          <div className={styles.craftModalTitle}>外立面工程</div>
          <div
            style={{
              display: 'flex',
              marginTop: '1.0938vw',
              height: '29.0625vw',
              flexWrap: 'wrap',
              overflowY: 'scroll',
            }}
          >
            {craftList &&
              craftList.map((item: any, index: any) => {
                if (item.url[0]) {
                  return (
                    <div
                      key={index}
                      className={styles.craftCard}
                      style={{ backgroundImage: 'url(' + item.url[0] + ')', position: 'relative' }}
                      onClick={() => showDetail(item)}
                    >
                      <div className={styles.craftCardContent}>
                        <div>{item.name}</div>
                      </div>
                    </div>
                  )
                } else if (item.video) {
                  return (
                    <div
                      key={index}
                      style={{ position: 'relative' }}
                      className={styles.craftCard}
                      onClick={() => showDetail(item)}
                    >
                      <video src={item.video} className={styles.technologyVideo}></video>
                      <div className={styles.craftCardContent}>
                        <div>{item.name}</div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={index}
                      style={{ position: 'relative' }}
                      className={styles.craftCard}
                      onClick={() => showDetail(item)}
                    >
                      <img
                        src={require('../../../assets/img/technologyBG.jpg')}
                        className={styles.technologyVideo}
                      ></img>
                      <div className={styles.craftCardContent}>
                        <div>{item.name}</div>
                      </div>
                    </div>
                  )
                }
              })}
          </div>
        </div>
      </Modal>

      <Modal
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        isOpenModal={openGenerateVideo}
        close={() => {
          stop()
          setOpenGenerateVideo(false)
        }}
      >
        <div className={styles.modalVideo}>
          <div className={styles.modalVideoItem}>
            <img className={styles.videoImg} src={generateVideoImg} />
          </div>
        </div>
      </Modal>

      {/* 数字档案Modal */}
      <Modal
        isOpenModal={showDigitalFiles}
        close={() => setShowDigitalFiles(false)}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className={styles.digitalFiles}>
          <div className={styles.digital_title}>
            数字档案 <span style={{ fontSize: ' 1.5625vw' }}>{numberTitle}</span>
          </div>
          <NewRadio
            options={archivesTab}
            value={null}
            style={styles.digital_change}
            onChange={value => changeDigital(value)}
            textStyle={styles.unCheckText}
            textCheckStyle={styles.checkText}
          ></NewRadio>
          <div
            style={{
              display: 'flex',
              marginTop: '1.0938vw',
              marginRight: '1.0417vw',
              height: '30.2083vw',
              flexWrap: 'wrap',
              overflowY: 'scroll',
            }}
          >
            {archivesList.results &&
              archivesList.results.map((item: any, index: any) => {
                if (item.type == 'video') {
                  return (
                    <div className={styles.fileContainer}>
                      <video
                        src={item.url}
                        className={styles.craftFileCard}
                        onClick={() => showFilesDetail(item)}
                      ></video>
                      <div className={styles.fileName}>{item.name}</div>
                    </div>
                  )
                } else if (item.type == 'file') {
                  return (
                    // <div className={styles.filePDF} onClick={() => showFilesDetail(item)}>
                    //   <div className={styles.pdfName}>{item.name}</div>
                    // </div>
                    <div className={styles.fileContainer}>
                      <img
                        src={require('../../../assets/img/pdf.svg')}
                        className={styles.craftFileCard}
                        onClick={() => showFilesDetail(item)}
                      />
                      <div className={styles.fileName}>{item.name}</div>
                    </div>
                  )
                } else {
                  return (
                    <div className={styles.fileContainer}>
                      <img
                        src={item.url}
                        className={styles.craftFileCard}
                        onClick={() => showFilesDetail(item)}
                      />
                      <div className={styles.fileName}>{item.name}</div>
                    </div>
                  )
                }
              })}
          </div>
        </div>
      </Modal>
      {/* 重要工作详情Modal */}
      <Modal
        isOpenModal={openWorkDetail}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        close={() => setOpenWorkDetail(false)}
      >
        {working && (
          <div className={styles.workingItem}>
            <div className={styles.modalSize}>
              <div style={{ fontSize: '1.6667vw' }}>{working.name}</div>
              {/* <div style={{ fontSize: '1.1458vw' }}>张小小 2021-05-01</div> */}
              {working.img && <img className={styles.workImg} src={working.img} />}
              <div style={{ fontSize: '1.0417vw' }}>
                <p dangerouslySetInnerHTML={{ __html: working.content }}></p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {/* 亮点工艺Modal */}
      <Modal
        isOpenModal={showLightModal}
        close={() => setShowLightModal(false)}
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className={styles.lightModal}>
          <div className={styles.modalSize}>
            {lightModal && lightModal.name && (
              <div style={{ color: '#ffffff', fontSize: '32px', alignSelf: 'start' }}>
                {lightModal.name}
              </div>
            )}

            {lightModal && lightModal.video && (
              <video className={styles.videoModal} src={lightModal.video} controls autoPlay></video>
            )}
            {lightModal && lightModal.picture && (
              <Slider
                {...lightSetting}
                prevArrow={<SimplePrevArrow />}
                nextArrow={<SimpleNextArrow />}
                className={styles.lightSlider}
              >
                {lightModal.url.map((item: any, index: any) => {
                  return <img className={styles.imgModal} key={index} src={item} />
                })}
              </Slider>
            )}
            {lightModal && lightModal.textDescription && <div>{lightModal.textDescription}</div>}
          </div>
        </div>
      </Modal>
      <Modal
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        isOpenModal={projectModalVisiable}
        close={() => setProjectModalVisiable(false)}
      >
        <div className={styles.ImportantNodeModal}>
          <div className={styles.modalTitle}>项目信息</div>
          <div className={styles.projectModal}>
            <List
              size="small"
              className={styles.projectManagerList}
              bordered
              dataSource={projectManagerList}
              renderItem={(item: any) => (
                <List.Item className={styles.projectManagerItem}>
                  <div className={styles.projectModalItem}>
                    <div className={styles.projectModalItemName}>{item.name}</div>
                    <div className={styles.projectModalItemContent}>{item.content}</div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
      </Modal>
      <Modal
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
        isOpenModal={buildProcessModalVisiable}
        close={() => setBuildProcessModalVisiable(false)}
      >
        <div className={styles.ImportantNodeModal}>
          <div className={styles.modalTitle}>建设进度</div>
          <div className={styles.processLineChartModal}>
            <TowLineChart
              type="line"
              data1={realTime}
              data2={planTime}
              className={styles.chartContent}
            />
          </div>
        </div>
      </Modal>

      <div className={styles.container}>
        <div
          className={styles.gongyiBg}
          style={
            showGongyi && technologyImg
              ? { backgroundImage: 'url(' + technologyImg + ')' }
              : { backgroundImage: 'url(' + img1 + ')' }
          }
        >
          <header className={styles.header}>
            <div className={styles.headerTitle}>
              {showLight && showLight ? (
                <div
                  onClick={() => {
                    setShowLight(false), setShowGongyi(false)
                  }}
                  className={styles.takeBack}
                >
                  返回首页
                </div>
              ) : (
                <div className={styles.selectBuiding}>
                  <img
                    className={styles.buildingMenu}
                    // onClick={() => setSelectBuilding(!selectBuilding)}
                    src={require('../../../assets/images/menuIcon.png')}
                  />
                  {selectBuilding && (
                    <div className={styles.building_bg}>
                      <div className={styles.buildingList}>
                        {buildingList &&
                          buildingList.map(item => {
                            return (
                              <div
                                className={styles.buildingName}
                                // onClick={() => changeBuilding(item)}
                                key={item.index}
                              >
                                {item.name}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className={styles.title}>{projectName}智慧工地平台</div>
              <div className={styles.nowTime}>
                <span>{getTimeNow()}</span>
              </div>
            </div>
            <div className={styles.headerFrame}></div>
          </header>

          <div className={styles.body}>
            {pageShow == 1 && !showGongyi && (
              <div className={styles.EZUIPlayer}>
                {/* <EZUIPlayer deviceSerial={machine} height={968} className={styles.player} /> */}
                {machine == 1 && (
                  <EZUIPlayer deviceSerial={machine} height={968} className={styles.player} />
                )}
                {machine == 2 && (
                  <EZUIPlayer deviceSerial={machine} height={968} className={styles.player} />
                )}
                {machine == 3 && (
                  <EZUIPlayer deviceSerial={machine} height={968} className={styles.player} />
                )}
              </div>
            )}
            <div className={styles.content}>
              {showLight && showLight ? (
                <>
                  {technologyPoints &&
                    technologyPoints.map((item: any) => {
                      let picture = item.picture.split(',')
                      return (
                        <div
                          style={{
                            position: 'absolute',
                            left: item.left,
                            top: item.top,
                            zIndex: 3,
                          }}
                        >
                          <div className={styles.lightTitle}>{item.name}</div>
                          <div className={styles.lightDetail} onClick={() => openLightModal(item)}>
                            {item.video ? (
                              <video muted className={styles.picture} src={item.video} autoPlay loop/>
                            ) : (
                              item.picture && <img className={styles.picture} src={picture[0]} />
                            )}
                          </div>
                        </div>
                      )
                    })}
                </>
              ) : (
                <>
                  <div style={showGongyi ? { display: 'inline' } : { display: 'none' }}>
                    {technologyPoints &&
                      technologyPoints.map((item: any, index: any) => {
                        return (
                          <button
                            onClick={() => showTechnology(item)}
                            className={styles.showBtn}
                            key={index}
                            style={{
                              position: 'absolute',
                              left: item.left,
                              top: item.top,
                              zIndex: 3,
                            }}
                          >
                            {item.name}
                          </button>
                        )
                      })}
                  </div>
                  <div className={styles.contentl}>
                    {project}
                    {environment}
                    {buildProcess}
                  </div>
                  <div className={styles.contentc}>
                    <div className={styles.centerMenu}>
                      <div className={styles.bottomBox}>
                        <div>
                          {ShowMachine && (
                            <NewRadio
                              options={machineOptions}
                              value={1}
                              style={styles.machineBox}
                              textStyle={styles.notCheckMachineText}
                              textCheckStyle={styles.checkMachineText}
                              onChange={value => setMachine(value)}
                            />
                          )}
                          <NewRadio
                            options={pageOptions}
                            style={styles.bottomRadioGroup}
                            onChange={pageOnChange}
                            textStyle={styles.notCheckPageText}
                            textCheckStyle={styles.checkPageText}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.contentr}>
                    <div className={styles.show}>
                      <div className={styles.title}>
                        <img src={rectangle} className={styles.projectTitleRectangle}></img>
                        星河湾4.0工艺展示
                      </div>
                      <div className={styles.item}>
                        <div onClick={() => openLightTechnology()} className={styles.singleSlider}>
                          <img
                            style={{
                              width: '3.3333vw',
                              height: '3.3333vw',
                              marginBottom: '0.6771vw',
                            }}
                            src={require('../../../assets/img/icon4.png')}
                          />
                          <div style={{ fontSize: '0.9375vw' }}>亮点工艺</div>
                        </div>
                        <Slider
                          {...setting}
                          prevArrow={<SamplePrevArrow />}
                          nextArrow={<SampleNextArrow />}
                          className={styles.slider}
                        >
                          {technology &&
                            technology.map((item: any, index: any) => (
                              <div
                                onClick={() => showCraftBG(item)}
                                key={index}
                                className={styles.sliderCard}
                              >
                                <img
                                  style={{
                                    width: '3.3333vw',
                                    height: '3.3333vw',
                                    marginBottom: '0.6771vw',
                                  }}
                                  src={item.icon}
                                />
                                <div style={{ fontSize: '0.9375vw', textAlign: 'center' }}>
                                  {item.name}
                                </div>
                              </div>
                            ))}
                        </Slider>
                      </div>
                      <div className={styles.title2}>
                        <img src={rectangle} className={styles.projectTitleRectangle}></img>
                        数字档案
                      </div>
                      <div className={styles.number}>
                        <>
                          <div onClick={() => showDigitalFile(picture)} className={styles.card}>
                            <div className={styles.cardTitle}>照片</div>
                            <div style={{ color: '#6DE320' }} className={styles.cardValue}>
                              {picture && picture.count}
                            </div>
                          </div>
                          <div onClick={() => showDigitalFile(video)} className={styles.card}>
                            <div className={styles.cardTitle}>视频</div>
                            <div style={{ color: '#EDB758' }} className={styles.cardValue}>
                              {video && video.count}
                            </div>
                          </div>
                          <div onClick={() => showDigitalFile(blueprint)} className={styles.card}>
                            <div className={styles.cardTitle}>图纸</div>
                            <div style={{ color: '#4FCCFF' }} className={styles.cardValue}>
                              {blueprint && blueprint.count}
                            </div>
                          </div>

                          <div onClick={() => showDigitalFile(file)} className={styles.card}>
                            <div className={styles.cardTitle}>文件</div>
                            <div style={{ color: '#DF683F' }} className={styles.cardValue}>
                              {file && file.count}
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                    <div className={styles.importantWork}>
                      <div className={styles.title}>
                        <div>
                          <img src={rectangle} className={styles.projectTitleRectangle}></img>
                          重要工作
                        </div>

                        {/* <div onClick={() => startVideo()} className={styles.titleRight}>
                          <img
                            style={{ width: '1.25vw', height: '1.25vw' }}
                            src={require('../../../assets/images/start.png')}
                          />
                          <span>播放视频</span>
                        </div> */}
                      </div>
                      <div className={styles.workDetail}>
                        {workItem &&
                          workItem.map((item: any, index: any) => {
                            return (
                              <div
                                key={index}
                                onClick={() => openWorkModal(item)}
                                style={{ marginTop: '0.7292vw', cursor: 'pointer' }}
                              >
                                <div style={{ fontSize: '0.8333vw', fontWeight: 'bold' }}>
                                  {item.name}
                                </div>
                                {/* <div style={{ fontWeight: 'bold', fontSize: '0.625vw' }}>
                                  <p
                                    className={styles.workContent}
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                    style={{ WebkitBoxOrient: 'vertical' }}
                                  ></p>
                                </div> */}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
function newList(newList: any) {
  throw new Error('Function not implemented.')
}
