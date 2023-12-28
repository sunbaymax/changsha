<!--  -->
<template>
  <div class="main">
    <!-- B 顶部菜单 -->
    <div
      class="header"
      :style="isCollapse==false?'box-shadow:1.389rem 4px 5px #F3F3F3':'box-shadow:0.383rem 2px 4px #F3F3F3'"
    >
      <div class="logo" v-if="!isCollapse">
        <span class="big">海鲜租赁市场计费系统</span>
        <span class="min">
          <img src="../../assets/images/logo.svg" />
        </span>
      </div>
      <div class="tapopen" @click="openclose" v-else>
        <i class="el-icon-s-unfold biaozhu"></i>
      </div>
      <!-- <div class="search">
        <el-input placeholder="请输入内容" v-model="searchval">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>-->

      <div class="topbar">
        <i class="el-icon-s-fold biaozhu" v-if="!isCollapse" @click="openclose"></i>
      </div>

      <div class="header-right">
        <span class="header-btn" @click="screenfullToggle" title="全屏">
          <i class="fa fa-arrows-alt"></i>
        </span>

        <el-dropdown trigger="click">
          <span class="header-btn">
            <i class="el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="setting-category">
              <el-switch
                v-model="switchTabBar"
                @click="saveSwitchTabBar"
                active-text="开启TabBar"
                inactive-text="关闭TabBar"
              ></el-switch>
              <el-switch
                v-model="fixedTabBar"
                v-if="switchTabBar"
                class="fixedTabBar"
                @click="saveFixedTabBar"
                active-text="固定在顶部"
                inactive-text="随页面滚动"
              ></el-switch>
            </div>
          </el-dropdown-menu>
        </el-dropdown>

        <span class="header-btn">
          <el-badge :value="0">
            <i class="el-icon-bell"></i>
          </el-badge>
          <img src="../../assets/images/img/touxiang.png" class="touxiang" alt />
          <label class="username">{{sysUserName}}</label>
          <i class="el-icon-switch-button" @click="logout"></i>
        </span>
      </div>
    </div>
    <!-- E 顶部菜单 -->

    <div class="app">
      <div class="aside">
        <div class="menu">
          <el-menu
            router
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            background-color="#4A7FF8"
            active-text-color="#ffffff"
            text-color="#f9f9f9"
            :collapse-transition="true"
            :default-active="$route.path"
            :unique-opened="true"
          >
            <template v-for="(menu_v,menu_k) in menu">
              <el-submenu v-if="menu_v.children" :index="menu_k" :key="menu_k">
                <template slot="title">
                  <i :class="menu_v.icon"></i>
                  <span>{{menu_v.name}}</span>
                </template>

                <el-menu-item
                  v-for="(menuChildren_v,menuChildren_k) in menu_v.children"
                  :key="menuChildren_k"
                  :index="menuChildren_v.path"
                  style="padding-left:0.15rem;font-size:0.08333rem"
                >
                  <i class="is-children fa fa-circle-o"></i>
                  <span>{{menuChildren_v.name}}</span>
                </el-menu-item>
              </el-submenu>

              <el-menu-item
                v-else
                :index="menu_v.path"
                :key="menu_v.path"
                style="padding-left:0.104rem"
              >
                <i :class="menu_v.icon"></i>
                <span>{{menu_v.name}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
      <div
        class="app-body"
        :style="isCollapse==false?'margin-left: 1.359rem':'margin-left:0.34rem'"
      >
        <div id="nav-bar" v-if="switchTabBar" :style="fixedTabBar?'position: fixed':''">
          <NavBar></NavBar>
        </div>
        <div v-else style="margin-top:0.3906rem;"></div>
        <div id="mainContainer" :style="switchTabBar&&fixedTabBar?'padding-top: 0.6095rem':''">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

import Menu from "@/menu/index";
import Screenfull from "screenfull";
import NavBar from "./NavBar.vue";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    NavBar
  },
  data() {
    //这里存放数据
    return {
      menu: Menu,
      isCollapse: false,
      switchTabBar: true,
      fixedTabBar: false, //true
      sysUserName: "",
      searchval: ""
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    openclose() {
      this.isCollapse = !this.isCollapse;
    },
    NavBarWidth() {},

    // 全屏
    screenfullToggle() {
      if (!Screenfull.enabled) {
        this.$message({
          message: "你的浏览器不支持全屏!",
          type: "warning"
        });
        return false;
      }
      Screenfull.toggle();
    },

    saveSwitchTabBar(v) {
      v
        ? localStorage.setItem("switchTabBar", v)
        : localStorage.removeItem("switchTabBar");
    },

    saveFixedTabBar(v) {
      v
        ? localStorage.setItem("fixedTabBar", v)
        : localStorage.removeItem("fixedTabBar");
    },

    // 退出
    logout() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        //type: 'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("area");
          this.$store.commit("shops/CITY_INFO", { area: "" ,curshop:''});
          _this.$router.push("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.switchTabBar = localStorage.getItem("switchTabBar") ? true : false;
    this.fixedTabBar = localStorage.getItem("fixedTabBar") ? true : false;
    var user = sessionStorage.getItem("user");
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.name || "" || user.username;
    }
  },
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  beforeMount() {},
  //生命周期 - 更新之前
  beforeUpdate() {},
  //生命周期 - 更新之后
  updated() {},
  //生命周期 - 销毁之前
  beforeDestroy() {},
  //生命周期 - 销毁完成
  destroyed() {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
};
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 1.359rem;
 
}
.menu  .el-submenu__title{
  padding-left: 0.104rem!important;
  font-size: 18px;
}
.menu .el-menu-item {
  
font-size: 18px;
}
</style>
<style scoped>
/* @import url(); 引入公共css类 */
.main {
  display: flex;
  height: 100%;
}
.header {
  width: 100%;
  position: fixed;
  height: 0.3906rem;
  background-color: #ffffff;
  z-index: 10;
  display: flex;
}

.header .logo {
  /* background: #367fa9; */
  display: inline-block;
  width: 260px;
  height: 0.3906rem;
  text-align: center;
  overflow: hidden;
  line-height: 0.3906rem;
  font-size: 22px;
  font-weight: bold;
  color: #333333;
  background: #ffffff;
  -webkit-transition: width 0.35s;
  transition: all 0.3s ease-in-out;
}
.header-btn .username {
  margin: 0px 10px 0 10px;
  /* background: chartreuse; */
}
.header-btn .touxiang {
  /* margin-top: 12px; */
  margin: 17px 0px 0 30px;
  display: inline-block;
  width: 40px;
  height: 40px;
}
/* .header .logo .big {
  display: block;
} */
.header .logo .min {
  display: none;
}
.header .topbar {
  display: flex;
  align-items: center;
}
.header .biaozhu {
  /* padding-left: 5px; */
  font-size: 20px;
  color: #1b1b1b !important;
}
.header .logo .min img {
  width: 40px;
  margin-top: 5px;
}
.header .header-btn {
  overflow: hidden;
  height: 0.3906rem;
  display: inline-block;
  text-align: center;
  line-height: 0.3906rem;
  cursor: pointer;
  padding: 0 14px;
  color: #1b1b1b;
  font-size: 20px;
}
/* .header .header-btn:hover {
  background-color: #367fa9;
} */
.header .header-right {
  position: absolute;
  right: 0;
}
.header .tapopen {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 100%;
  background: url("~@/assets/images/img/menubg.png") no-repeat;
  background-size: 100% 100%;
}
.touxiang {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.app {
  width: 100%;
}

.app .aside {
  margin-top: 0.3906rem;
  background: url("~@/assets/images/img/menubg.png") no-repeat;
  background-size: 100% 100%;
  background-attachment: inherit;
  position: fixed;
  transition: all 0.3s ease-in-out;
}
.app .aside .menu {
  overflow-y: auto;
  height: calc(100vh - 0.3906rem);
}
.app .app-body {
  height: 100%;
  -webkit-transition: margin-left 0.3s ease-in-out;
  transition: margin-left 0.3s ease-in-out;
}


.el-menu {
  border-right: none;
  background: url("~@/assets/images/img/menubg.png") no-repeat;
  background-size: 100% 100%;
}

.el-menu i.fa {
  width: 24px;
  text-align: center;
}

.menu .el-menu-item i {
  color: #fff !important;
}
.el-submenu__title i {
  color: #fff !important;
}
.tapopen .el-icon-s-unfold {
  color: #fff !important;
}
.header-btn >>> .el-badge__content {
  top: 0.15rem;
  border: 0;
  background-color: #00a65a;
}

.setting-category {
  padding: 10px;
  text-align: center;
  width: 330px;
}

/* 导航条 */
.fixedTabBar {
  margin-top: 10px;
}
#nav-bar {
  margin-top: 0.406rem;
  height: 40px;
  width: 100%;
  background-color: #fff;
  z-index: 99;
}

#mainContainer {
  height: 100%;
  padding-top: 5px;
  background-color: #fcf9fc;
  -webkit-transition: width 0.35s;
  transition: all 0.3s ease-in-out;
}
</style>