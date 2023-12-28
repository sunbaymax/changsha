import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/login',
      component: resolve => require(['@/views/login/index.vue'], resolve),
    },
    {
      path: '/',
      component: resolve => require(['@/views/layout/App.vue'], resolve),
      meta: {
        title: '首页',
        keepAlive: false, // 不需要缓存
      },
      children: [{
          path: '/',
          name: 'Dashboard',
          meta: {
            title: '首页',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/home/Index.vue'], resolve),
        },
        {
          path: '/paylist',
          name: 'Paylist',
          meta: {
            title: '设备管理',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/paylist/index.vue'], resolve),
        },
        {
          path: '/monitor',
          name: 'Monitor',
          meta: {
            title: '实时监控',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/monitor/index.vue'], resolve),
        },
        {
          path: '/datareport',
          name: 'Datareport',
          meta: {
            title: '数据报表',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/datareport/index.vue'], resolve),
        },
       
        {
          path: '/systemset',
          name: 'Systemset',
          meta: {
            title: '系统设置',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/systemset/index.vue'], resolve),
        },
        {
          path: '/storeinfo/:id',
          name: 'Storeinfo',
          meta: {
            title: '海鲜池监控',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/storeinfo/index.vue'], resolve),
        },
        {
          path: '/usercenter/',
          name: 'Usercenter',
          meta: {
            title: '用户管理',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/systemset/usercenter/index.vue'], resolve),
        },
        {
          path: '/historypaylist/',
          name: 'Historypaylist',
          meta: {
            title: '历史充值',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/historypaylist/index.vue'], resolve),
        },
        {
          path: '/historydata/',
          name: 'Historydata',
          meta: {
            title: '历史数据',
            keepAlive: true // 需要被缓存
          },
          component: resolve => require(['@/views/historydata/index.vue'], resolve),
        },
        {
          path: '/charts_line',
          name: 'Line',
          meta: {
            title: '折线图',
            keepAlive: false
          },
          component: resolve => require(['@/views/charts/Line.vue'], resolve),
        },
        {
          path: '/charts_bar',
          name: 'Bar',
          meta: {
            title: '柱状图',
            keepAlive: false
          },
          component: resolve => require(['@/views/charts/Bar.vue'], resolve),
        },
        {
          path: '/font_awesome',
          name: 'FontAwesome',
          meta: {
            title: 'FontAwesome 图标',
            keepAlive: false
          },
          component: resolve => require(['@/views/icon/FontAwesome.vue'], resolve),
        },
        {
          path: '/element_icon',
          name: 'ElementIcon',
          meta: {
            title: 'Element 图标',
            keepAlive: false
          },
          component: resolve => require(['@/views/icon/ElementIcon.vue'], resolve),
        },
        {
          path: '/map_baidu:id',
          name: 'Baidu',
          meta: {
            title: '百度地图',
            keepAlive: false
          },
          component: resolve => require(['@/views/map/Baidu.vue'], resolve),
        },
        {
          path: '/table_manage',
          name: 'Table',
          meta: {
            title: '表格',
            keepAlive: false
          },
          component: resolve => require(['@/views/tableManage/Index.vue'], resolve),
        },
        /* 
                {
                  path: '/user_manage',
                  name: 'UserManage',
                  meta: {
                    title: '用户列表',
                    keepAlive: true
                  },
                  component: resolve => require(['@/views/userManage/Index.vue'], resolve),
                },
                 */

      ]
    }
  ]
})
