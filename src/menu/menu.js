let menu = {};


/*
首页
 @type {{name: string, path: string, icon: string}}
 */
menu.home = {
  name: '后台首页',
  path: '/',
  icon: 'el-icon-s-home',
}
menu.jiankong = {
  name: '实时监控',
  path: '/monitor',
  icon: 'el-icon-odometer',
}
menu.paylist = {
  name: '设备管理',
  path: '/paylist',
  icon: 'el-icon-s-marketing',
}
menu.datareport = {
  name: '数据报表',
  children: {},
  icon: 'el-icon-s-data',
}
let datareport = menu.datareport.children;
datareport.historypaylist = {
  name: '历史充值',
  path: '/historypaylist'
};
datareport.historydata = {
  name: '历史数据',
  path: '/historydata'
};
menu.systemset = {
  name: '系统设置',
  children: {},
  icon: 'el-icon-s-tools',
}
let systemset = menu.systemset.children;
systemset.line = {
  name: '用户管理',
  path: '/usercenter'
};

/* 
Charts
@type {{name: string, icon: string, children: {}}}
*/
// menu.charts = {
//   name: '所有工程',
//   icon: 'el-icon-share',
//   children: {}
// }
// let charts = menu.charts.children;
// charts.line = {
//   name: '折线图',
//   path: '/charts_line'
// };
// charts.font_awesome = {
//   name: 'FontAwesome',
//   path: '/font_awesome'
// };
// charts.element_icon = {
//   name: 'ElementIcon',
//   path: '/element_icon',
// }


/* 
map
@type {{name: string, icon: string, children: {}}}
*/
// menu.map = {
//   name: '所有监控',
//   icon: 'fa fa-wpexplorer',
//   children: {}
// }
// let map = menu.map.children;
// map.baidu = {
//   name: '中集智冷',
//   path: '/map_baidu3'
// };
// map.nuohe = {
//   name: '诺和制源',
//   path: '/map_baidu1'
// };
// map.zhileng = {
//   name: '百度地图',
//   path: '/map_baidu2'
// };

/* 
字体图标
@type {{name: string, icon: string, children: {}}}
*/
// menu.font_icon = {
//   name: '字体图标',
//   icon: 'fa fa-th',
//   children: {}
// };
// let icon = menu.font_icon.children;
// icon.font_awesome = {
//   name: 'FontAwesome 4.7',
//   path: '/font_awesome'
// };
// icon.element_icon = {
//   name: 'ElementIcon',
//   path: '/element_icon',
// }

/* 
内容管理
@type {{name: string, icon: string, children: {}}}
*/
// menu.content_manage = {
//   name: '表格',
//   icon: 'fa fa-file-text-o',
//   children: {}
// }
// let ContentManage = menu.content_manage.children;
// ContentManage.post = {
//   name: '表格1',
//   path: '/table_manage',
// }

/**
 * 用户管理
 * @type {{name: string, icon: string, children: {}}}

menu.user_manage = {
  name: '用户管理',
  icon: 'fa fa-user-circle-o',
  children: {}
};
let UserManage = menu.user_manage.children;
UserManage.user = {
  name: '用户列表',
  path: '/user_manage',
};
 */
export default menu;
