import { defineConfig } from 'umi'
import packageJSON from './package.json'

export default defineConfig({
  title: false,
  antd: {},
  outputPath: packageJSON.name,
  dva: {
    hmr: true, // 启用 dva model 的热更新
    immer: true,
  },
  ignoreMomentLocale: true,
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  define: {
    VERSION: packageJSON.version + (process.env.DEPLOY_ENV ? `-${process.env.DEPLOY_ENV}` : ''),
    SERVER_IP: 'test-api.newbest.com.cn',
    WEBSOCKET_URL: 'wss://test-api.newbest.com.cn',
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  hash: true,
  routes: [
    {
      path: '/user',
      routes: [
        {
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/dashboard/console',
      component: '@/pages/dashboard/Console',
      //component: '@/pages/ConstructionSite/Dashboard/index',
    },
    {
      path: '/construction-site/dashboard',
      component: '@/pages/ConstructionSite/Dashboard/index',
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout/index',
      routes: [
        {
          path: '/dashboard/workbench',
          component: '@/pages/dashboard/Workbench',
        },
        {
          path: '/dashboard/todayPanel',
          component: '@/pages/dashboard/TodayPanel',
        },
        {
          path: '/account-management/user',
          component: '@/pages/accountManagement/account/index',
        },
        {
          path: '/account-management/role',
          component: '@/pages/accountManagement/role/index',
        },
        {
          path: '/account-management/personal',
          component: '@/pages/accountManagement/personal/index',
        },
        {
          path: '/system-setting/equipment-configuration',
          component: '@/pages/systemSetting/building/equipmentConfiguration',
        },
        {
          path: '/system-setting/region',
          component: '@/pages/systemSetting/region/index',
        },
        {
          path: '/system-setting/building',
          component: '@/pages/systemSetting/building/index',
        },
        {
          path: '/system-setting/building/buildingSetting/:id',
          component: '@/pages/systemSetting/building/buildingSetting',
        },
        {
          path: '/system-setting/building/houseSetting/:id',
          component: '@/pages/systemSetting/building/houseSetting',
        },
        {
          path: '/host-management/project/list/:id',
          component: '@/pages/hostManagement/smartHome/projectDetail',
        },
        {
          path: '/host-management/host/list/:id',
          component: '@/pages/hostManagement/smartHome/roomDetail',
        },
        { path: '/host-management', redirect: '/dashboard' },
        // {
        //   path: '/host-management/dashboard',
        //   component: '@/pages/hostManagement/operationalData/HostData.js',
        // },
        // {
        //   path: '/host-management/projectLog',
        //   component: '@/pages/hostManagement/engineeringLog/index',
        // },
        // {
        //   path: '/host-management/project/list',
        //   component: '@/pages/hostManagement/smartHome/index',
        //   exact: true,
        // },
        {
          path: '/host-management/host/list',
          component: '@/pages/hostManagement/smartHost/index',
          exact: true,
        },
        // {
        //   path: '/parking-management/dashboard',
        //   component: '@/pages/parkingManagement/dashboard/MonitorData',
        // },

        {
          path: '/parking-management/camera-project/list/realtime/:id',
          component: '@/pages/parkingManagement/cameraProject/parkingCamera',
        },

        {
          path: '/information-delivery/material/list/:id',
          component: '@/pages/informationDelivery/material/EditNews',
        },

        {
          path: '/information-delivery/banner/list/:id',
          component: '@/pages/informationDelivery/material/EditBanner',
        },
        {
          path: '/information-delivery/material/list',
          component: '@/pages/informationDelivery/material/News',
          exact: true,
        },
        {
          path: '/information-delivery/banner/list',
          component: '@/pages/informationDelivery/material/BannerList',
          exact: true,
        },
        {
          path: '/information-delivery/messagePush',
          component: '@/pages/informationDelivery/messagePush',
        },

        {
          path: '/parking-management/camera-project/list',
          component: '@/pages/parkingManagement/cameraProject/parkingDetail',
          exact: true,
        },

        {
          path: '/operate-management/user/list/:id',
          component: '@/pages/operateManagement/user/userDetail',
        },
        { path: '/operate-management/', redirect: '/user-data' },
        {
          path: '/operate-management/user-data',
          component: '@/pages/operateManagement/userData/UserData',
        },
        {
          path: '/operate-management/user/list',
          component: '@/pages/operateManagement/user/userList',
          exact: true,
        },
        {
          path: '/cloud-intercom/cardManagement',
          component: '@/pages/cloudIntercom/cardManagement/index',
        },
        {
          path: '/cloud-intercom/visitorManagement',
          component: '@/pages/cloudIntercom/visitorManagement/index',
        },
        {
          path: '/cloud-intercom/accessControlManagement',
          component: '@/pages/cloudIntercom/accessControlManagement/index',
        },
        {
          path: '/cloud-intercom/openDoorEventManagement',
          component: '@/pages/cloudIntercom/openDoorEventManagement/index',
        },
        {
          path: '/cloud-intercom/intercomLogManagement',
          component: '@/pages/cloudIntercom/intercomLogManagement/index',
        },
        {
          path: '/cloud-intercom/indoorManagement',
          component: '@/pages/cloudIntercom/indoorManagement/index',
        },
        {
          path: '/property-management/housingAudit',
          component: '@/pages/propertyManagement/houseReview/index',
        },
        {
          path: '/property-management/ownerInformation',
          component: '@/pages/propertyManagement/owner/index',
        },
        {
          path: '/property-management/propertyRepair',
          component: '@/pages/propertyManagement/propertyRepair/index',
        },
        {
          path: '/property-management/record/:id',
          component: '@/pages/propertyManagement/propertyRepair/RepairDetail',
        },
        // {
        //   path: '/property-management/feedback',
        //   component: '@/pages/propertyManagement/feedback',
        // },
        {
          path: '/property-management/owner',
          component: '@/pages/propertyManagement/owner/index',
        },
        {
          path: '/property-management/houseReview',
          component: '@/pages/propertyManagement/houseReview/index',
        },
        {
          path: '/construction-site/technologyManagement',
          component: '@/pages/ConstructionSite/technologyManagement/index',
        },
        {
          path: '/construction-site/technologyManagement/edit/:companyId/:technologyId',
          component: '@/pages/ConstructionSite/technologyManagement/edit',
        },
        {
          path:
            '/construction-site/technologyManagement/technologyManage/:companyId/:primaryTechnologyId',
          component: '@/pages/ConstructionSite/technologyManagement/technologyManage',
        },
        {
          path: '/construction-site/digitalRecord',
          component: '@/pages/ConstructionSite/digitalRecord/index',
        },
        {
          path: '/construction-site/technologyManagement/highLightEdit',
          component: '@/pages/ConstructionSite/technologyManagement/highLightEdit',
        },
        {
          path: '/construction-site/technologyManagement/highLightManage/:companyId/:id',
          component: '@/pages/ConstructionSite/technologyManagement/highLightManage',
        },
        {
          path: '/construction-site/projectManagement',
          component: '@/pages/ConstructionSite/projectManagement/index',
        },
        {
          path: '/construction-site/buildProgressManagement',
          component: '@/pages/ConstructionSite/buildProgressManagement/index',
        },
        {
          path: '/construction-site/importantWorkManagement',
          component: '@/pages/ConstructionSite/importantWorkManagement/index',
        },
        {
          path: '/construction-site/importantWorkManagement/create',
          component: '@/pages/ConstructionSite/importantWorkManagement/createImportantWork',
        },
        {
          path: '/commodityManagement/listOfMerchandise',
          component: '@/pages/commodityManagement/listOfMerchandise/index',
        },
        {
          path: '/commodityManagement/listOfMerchandise/:id',
          component: '@/pages/commodityManagement/addMerchandise/index',
        },
        {
          path: '/commodityManagement/listOfMerchandise/',
          component: '@/pages/commodityManagement/addMerchandise/index',
        },
        {
          path: '/orderManagement/listOfOrder',
          component: '@/pages/orderManagement/listOfOrder/index',
        },
        {
          path: '/orderManagement/listOfOrder/:id',
          component: '@/pages/orderManagement/detailsOrder/index',
        },
        {
          path: '/reportManagement/reportManagements',
          component: '@/pages/reportManagement/reportManagements/index',
        },
      ],
    },
  ],
})
