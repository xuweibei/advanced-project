import request from '@/utils/request'
import { stringify } from 'qs'
const API_GATEWAY = `https://${SERVER_IP}`
const SUMMARY = `${API_GATEWAY}/summary` //9095 端口
const BIG_DATA_SERVICE = `${API_GATEWAY}/data` //9098 端口
const MANAGEMENT = `${API_GATEWAY}/managent` // 9096 端口
const HOST_SERVICE = `${API_GATEWAY}/host` // 9091 端口
const USER = `${API_GATEWAY}/user`
const NB_CLOUD = `${API_GATEWAY}/nbcloud` //8901 端口
const SMART_SITE = `${API_GATEWAY}/site` //8849 端口
// const HOME = `${API_GATEWAY}/home` //9100 端口

interface AllHostList {
  homeId?: string
  id?: number
  hardWard?: string
  hostVersion?: string
  status?: string
  online?: boolean
  projectName?: string
}

function downFile(url: any) {
  let a = document.createElement('a')
  a.target = '_blank'
  a.href = url
  document.body.appendChild(a)
  a.click()
  a.remove()
}

//登录
export function accountLogin(data: any) {
  return request(SUMMARY + '/nbstaffs/login', {
    method: 'POST',
    data,
  })
}

// 获取用户信息
export function queryCurrent() {
  return request<API.CurrentUser>(SUMMARY + '/staffs/info', {
    params: {
      token: localStorage.getItem('token'),
    },
  })
}

// 今日活跃人数
export function queryActiveUserCount(data: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getActiveUserDistribution', {
    params: {
      ...data,
    },
  })
}
//今日新增人数
export function queryNewlyAddedUserCount(data: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserHomeMapCountToday', {
    params: {
      ...data,
    },
  })
}

//获取机器人列表
export function getRobotsList(developId: number) {
  return request(MANAGEMENT + `/robot/getRobotsList`, {
    params: {
      developerId: developId,
    },
  })
}
//今日意向客户
export function getWillingCustomersByTimes(data: any) {
  return request(MANAGEMENT + `/robot_connect_record/getWillingCustomersByTimes`, {
    method: 'PUT',
    params: {
      ...data,
    },
  })
}
//获取今日看房量
export function getTotalKanFangNum(data: any) {
  return request(SUMMARY + `/robot_connect_record/getTotalKanFangNum`, {
    method: 'PUT',
    params: {
      ...data,
    },
  })
}

//智能化社区
export function getIntelligentDeveloperCount(data?: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getIntelligentDeveloperCount', {
    params: {
      ...data,
    },
  })
}
//智能化项目
export function getIntelligentProjectCount(data?: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getIntelligentProjectCount', {
    params: {
      ...data,
    },
  })
}

//获取摄像头数量
export function getCameraStats() {
  return request(MANAGEMENT + '/bigdata/camera_stats')
}
//获取指定日期的摄像头开启数量
export function getCameraOpenStatsByDate(data: any) {
  return request(MANAGEMENT + '/bigdata/camera_stats/getCameraOpenStatsByDate', {
    params: {
      ...data,
    },
  })
}

// 获取主机总数、在线数、离线数
export function getHostCountInfo(data?: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/getHostCountInfo', {
    method: 'GET',
    params: {
      ...data,
    },
  })
}
// 获取主机分布状态
export function getStatusCount() {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/status/count')
}

// 获取 app 累计用户
export function getAppUserCount() {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserHomeMapCount')
}

// 活跃用户历史数据（7月）
export function getActiveUserDistributionMonth(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getActiveUserByMonth', {
    params,
  })
}
// 获取城市项目数
export function getProjectCityCount() {
  return request(BIG_DATA_SERVICE + '/project_info/city/count')
}
// 获取APP今日激活主机数据
export function getHostInstallCountToday(params: any) {
  return request(HOST_SERVICE + '/host_install/getHostInstallCountToday4Yun', {
    method: 'GET',
    params,
  })
}
// 获取今日绑定主机数据
export function getHostBindCountToday(params: any) {
  return request(BIG_DATA_SERVICE + `/bigdata/hostmodule/query/newBind`, {
    method: 'GET',
    params,
  })
}
// 获取今日机器人看房
export function getNewCustomerNumOfDate(data: any) {
  return request(MANAGEMENT + '/robot_account/getNewCustomerNumOfDate', {
    params: {
      ...data,
    },
  })
}

//获取省信息
export const getProvinces = () => {
  return request(SUMMARY + '/nb_position/provinces')
}
//根据省id获取城市
export function getCityById(id: number) {
  return request(SUMMARY + `/nb_position/cites/${id}`)
}
//根据城市id获取区域
export function getareasById(id: number) {
  return request(SUMMARY + `/nb_position/areas/${id}`)
}
export function getBuildings(data: any) {
  return request(SUMMARY + `/buildings`, {
    params: {
      data,
    },
  })
}

//获取区域
export function getRegions(data: any) {
  return request(SUMMARY + `/nbregion/query`, {
    params: data,
  })
}
//保存区域（新增/修改）
export function saveRegions(data: any) {
  return request(SUMMARY + `/nbregion/save`, {
    method: 'POST',
    data,
  })
}
//删除区域
export function deleteRegions(id: any) {
  return request(SUMMARY + `/nbregion/delete/${id}`, {
    method: 'DELETE',
    data: {
      id: id,
    },
  })
}

// 查询当前条件下项目信息

/**
 * 通过项目id、项目名称、项目经理获取社区信息
 * @param data
 */
export function getParkingProPage(data: any) {
  return request(MANAGEMENT + '/plat/parking_places/getParKingProPage', {
    method: 'GET',
    params: data,
  })
}

/**
 * 获取当前账号下所有的社区
 */
export function getAllBuildings() {
  return request(SUMMARY + '/nbroles/getCurrentBuildings', {
    method: 'POST',
  })
}

/**
 *
 * @param roleId
 */
export function getProjectUsersByCurrentRole() {
  return request(HOST_SERVICE + '/nbproject/getProjectUsersByCurrentRole', {
    method: 'GET',
  })
}

/**
 * 获取所有的项目经理
 * @param params
 */
export function getProjectManager(buildingIds: any[]) {
  return request(HOST_SERVICE + '/nbproject/getProjectUsersByBuildingIds', {
    method: 'GET',
    params: {
      buildingIds: buildingIds,
    },
  })
}

/**
 * 获取所有的带项目名称的项目
 */
export function getAllBuildingsByRoleId() {
  return request(SUMMARY + '/nbuilding/getBuildingsByCurrentRole')
}

/**
 * 获取所有项目成员
 */
export function getAllProjectWorkers() {
  return request(SUMMARY + '/nbstaffs/list', {
    method: 'GET',
  })
}

/**
 * 新增停车项目
 * @param data
 */
export function addNewProject(data: any) {
  return request(MANAGEMENT + '/plat/parking_places/addParkingProjectInfo', {
    method: 'POST',
    data,
  })
}

/**
 * 通过项目id获取项目详情
 * @param id
 */
export function getParkingInfoById(id: any) {
  return request(MANAGEMENT + '/plat/parking_places/getParKingProInfo', {
    method: 'GET',
    params: {
      proId: id,
    },
  })
}

// 获取社区信息
export function queryBuilds(params: any) {
  return request(MANAGEMENT + '/plat/buildings', {
    params: params,
    getResponse: true, // 分页信息中，总条数在 Header 中，需要获取原始的 response
  })
}

// 批量删除社区
export function removeBuildings(ids: any[]) {
  return request(MANAGEMENT + '/plat/buildings/batch_delete', {
    method: 'DELETE',
    params: {
      buildingIds: ids.join(','),
    },
  })
}

// 添加社区
export function addBuilding(data: any) {
  return request(MANAGEMENT + '/plat/buildings/add', {
    method: 'POST',
    data,
  })
}

// 修改社区
export function updateBuilding(id: number, data: any) {
  return request(MANAGEMENT + `/plat/buildings/update/${id}`, {
    method: 'PUT',
    data,
  })
}

// 获取车位信息
export const queryParkingInfo = (params: any) => {
  return request(MANAGEMENT + '/plat/parking_places', {
    params: params,
    getResponse: true, // 分页信息中，总条数在 Header 中，需要获取原始的 response
  })
}
// 单独删除车位
export function removeParkingsById(id: number) {
  return request(SUMMARY + '/parkingPlaces/delete', {
    method: 'DELETE',
    params: {
      parkingPlaceIds: id,
    },
  })
}

// 批量删除车位
export function removeParkings(ids: number[]) {
  return request(SUMMARY + '/parkingPlaces/delete', {
    method: 'DELETE',
    params: {
      parkingPlaceIds: ids.join(','),
    },
  })
}

// 获取素材列表
export function queryNews(params: any) {
  return request(SUMMARY + '/materials/queryByDeveloperId', {
    params: params,
  })
}

// 删除素材
export function removeNews(id: any) {
  return request(MANAGEMENT + `/plat/materials/delete/${id}`, {
    method: 'DELETE',
  })
}

// 添加素材
export function addNews(data: any) {
  return request(MANAGEMENT + '/plat/materials/add', {
    method: 'POST',
    data,
  })
}

// 修改素材
export function updateNews(data: any) {
  return request(SUMMARY + `/materials/save`, {
    method: 'POST',
    data,
  })
}

// 根据 id 获取单个素材
export function fetchNews(id: any) {
  return request(SUMMARY + `/materials/detail/${id}`)
}

export const UPLOAD_SERVICE_URL = MANAGEMENT + '/plat/files/upload'
// 文件上传
export function upload(data: any) {
  return request(MANAGEMENT + '/plat/files/upload', {
    method: 'POST',
    data,
  })
}

//删除照片
export function delPhoto(mobile: any) {
  return request(MANAGEMENT + `/home_user/${mobile}/face`, {
    method: 'DELETE',
  })
}

export const setToppingStatus = (id: number) => {
  return request(SUMMARY + `/materials/topping/${id}`, {
    method: 'POST',
  })
}

export const setShelvesTimeStatus = (id: number) => {
  return request(SUMMARY + `/materials/shelves/${id}`, {
    method: 'POST',
  })
}

// 获取摄像头各类统计信息
export function getCameraStatisticsInfo() {
  return request(MANAGEMENT + '/bigdata/camera_stats')
}

/**
 * 获取摄像头流量
 * @param {*} date - 前七天的日期，格式：YYYY-MM-DD
 */
export function getInternetTraffic(date: any) {
  return request(MANAGEMENT + '/bigdata/camera_stats/getInternetTraffic', {
    params: {
      date,
    },
  })
}

// 流量数据历史数据
export function getInternetTrafficMonth(params: any) {
  return request(MANAGEMENT + '/bigdata/camera_stats/getInternetTrafficMonth', {
    params,
  })
}

// 近7天监控打开次数历史数据
export function getCameraOpenCountBy7Day() {
  return request(MANAGEMENT + '/bigdata/camera_stats/getCameraOpenCountBy7Day')
}

//获取项目成员列表
export function getWorkerListUsingGET() {
  return request(USER + '/nb_worker/get_all')
}

//删除停车项目
export function delParking(data: any) {
  return request(SUMMARY + `/parkingPlaces/delParkingProject`, {
    method: 'DELETE',
    params: {
      ...data,
    },
  })
}

// 添加车位
export function addParking(data: any) {
  return request(SUMMARY + '/parkingPlaces/add', {
    method: 'POST',
    data,
  })
}

// 修改车位
export function updateParking(id: number, data: any) {
  return request(SUMMARY + `/parkingPlaces/update/${id}`, {
    method: 'PUT',
    data,
  })
}

// 导入数据
export function uploadXlsFile(file: any) {
  const formData = new FormData()
  formData.append('file', file)
  return request(MANAGEMENT + '/plat/parking_places/batch_import', {
    method: 'POST',
    data: formData,
  })
}

/**
 * camera相关接口
 */
// 获取萤石直播地址
export function getYingShiPreviewUrl(source: any) {
  return request(SUMMARY + `/cameras/getLiningAddress`, {
    method: 'GET',
    params: {
      source,
    },
  })
}

export function getYingshiAccessToken() {
  return request(SUMMARY + `/cameras/getYingshiAccessToken`)
}

export function getParkingDetailById(id: number) {
  return request(SUMMARY + `/parkingPlaces/getParkingPlacesById/${id}`)
}

/**
 * 获取移动侦测报警记录
 * @param {obj} params - 请求参数
 * @param {*} params.deviceSerial  - 设备序列号
 * @param {*} params.startTimeMillis
 * @param {*} params.endTimeMillis
 * @param {*} params.pageStart
 * @param {*} params.pageSize
 */
export function getMovingMonitorRecords(params: any) {
  params = {
    ...params,
    pageStart: 1,
  }
  return request(
    MANAGEMENT + `/plat/cameras/queryMotionDetectAlarmFilesByDevice/${params.deviceSerial}`,
    {
      method: 'GET',
      params,
    }
  )
}

/**
 * 广告相关接口
 */

export function queryBanners(params: any) {
  return request(HOST_SERVICE + `/advert/query`, {
    method: 'GET',
    params,
  })
}

export function getBannerDetailById(id: any) {
  return request(HOST_SERVICE + `/advert/detail/${id}`)
}

export function addBanner(data: any) {
  return request(HOST_SERVICE + '/advert/add', {
    method: 'POST',
    data,
  })
}

// 删除素材
export function removeBanner(id: any) {
  return request(MANAGEMENT + `/advert/delete/${id}`, {
    method: 'DELETE',
  })
}

export function sortBanner(data: any) {
  return request(HOST_SERVICE + '/advert/sort', {
    method: 'POST',
    data,
  })
}

//获取所有城市
export function getCitiesList() {
  return request(SUMMARY + `/nbregion/cities`)
}
//获取社区
export function getBuilding(data?: any) {
  return request(SUMMARY + `/nbuilding/query`, {
    params: {
      ...data,
    },
  })
}
//保存社区（新增/修改）
export function saveBuilding(data: any) {
  return request(SUMMARY + `/nbuilding/save`, {
    method: 'POST',
    data,
  })
}
//删除社区
export function deleteBuilding(id: any) {
  return request(SUMMARY + `/nbuilding/delete/${id}`, {
    method: 'DELETE',
    data: {
      id: id,
    },
  })
}

// 查询角色列表
export function queryRoles() {
  return request(SUMMARY + '/nbroles/select')
}

// 删除角色
export function removeRole(id: number) {
  return request(SUMMARY + `/roles/${id}`, {
    method: 'DELETE',
  })
}

// 添加角色
export function addRole(data: any) {
  return request(MANAGEMENT + '/nbroles/save', {
    method: 'POST',
    data,
  })
}

// 修改角色
export function updateRole(id: any, data: any) {
  return request(SUMMARY + `/nbroles/save`, {
    method: 'POST',
    data: {
      ...data,
      id: id,
    },
  })
}

// 获取用户列表
export function queryUserList(params: any) {
  return request(MANAGEMENT + '/nbstaffs/query', {
    params,
  })
}

// 添加用户
export function saveUser(data: any) {
  return request(MANAGEMENT + '/nbstaffs/save', {
    method: 'POST',
    data,
  })
}

// 删除用户
export function removeUser(id: any) {
  return request(SUMMARY + `/nbstaffs/delete/${id}`, {
    method: 'POST',
    data: {
      id,
    },
  })
}

// 根据用户角色 id 获取该角色可访问的区域数据
export function selectTreeLevelPermission(roleId?: number) {
  return request(SUMMARY + `/nbroles/selectTreeLevelPermission`, {
    params: {
      roleId,
    },
  })
}

/**
 * 使用权限id获取当前账号所有拥有权限的区域、城市、社区、项目
 * @param roleId
 */
export function getUserTreePermission(data?: any) {
  return request(SUMMARY + '/nbroles/selectTreeLevelPermission', {
    params: {
      ...data,
    },
  })
}

// 根据用户 ID 获取权限列表
export const getUserPermissionsByUserId = (id: number) => {
  return request<API.Permission[]>(SUMMARY + '/nbroles/getPermissionsByRoleId', {
    params: {
      staffRoleId: id,
    },
  })
}
//初始化密码
export function initializePwd(data: any) {
  return request(SUMMARY + `/nbstaffs/initializePwd/${data.id}?pwd=${data.pwd}`, {
    method: 'POST',
  })
}

// 获取权限配置
export function getPermissionConfig() {
  return request(SUMMARY + `/nbroles/getPermissions`)
}
//获取工程日志列表
export function getEngineeringLogList(data: any) {
  return request(HOST_SERVICE + `/nbproject/project/logs`, {
    params: {
      ...data,
    },
  })
}
//获取主机列表
export function getHostList(data: any) {
  return request(HOST_SERVICE + `/nbhost/query`, {
    params: {
      ...data,
    },
  })
}

//获取日志操作人员
export function getLogUsers(data?: any) {
  return request(HOST_SERVICE + `/nbproject/logUsers`, {
    params: {
      ...data,
    },
  })
}
//获取项目列表
export function getProjectList(params?: any) {
  return request(HOST_SERVICE + `/nbproject/select`, {
    params,
  })
}
//根据项目ID获得项目详情
export function getProjectDetailByProjectId(data: any) {
  return request(HOST_SERVICE + `/nbproject/details/${data.id}`, {
    params: {
      ...data,
    },
  })
}
//删除项目
export function deleteProject(data: any) {
  return request(HOST_SERVICE + `/project_info/delete/${data.id}`, {
    method: 'DELETE',
    data: {
      ...data,
    },
  })
}

//根据项目ID获得项目下主机列表
export function getHostListByProjectId(data: any) {
  return request(HOST_SERVICE + `/nbproject/project/host`, {
    params: {
      ...data,
    },
  })
}
//获取项目下楼号、房间信息
export function getBuildingByProjectId(id: any) {
  return request(HOST_SERVICE + `/nbproject/project/buildingNumbers/${id}`, {
    params: {
      projectId: id,
    },
  })
}
//根据主机ID获取主机信息
export function getHostDetail(data: any) {
  return request(HOST_SERVICE + `/nbhost/getBindedUserInfoByHomeId/${data.hostId}`)
}
//根据主机ID获取主机生命周期（日志）
export function getHostLifecycle(data: any) {
  return request(HOST_SERVICE + `/host_install/records/${data.hostId}`, {
    params: {
      ...data,
    },
  })
}

//根据主机ID获取主机操作日志
export function queryExecutionHistoryByHomeId(data: any) {
  return request(NB_CLOUD + `/user/queryExecutionHistoryByHomeId`, {
    method: 'POST',
    data,
  })
}
//根据主机ID获取主机版本日志
export function queryPackageHistoryByHomeId(data: any) {
  return request(NB_CLOUD + `/ota/package/history`, {
    params: {
      ...data,
    },
  })
}
export function getHostInfo(hostId: any) {
  return request(HOST_SERVICE + `/host_config/get/${hostId}`, {
    params: {
      hostId,
    },
  })
  // return request(`https://nb-host-totalinfo.oss-cn-beijing.aliyuncs.com/${hostId}.json`)
}

//获取项目经理
export function getProjectUserByBuildingIds(data: any) {
  return request(HOST_SERVICE + '/nbproject/getProjectUsersByBuildingIds', {
    params: {
      buildingIds: data,
    },
  })
}

//获取当前角色下的社区
export function getCurrentBuildings(data: any) {
  return request(SUMMARY + `/nbroles/getCurrentBuildings`, {
    method: 'POST',
    params: {
      ...data,
    },
  })
}

//新增项目
export function addProject(data: any) {
  return request(MANAGEMENT + `/project_info/add`, {
    method: 'POST',
    data,
  })
}
//新增项目
export function updateProject(data: any) {
  return request(MANAGEMENT + `/project_info/update`, {
    method: 'PUT',
    data,
  })
}
/**
 * 使用权限id获取当前账号所有拥有权限的区域、城市、社区、项目
 * @param roleId
 * @param developerId
 */
export function getUserList() {
  return request(SUMMARY + '/nbstaffs/list', {
    // params: {
    //   ...data,
    // },
  })
}
//获取成员列表
export function getProjectUser() {
  return request(USER + '/nb_worker/get_all')
}

// 获取主机总数、在线数、离线数
export function getHostActiveInfo() {
  return request(BIG_DATA_SERVICE + '/project_info/host/count')
}
// 获取主机软件版本总数
export function getHostSoftwareInfo() {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/getHostSoftwareInfo')
}
// 获取主机所在城市分布情况
export function getHostCityDistribution() {
  return request(BIG_DATA_SERVICE + '/project_info/city/count')
}
// 获取主机所在项目分布情况
export function getHostProjectDistribution() {
  return request(BIG_DATA_SERVICE + '/project_info/active/host/count')
}
// 获取主机维修、报废历史记录
export function getHostHistory(params: any) {
  return request(BIG_DATA_SERVICE + '/host_repair/query/stat', {
    params,
  })
}
// 获取主机型号数量
export function getDavinciHostCount(data?: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getHostHardWardCount', {
    method: 'GET',
    params: {
      ...data,
    },
  })
}
// 获取主机今日报修数量
export function getRepairCount() {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/today/repair/count')
}

// 获取主机在线型号
export function getHardwardCount() {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/hardward/count')
}

//分页查询用户信息列表
export function queryUserInfoList(data: any) {
  return request(USER + `/nbAppUser/queryUserInfoList4NewHome`, {
    method: 'GET',
    params: data,
  })
}

//根据手机号查询用户详细信息
export function queryUserInfoByMobile(data: any) {
  return request(USER + `/nbAppUser/queryUserInfoByMobile`, {
    method: 'POST',
    data,
  })
}

//根据手机号查询用户服务信息
export function queryUserObtainedHostAndPermissionByMobile(data: any) {
  return request(
    BIG_DATA_SERVICE + `/bigdata/usermodule/queryUserObtainedHostAndPermissionByMobile`,
    {
      method: 'POST',
      data,
    }
  )
}

export function queryUserExecutionHistory(data: any) {
  return request(NB_CLOUD + '/user/queryUserExecutionHistory', {
    method: 'POST',
    data,
  })
}
//根据手机号查询App埋点
export function getUserActiveToApp(data: any) {
  return request(BIG_DATA_SERVICE + `/bigdata/usermodule/queryUserActiveToApp`, {
    params: {
      ...data,
    },
  })
}
//根据手机号查询车位监控信息
export function getCameraStatsInfo(data: any) {
  return request(MANAGEMENT + `/bigdata/camera_stats/queryInfo/${data.mobile}`, {
    params: {
      ...data,
    },
  })
}

// 获取 app 今日新增用户
export function getUserRegisterCountToday() {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserHomeMapCountToday')
}
// 获取 app 七日新增用户
export function getUserRegisterCountIn7days() {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserRegisterCountIn7days')
}
// 获取 app 今日启动次数
export function getAppTodayLaunchTimes() {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getAppTodayLaunchTimes')
}
// 获取 app 日活
export function getAppTodayActiveUserCount() {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getAppTodayActiveUserCount')
}
/**
 *  获取 app 月活
 * @param {*} month - 月份
 */
export function getAppMonthActiveUserCount(month: any) {
  return request(BIG_DATA_SERVICE + `/bigdata/usermodule/getAppMonthActiveUserCount/${month}`)
}
// 获取用户城市分布
export function getUserCityDistribution() {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserCityDistribution')
}
// app 版本分布
// export function getUserAppVersionDistribution() {
//   return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserAppVersionDistribution')
// }
export function getUserAppVersionDistribution() {
  return request(
    BIG_DATA_SERVICE + '/bigdata/usermodule/getUserAppVersionDistributionByDeveloperId'
  )
}
// 新增用户历史数据
export function getUserRegisterDistribution(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getUserHomeMapCountToday', {
    params,
  })
}
// 启动次数历史数据
export function getAppLaunchTimeDistribution(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getAppLaunchTimeDistribution', {
    params,
  })
}
// 活跃用户历史数据
export function getActiveUserDistribution(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getActiveUserDistribution', {
    params,
  })
}
// 活跃用户历史数据（7月）
export function getActiveUserDistribution7month(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getActiveUserByMonth', {
    params,
  })
}

// 活跃用户历史数据（7日）
export function getActiveUserDistribution7day(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getActiveUserDistribution', {
    params,
  })
}
// 获取 app 用户分布城市
export function getAPPUserCityCount() {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/app/user/city/count')
}
//获取今日绑定主机用户数
export function getBindHost(params: any) {
  return request(BIG_DATA_SERVICE + `/bigdata/hostmodule/query/newBind`, {
    method: 'GET',
    params,
  })
}

//日活用户数上周7日平均 (晏)
export function getDayActiveNum() {
  return request(BIG_DATA_SERVICE + `/bigdata/usermodule/getApp7DayActiveUserCountByDeveloperId`, {
    method: 'GET',
  })
}

//获取所有城市
export function getAllCity() {
  return request(SUMMARY + '/nbregion/cities')
}

// ====== 个人中心 ======
// 获取验证码
export function getVerifyCode(mobile: string) {
  return request(MANAGEMENT + '/plat/staffs/sendVerifyCode', {
    method: 'PUT',
    data: mobile,
  })
}

// 修改密码
export function resetPassword(data: any) {
  return request(SUMMARY + '/nbstaffs/resetpwd', {
    method: 'POST',
    data,
  })
}

//根据开发商ID获取所有社区
export function getALlBuildingByDeveloperId() {
  return request(SUMMARY + `/nbroles/getBuildingsByRole`)
}

//查询主机总数、在线数、离线数,今日和总计的激活和绑定数据 V1.0.1 晏
export function queryHostTodayStatusNum(params?: any) {
  return request(BIG_DATA_SERVICE + `/bigdata/hostmodule/getHostInfoCount`, {
    method: 'GET',
    params,
  })
}

//硬件版本列表 V1.0.1
export function queryHardWareVersion(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getHostHardWardCount', {
    method: 'GET',
    params,
  })
}

//软件版本信息 V1.0.1
export function querySoftWareVersion(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/getHostSoftwareInfoCount', {
    method: 'GET',
    params,
  })
}

// 监控打开次数历史数据 V1.0.1
export function getCameraOpenCountByMonth(params: any) {
  return request(BIG_DATA_SERVICE + '/camera_stats/getV1CameraOpenCountByMonth', {
    method: 'GET',
    params,
  })
}

//获取摄像头总数 V1.0.1
export function getCameraNum(params: any) {
  return request(BIG_DATA_SERVICE + '/camera_stats/getCameraOpenCount', {
    method: 'GET',
    params,
  })
}

// 获取车位监控数量 V1.0.1
export function getCameraCount(params: any) {
  return request(MANAGEMENT + '/plat/parking_places/count', {
    method: 'GET',
    params,
  })
}

//通过社区id获取楼栋信息 V1.1.0
export function getBuildingInfoById(buildingId: any) {
  return request(MANAGEMENT + `/temi_building/getBuilding/${buildingId}`)
}

//通过社区id分页获取楼栋 V1.1.0
export function queryBuildingsById(params: any) {
  return request(MANAGEMENT + '/blocks/get', {
    method: 'GET',
    params,
  })
}

//新建楼栋 V1.1.0
export function addBuildings(data: any) {
  return request(MANAGEMENT + '/blocks/add', {
    method: 'POST',
    data,
  })
}

//修改楼栋 V1.1.0
export function updateBuildings(data: any) {
  return request(MANAGEMENT + '/blocks/edit', {
    method: 'PUT',
    data,
  })
}

//删除楼栋 V1.1.0
export function delBuildings(id: any) {
  return request(MANAGEMENT + `/blocks/${id}`, {
    method: 'DELETE',
  })
}

//通过楼栋id分页获取户室信息 V1.1.0
export function queryHouseByBuildingId(params: any) {
  return request(MANAGEMENT + `/home_new`, {
    method: 'GET',
    params,
  })
}

//通过楼栋id获取楼栋详情 V1.1.0
export function queryHouseInfoByBuildingId(params: any) {
  return request(MANAGEMENT + `/home_new/getUnitAndFloorInfoByBlockId`, {
    method: 'GET',
    params,
  })
}

//新建户室 V1.1.0
export function addHouse(data: any) {
  return request(MANAGEMENT + '/home_new', {
    method: 'POST',
    data,
  })
}

//修改户室 V1.1.0
export function editHouse(id: any, params: any) {
  return request(MANAGEMENT + `/home_new/${id}`, {
    method: 'PUT',
    params,
  })
}

//删除户室 V1.1.0
export function delhouse(id: any) {
  return request(MANAGEMENT + `/home_new/${id}`, {
    method: 'DELETE',
  })
}

//业主管理模块分页获取列表 V1.1.0
export function queryHomeUsers(params: any) {
  return request(MANAGEMENT + `/home_user/query`, {
    method: 'GET',
    params,
  })
}

//新增业主信息 V1.1.0
export function addHomeUsers(data: any) {
  return request(MANAGEMENT + '/home_user/save', {
    method: 'POST',
    data,
  })
}

//查询业主信息详情 V1.1.0
export function searchHomeUser(id: any) {
  return request(MANAGEMENT + `/home_user${id}`, {
    method: 'GET',
  })
}

//删除业主信息 V1.1.0
export function delHomeUser(mobile: any) {
  return request(MANAGEMENT + `/home_user/${mobile}`, {
    method: 'DELETE',
  })
}

//根据社区id查询楼栋 V1.1.0
export function queryBuildingsByCommunityId(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/blocks`, {
    method: 'GET',
  })
}
//根据楼栋id查询单元 V1.1.0
export function queryUnitsByHomeId(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/units`, {
    method: 'GET',
  })
}

//根据单元id查询房屋号 V1.1.0
export function queryHomesByUnitId(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/homes`, {
    method: 'GET',
  })
}

//门禁卡开卡 V1.1.0
export function activateCard(params: any) {
  return request(MANAGEMENT + `/access/card/activateCard`, {
    method: 'POST',
    params,
  })
}

//导出门禁卡列表
export function exportCardExce(data: any) {
  downFile(MANAGEMENT + `/access/card/export?${stringify(data)}`)
}

//获取树杈楼栋-单元-房间 V1.1.0
export function buildingBlockUnitHomes(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/buildingBlockUnitHomes`)
}

//分页获取审核列表 V1.1.0
export function queryHomeAudit(params: any) {
  return request(MANAGEMENT + '/home_audit', {
    method: 'GET',
    params,
  })
}

//添加审核 V1.1.0
export function addHomeAudit(params: any) {
  return request(MANAGEMENT + '/home_audit', {
    method: 'PUT',
    params,
  })
}
//查询设备 V1.1.0
export function getDevicePage(data: any) {
  return request(MANAGEMENT + '/doorDevice', {
    method: 'GET',
    params: {
      ...data,
    },
  })
}

//删除设备  V1.1.0
export function delDoorDevice(id: any) {
  return request(MANAGEMENT + `/doorDevice/${id}`, {
    method: 'DELETE',
  })
}

//查询指定设备 V1.1.0
export function getDeviceDetail(id: any) {
  return request(MANAGEMENT + `/doorDevice/${id}`, {
    method: 'GET',
  })
}

//修改设备SIP V1.1.0
export function upDateSIPDevice(id: any, data: any) {
  return request(MANAGEMENT + `/doorDevice/${id}/tele-gateway`, {
    method: 'POST',
    data,
  })
}

//修改设备名称 V1.1.0
export function upDateDevice(id: any, params: any) {
  return request(MANAGEMENT + `/doorDevice/${id}`, {
    method: 'PUT',
    params,
  })
}

//添加设备 V1.1.0
export function addDevice(data: any) {
  return request(MANAGEMENT + `/doorDevice/`, {
    method: 'POST',
    data,
  })
}

//获取二层区域-社区数据 V1.1.0
export function getPermission2Level() {
  return request(SUMMARY + '/nbroles/selectLevel2Permission', {
    method: 'GET',
  })
}

//通过社区id获取楼栋 v1.1.0
export function getBuildingById(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/blocks`, {
    method: 'GET',
  })
}

//通过楼栋id查询单元信息 v1.1.0
export function queryHouseUnitByBuildingId(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/units`, {
    method: 'GET',
  })
}

//获取门禁开门日志 V1.1.0
export function queryDoorLogs(params: any) {
  return request(MANAGEMENT + '/access/permission/getAccessOpenDoorLog', {
    method: 'GET',
    params,
  })
}

//获取对讲日志 V1.1.0
export function queryTalkLogs(params: any) {
  return request(MANAGEMENT + '/access/permission/getAccessTalkbackLog', {
    method: 'GET',
    params,
  })
}

//分页获取门禁卡片列表 V1.1.0
export function queryCardList(params: any) {
  return request(MANAGEMENT + '/access/card', {
    method: 'GET',
    params,
  })
}

//添加卡片 V1.1.0
export function addCard(data: any) {
  return request(MANAGEMENT + '/access/card/saveCard', {
    method: 'POST',
    data,
  })
}

//换卡 V1.1.0
export function changeCard(oldCardNo: string, data: any) {
  return request(MANAGEMENT + `/access/card/updateCard/${oldCardNo}`, {
    method: 'POST',
    data,
  })
}

//删除卡片 V1.1.0
export function delCard(id: number) {
  return request(MANAGEMENT + `/access/card/delCard/${id}`, {
    method: 'POST',
  })
}

//挂失卡片 V1.1.0
export function reportCard(id: number) {
  return request(MANAGEMENT + `/access/card/reportCard/${id}`, {
    method: 'POST',
  })
}

//解除挂失卡片 V1.1.0
export function unreportCard(id: number) {
  return request(MANAGEMENT + `/access/card/unreportCard/${id}`, {
    method: 'POST',
  })
}

//退卡 V1.1.0
export function refundCard(params: any) {
  return request(MANAGEMENT + `/access/card/refundCard/`, {
    method: 'POST',
    params,
  })
}

//补卡 V1.1.0
export function reissueCard(oldCardNo: any, data: any) {
  return request(MANAGEMENT + `/access/card/reissueCard/${oldCardNo}`, {
    method: 'POST',
    data,
  })
}

//获取门禁组列表 V1.1.0
export function queryPermissionGroup(params: any) {
  return request(MANAGEMENT + '/access/permission/getAccessPermissionList', {
    method: 'GET',
    params,
  })
}

//根据社区Id获取设备列表 V1.1.0
export function queryDeviceListByCommunityId(params: any) {
  return request(MANAGEMENT + '/access/permission/getDeviceListByBuildingId', {
    method: 'GET',
    params,
  })
}

//添加权限组 V1.1.0
export function addPermissionGroup(data: any) {
  return request(MANAGEMENT + '/access/permission/bindAccessDevicePermission', {
    method: 'POST',
    data,
  })
}

//修改权限组 V1.1.0
export function updataPermissionGroup(data: any) {
  return request(MANAGEMENT + '/access/permission/updatePermissionGroup', {
    method: 'PUT',
    data,
  })
}

//删除权限组 V1.1.0
export function delPermissionGroup(params: any) {
  return request(MANAGEMENT + '/access/permission/unbindAccessDevicePermission', {
    method: 'DELETE',
    params,
  })
}

//获取门禁配置列表 V1.1.0
export function queryPermissionSettingList(params: any) {
  return request(MANAGEMENT + '/access/permission/getUserListByBuildingId', {
    method: 'GET',
    params,
  })
}

//获取主机版本号
export function getHostEditions(data?: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/getHostEditions', {
    method: 'GET',
    params: {
      ...data,
    },
  })
}

//获取人员四级级联接口 V1.1.0
export function getUserHierarchyList(params: any) {
  return request(MANAGEMENT + '/access/permission/selectUser2HierarchyList', {
    method: 'GET',
    params,
  })
}

//获取设备四级级联接口 V1.1.0
export function getDeviceHierarchyList(params: any) {
  return request(MANAGEMENT + '/access/permission/selectDevice4HierarchyList', {
    method: 'GET',
    params,
  })
}

//人员绑定门禁权限 V1.1.0
export function bindPermission(data: any) {
  return request(MANAGEMENT + '/access/permission/bindAccessUserPermission', {
    method: 'POST',
    data,
  })
}

//门禁组权限解绑人员 V1.1.0
export function delBindPermission(data: any) {
  return request(MANAGEMENT + '/access/permission/unbindAccessUserPermission', {
    method: 'DELETE',
    data,
  })
}

//门禁权限设备修改人员 V1.1.0
export function updateUserPermission(data: any) {
  return request(MANAGEMENT + '/access/permission/updateAccessUserPermission', {
    method: 'PUT',
    data,
  })
}

/**
 * 分页获取所有主机列表
 * @param {*} data
 * @param {*} data.pageIndex 页码
 * @param {*} data.pageCount 页数
 */
export function getAllHostList(data: any) {
  return request<{ count: number; results: AllHostList[] }>(
    BIG_DATA_SERVICE + '/bigdata/hostmodule/getHostListByPage',
    {
      method: 'POST',
      data,
    }
  )
}

//获取所有开发商相关区域 社区
export function queryDeveloperRegions() {
  return request(SUMMARY + '/nbregion/getAllDeveloperBuildings')
}

//获取主机版本分布
export function getHostDistribution(data?: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/hostmodule/getHostSoftwareInfo', {
    method: 'GET',
    params: {
      ...data,
    },
  })
}

//导出主机列表
export function exportExce(data: any) {
  downFile(BIG_DATA_SERVICE + `/bigdata/hostmodule/exportExce?${stringify(data)}`)
}

//导出用户数据
export function exportUserExce(id: any) {
  downFile(MANAGEMENT + `/access/permission/allPermission/export?buildingId=${id}`)
}

//获取app日打开次数
export function getAPPOpenCountOnceDay(params: any) {
  return request(BIG_DATA_SERVICE + '/bigdata/usermodule/getAppTodayLaunchTimes', {
    method: 'GET',
    params,
  })
}

//根据token校验登陆
export function checkToken() {
  return request(MANAGEMENT + `/bigdata/staffs/by_token`)
}

//批量上传人员信息
export function updatePeopleList(buildingId: any, file: any) {
  const formData = new FormData()
  formData.append('file', file)
  return request(MANAGEMENT + `/home_user/${buildingId}/import`, {
    method: 'POST',
    data: formData,
  })
}

//下载模版
export function downloadSample() {
  downFile('https://nb-ai-community.oss-cn-hangzhou.aliyuncs.com/业主数据导入模板.xlsx')
}

//====================================智慧工地=====================================

//获取历史回溯照片
export function getHistoryBackPhotos(params: any) {
  return request(SMART_SITE + '/buildingCamera/photos', {
    method: 'GET',
    params,
  })
}

//项目管理信息列表
export function getProjectManagerList(params: any) {
  return request(SMART_SITE + '/pm/query', {
    method: 'GET',
    params,
  })
}

//项目管理信息保存
export function saveProjectManager(data: any) {
  return request(SMART_SITE + '/pm/save', {
    method: 'PUT',
    data,
  })
}

//项目管理信息更新
export function updateProjectManager(data: any) {
  return request(SMART_SITE + '/pm/update', {
    method: 'PUT',
    data,
  })
}

//项目管理信息删除
export function delProjectManager(id: any) {
  return request(SMART_SITE + `/pm/delete/${id}`, {
    method: 'DELETE',
  })
}

//档案类型信息列表
export function getArchivesTypeList(params: any) {
  return request(SMART_SITE + '/archivesType/query', {
    method: 'GET',
    params,
  })
}

//档案信息列表
export function getDigitalRecordList(params: any) {
  return request(SMART_SITE + '/archives/query', {
    method: 'GET',
    params,
  })
}

//档案信息保存
export function saveDigitalRecord(data: any) {
  return request(SMART_SITE + '/archives/save', {
    method: 'PUT',
    data,
  })
}

//档案信息更新
export function updateDigitalRecord(data: any) {
  return request(SMART_SITE + '/archives/update', {
    method: 'PUT',
    data,
  })
}

//档案信息删除
export function delDigitalRecord(id: any) {
  return request(SMART_SITE + `/archives/delete/${id}`, {
    method: 'DELETE',
  })
}

//下载图片
export function downloadPhoto(data: any) {
  downFile(data)
}

//重要工作信息列表
export function getImportWorkList(params: any) {
  return request(SMART_SITE + '/importWork/query', {
    method: 'GET',
    params,
  })
}

//重要工作信息查看
export function getImportWorkInfo(params: any) {
  return request(SMART_SITE + '/importWork/get', {
    method: 'GET',
    params,
  })
}

//重要工作信息保存
export function saveImportWork(data: any) {
  return request(SMART_SITE + '/importWork/save', {
    method: 'PUT',
    data,
  })
}

//重要工作信息更新
export function updateImportWork(data: any) {
  return request(SMART_SITE + '/importWork/update', {
    method: 'PUT',
    data,
  })
}

//重要工作信息删除
export function delImportWork(id: any) {
  return request(SMART_SITE + `/importWork/delete/${id}`, {
    method: 'DELETE',
  })
}

//施工管理信息分页列表
export function getBuildProgressList(params: any) {
  return request(SMART_SITE + '/cm/query', {
    method: 'GET',
    params,
  })
}

//施工管理信息保存
export function saveBuildProgress(data: any) {
  return request(SMART_SITE + '/cm/save', {
    method: 'PUT',
    data,
  })
}

//施工管理信息更新
export function updateBuildProgress(data: any) {
  return request(SMART_SITE + '/cm/update', {
    method: 'PUT',
    data,
  })
}

//施工管理信息删除
export function delBuildProgress(id: any) {
  return request(SMART_SITE + `/cm/delete/${id}`, {
    method: 'DELETE',
  })
}

//施工节点信息列表
export function getBuildNode(params: any) {
  return request(SMART_SITE + '/cn/list', {
    method: 'GET',
    params,
  })
}

//施工节点信息保存
export function saveBuildNode(data: any) {
  return request(SMART_SITE + '/cn/save', {
    method: 'PUT',
    data,
  })
}

//施工节点信息更新
export function updateBuildNode(data: any) {
  return request(SMART_SITE + '/cn/update', {
    method: 'PUT',
    data,
  })
}

//施工节点信息删除
export function delBuildNode(id: any) {
  return request(SMART_SITE + `/cn/delete/${id}`, {
    method: 'DELETE',
  })
}
//工艺信息保存
export function saveTechnology(data: any) {
  return request(SMART_SITE + `/technology/save`, {
    method: 'POST',
    data,
    headers: {
      autoDeveloperID: '0',
    },
  })
}

//工艺信息删除
export function deleteTechnology(id: any) {
  return request(SMART_SITE + `/technology/delete/${id}`, {
    method: 'DELETE',
    headers: {
      autoDeveloperID: '0',
    },
  })
}

//工艺信息查看
export function getTechnology(id: any) {
  return request(SMART_SITE + `/technology/get?id=${id}`, {
    method: 'GET',
  })
}

//工艺信息更新
export function updateTechnology(data: any) {
  return request(SMART_SITE + `/technology/update`, {
    method: 'POST',
    data,
  })
}
//工艺图片点位批量保存
export function saveTechnologyPoints(id: any, data: any) {
  return request(SMART_SITE + `/technology/position/batch/${id}`, {
    method: 'POST',
    data,
  })
}
//工艺信息分页列表
export function technologyQuery(params: any) {
  return request(SMART_SITE + `/technology/query`, {
    method: 'GET',
    params,
  })
}

//工艺信息列表
export function technologyList(params: any) {
  return request(SMART_SITE + `/technology/list?`, {
    method: 'GET',
    params,
  })
}

//工艺内容信息分页列表
export function queryTechnologyContent(params: any) {
  return request(SMART_SITE + `/technologyContent/query`, {
    params,
    method: 'GET',
  })
}

//工艺内容信息列表
export function technologyContentList(params: any) {
  return request(SMART_SITE + `/technologyContent/list`, {
    params,
    method: 'GET',
  })
}

//工艺内容信息保存
export function saveTechnologyContent(data: any) {
  return request(SMART_SITE + `/technologyContent/save`, {
    data,
    method: 'POST',
    headers: {
      autoDeveloperID: '0',
    },
  })
}
//工艺内容信息删除
export function deleteTechnologyContent(id: any) {
  return request(SMART_SITE + `/technologyContent/delete/${id}`, {
    method: 'DELETE',
    headers: {
      autoDeveloperID: '0',
    },
  })
}

//工艺内容信息修改
export function updateTechnologyContent(data: any) {
  return request(SMART_SITE + `/technologyContent/update`, {
    method: 'POST',
    data,
  })
}

//工艺内容信息查看
export function getTechnologyContent(id: any) {
  return request(SMART_SITE + `/technologyContent/get?id=${id}`, {
    method: 'GET',
  })
}

//重要工作信息列表
export function getWorkList(params: any) {
  return request(SMART_SITE + `/importWork/query`, {
    method: 'GET',
    params,
  })
}

//亮点信息查看
export function getLightTechnology(id: any) {
  return request(SMART_SITE + `/technology/highlight/get?buildingId=${id}`, {
    method: 'GET',
  })
}

//重要节点信息列表
export function getConstructionNode(params: any) {
  return request(SMART_SITE + `/buildingCamera/constructionNode/list`, {
    method: 'GET',
    params,
  })
}
//获取oss配置
export const getOssConfig = () => {
  return request(MANAGEMENT + `/plat/files/get/oss/secret`, {
    method: 'GET',
  })
}

//查询接收消息记录
export function getSelectMessage(data: any) {
  return request(HOST_SERVICE + `/message/general/pages`, {
    method: 'GET',
    params: {
      ...data,
    },
  })
}

//根据记录id更新消息已读状态
export function unreadRecord(data: any) {
  return request(HOST_SERVICE + `/message/updateRead`, {
    method: 'POST',
    data,
  })
}

//所有消息改为已读
export function unreadAll(data: any) {
  return request(HOST_SERVICE + `/message/general/readAll`, {
    method: 'POST',
    params: {
      ...data,
    },
  })
}

//查询下发失败记录
export function searchFailedRecord(data: any) {
  return request(MANAGEMENT + `/access/permission/issuedFailedRecordOfPage`, {
    method: 'GET',
    params: {
      ...data,
    },
  })
}

//获取设备
export function getDeviceList(data: any) {
  return request(MANAGEMENT + `/doorDevice/list`, {
    method: 'GET',
    params: {
      ...data,
    },
  })
}

//更新指定用户已绑定的权限信息
export function updatePersonPermission(data: any) {
  return request(MANAGEMENT + `/access/permission/updatePersonPermission`, {
    method: 'POST',
    params: {
      ...data,
    },
  })
}

//获取树杈楼栋-单元-房间 V1.1.0
export function buildingBlockUnit(id: any) {
  return request(MANAGEMENT + `/blocks/${id}/buildingBlockUnit`)
}

//访客邀约记录 V2.7.0
export function queryInvitationRecords(params: any) {
  return request(MANAGEMENT + `/invitation-records`, {
    method: 'GET',
    params,
  })
}
//获取用户报修信息
export function queryInConnect(params: any) {
  return request(HOST_SERVICE + '/userRepair/select', {
    method: 'GET',
    params,
  })
}
//通知消息详情
export function queryRepairById(data: any) {
  return request(HOST_SERVICE + `/userRepair/selectHostUserRepairInfoByIds?repairIds=${data}`, {
    method: 'GET',
  })
}
//获取商品列表
export function queryMerchandise(params: any) {
  return request(MANAGEMENT + `/nbGoods`, {
    method: 'GET',
    params,
  })
}
//新增商品
export function addMerchandise(data: any) {
  return request(MANAGEMENT + `/nbGoods`, {
    method: 'POST',
    data,
  })
}
//编辑商品
export function putMerchandise(data: any) {
  return request(MANAGEMENT + `/nbGoods`, {
    method: 'PUT',
    data,
  })
}
//获取商品-社区展示
export function querycommunity(params: any) {
  return request(MANAGEMENT + `/nbuilding/select`, {
    method: 'GET',
    params,
  })
}
//删除商品
export function deleMerchandise(id: any) {
  return request(MANAGEMENT + `/nbGoods`, {
    method: 'DELETE',
    params: {
      id: id,
    },
  })
}
//获取商品列表
export function queryIDMerchandise(params: any) {
  return request(MANAGEMENT + `/nbGoods/getByGoodsId/${params}`, {
    method: 'GET',
  })
}
//下/上架商品列表
export function updaMerchandise(data: any) {
  return request(MANAGEMENT + `/nbGoods`, {
    method: 'PUT',
    data,
  })
}

//订单管理列表
export function queryOrder(params?: any) {
  return request(MANAGEMENT + `/nbGoodsOrder/list`, {
    method: 'GET',
    params,
  })
}
//订单管理详情退款
export function refundOrder(params?: any) {
  return request(MANAGEMENT + `/shouqian/refund/${params.orderId}?remark=${params.remark}`, {
    method: 'POST',
  })
}
//获取订单管理列表详情
export function querytetail(params?: any) {
  return request(MANAGEMENT + `/nbGoodsOrder/getByOrderId/${params}`, {
    method: 'GET',
  })
}
//获取报表管理列表
export function queryRexportExce(params?: any) {
  return request(MANAGEMENT + `/nbGoodsStatement/list`, {
    method: 'GET',
    params,
  })
}

//导出报表管理
export function reportRexportExce(data: any) {
  downFile(MANAGEMENT + `/nbGoodsStatement/export?${stringify(data)}`)
}
//2022/5/16
//报修数据统计
export function queryRepairStatistics(params?: any) {
  return request(MANAGEMENT + `/statistic/statistic`, {
    method: 'GET',
    params,
  })
}

//入住率统计
export function queryHomeStatistics(params?: any) {
  return request(MANAGEMENT + `/statistic/home`, {
    method: 'GET',
    params,
  })
}

//待办审核事项统计
export function queryToDoAudit(params?: any) {
  return request(MANAGEMENT + `/statistic/todo-audit`, {
    method: 'GET',
    params,
  })
}

//云对讲设备在线率统计
export function queryDeviceStatistics(params?: any) {
  return request(MANAGEMENT + `/statistic/device`, {
    method: 'GET',
    params,
  })
}

//开门数量统计
export function queryOpenDoorStatistics(params?: any) {
  return request(MANAGEMENT + `/statistic/open-door`, {
    method: 'GET',
    params,
  })
}

//获取分时数据
export function getHourData(params: any) {
  return request(BIG_DATA_SERVICE + `/bigdata/usermodule/InstructionCountByTodayHour`, {
    method: 'GET',
    params,
  })
}

//室内机管理
export function getMachines(params?:any){
  return request(MANAGEMENT + `/indoor-machines/list`, {
    method: 'GET',
    params,
  })
}

//室内机解绑
export function delMachines(id:Number){
  return request(MANAGEMENT + `/indoor-machines/${id}`, {
    method: 'DELETE',
  })
}