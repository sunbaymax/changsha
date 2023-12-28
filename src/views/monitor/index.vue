<!--  -->
<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/monitor' }">实时监控</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="topitem">
      <!-- <h4>选项卡展示</h4> -->
      <data-tabs :option="easyDataOption"></data-tabs>
    </div>
    <div class="itemcenter" :gutter="20">
      <el-tabs tab-position="left" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="item" :name="item"  v-for="(item,index) in pusharea" :key="index">
          <el-row>
            <el-col :span="6" v-for="(item,index) in storearr" :key="index">
              <div class="itemone" @click="handlestore(item.ipaddr,item.name)">
                <div class="storename">商铺{{item.name}}</div>
                <div class="storeshebei">
                  <p>{{item.linkman}}</p>
                  <p>{{item.phone}}</p>
                </div>
                <img class="state" src="@/assets/images/img/normalsign.png" v-if="item.runstatus=='在线'" alt />
                <img class="state" src="@/assets/images/img/s_diaoxian.png" v-else-if="item.runstatus=='离线'" alt />
                <img class="state" src="@/assets/images/img/warnings.png" v-else-if='item.temprwarn>0' alt />
                <img class="state" src="@/assets/images/img/warnings.png" v-else-if='item.failurewarn>0' alt />
                <img class="state" src="@/assets/images/img/warnings.png" v-else-if='item.excpwarn>0' alt />
                <img class="state" src="@/assets/images/img/normalsign.png" v-else alt />
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import DataDisplay from "@/components/data-display/data-display.vue";
import DataTabs from "@/components/data-tabs/data-tabs.vue";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: { DataDisplay, DataTabs },
  data() {
    //这里存放数据
    return {
      activeName: "",
      allarea: [],
      storearr: [], //商铺下的plc
      easyDataOption: {
        span: 8,
        gutter: 20,
        data: [
          {
            title: "正常运行",
            subtitle: "",
            count: 0,
             Height:'0.916rem',
            Width:'1.8rem',
            allcount: 2000,
            text: "当前记录数",
            color:
              "url(" +
              require("../../assets/images/img/zhengchangbg.png") +
              ")",
            key: "",
            percent: 0
          },
          {
            title: "状态异常",
            subtitle: "",
             Height:'0.916rem',
            Width:'1.8rem',
            count: 0,
            allcount: 10222,
            text: "当前故障数",
            color:
              "url(" + require("../../assets/images/img/yichangbg.png") + ")",
            key: "故",
            percent: 0
          },
          {
            title: "掉线",
            subtitle: "",
             Height:'0.916rem',
            Width:'1.8rem',
            count: 0,
            allcount: 10222,
            text: "评论次数",
            color:
              "url(" + require("../../assets/images/img/diaoxianbg.png") + ")",
            key: "评",
            percent: 0
          }
        ]
      },
      obj: {},
      gettime: "", //当前时间
      getcity: "", //当前城市
      getIp: "",
      getweatherifo: {}
    };
  },
  //监听属性 类似于data概念
  computed: {
    pusharea: function() {
       
       return this.allarea.filter(item=>
           item && item.trim() // 注：IE9(不包含IE9)以下的版本没有trim()方法
          );
      //  let arrs= this.allarea.filter(function (s) {
      //         return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
      //     });
       
    },
  },
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleClick(tab, event) {
      sessionStorage.setItem("area", tab.paneName);
      this.$store.commit("shops/CITY_INFO", { area: tab.paneName,curshop: "" });
      this.initstore(tab.paneName);
    },
    handlestore(id,name) {
      this.$store.commit("shops/CITY_INFO", { area:this.$store.state.shops.area,curshop: name });
      this.$router.push({
        path: `/storeinfo/${id}`
      });
    },
    init() {
      this.$axios
        .post("/getmonitordatas")
        .then(res => {
          console.log(res.data);
          this.$set(this.easyDataOption.data[0], "count", res.data.comnormal);
          let comnormalpertent =
            this.GetPercent(res.data.comnormal, res.data.devcounts) == 0
              ? 0
              : parseFloat(
                  this.GetPercent(
                    res.data.comnormal,
                    res.data.devcounts
                  ).toFixed(1)
                );
          if (res.data.comnormal != 0) {
            this.$set(this.easyDataOption.data[0], "percent", comnormalpertent);
          }
          this.$set(
            this.easyDataOption.data[1],
            "count",
            res.data.comexcpcount
          );
          let comexcpcountpertent =
            this.GetPercent(res.data.comexcpcount, res.data.devcounts) == 0
              ? 0
              : parseFloat(
                  this.GetPercent(
                    res.data.comexcpcount,
                    res.data.devcounts
                  ).toFixed(1)
                );
          if (res.data.comexcpcount != 0) {
            this.$set(
              this.easyDataOption.data[1],
              "percent",
              comexcpcountpertent
            );
          }
          this.$set(this.easyDataOption.data[2], "count", res.data.comunknown);
          let comunknownpertent =
            this.GetPercent(res.data.comunknown, res.data.devcounts) == 0
              ? 0
              : parseFloat(
                  this.GetPercent(
                    res.data.comunknown,
                    res.data.devcounts
                  ).toFixed(1)
                );
                console.log(comunknownpertent,6666)
          if (res.data.comunknown != 0) {
            this.$set(
              this.easyDataOption.data[2],
              "percent",
              comunknownpertent
            );
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initarea() {
      this.$axios
        .post("/getDevUserAreas")
        .then(res => {
        
          let cunzai=res.data.areas.filter(function (s) {
              return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
          });
        
       
          if(this.$store.state.shops.area==''){
             this.$store.commit("shops/CITY_INFO", { area: cunzai[0],curshop:'' });
              sessionStorage.setItem('area', cunzai[0])
          }
          
          let _area=this.$store.state.shops.area;
          this.allarea =cunzai;  
          //this.activeName = res.data.areas[0];
          //this.initstore(res.data.areas[0]);
          this.activeName=_area
          this.initstore(_area);
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    initstore(area) {
      this.$axios
        .post(`/getDevUserInfo?area=${area}&startPage=1&pageSize=1000`)
        .then(res => {
          this.storearr = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    GetPercent(num, total) {
      num = parseFloat(num);
      total = parseFloat(total);
      if (isNaN(num) || isNaN(total)) {
        return "-";
      }
      return total <= 0 ? 0 : Math.round((num / total) * 10000) / 100;
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.obj = JSON.parse(sessionStorage.getItem("user"));
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init();
    this.initarea();
    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.init();
         let _area=sessionStorage.getItem('area')!=''?sessionStorage.getItem('area'):this.$store.state.shops.area;
        this.initstore(_area);
      }, 6000);
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
  destroyed() {
    clearInterval(this.timer);
  },
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
};
</script>
<style>
.topitem .el-progress {
    position: relative;
    line-height: 1;
    display: flex;
    align-items: center;
}
.itemcenter .el-tabs__item.is-active {
  color: #409EFF;
  border-bottom: 3px solid #409EFF;
  border-radius: 0px; 
-moz-border-radius: 0px;
-webkit-border-radius: 0px;
}
.itemcenter .el-tabs__active-bar{
 background: none;
}
.topitem .el-tabs--left .el-tabs__item .is-left {
  text-align: center !important;
}
.itemcenter .el-tabs__item {
  height: 100px;
  width: 74px;
  line-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  font-weight: bold;
  border-radius: 5px;
  font-size: 20px;
}
</style>
<style scoped>
.itemone {
  background: url("../../assets/images/img/storebg.png") no-repeat;
  background-size: contain;
  height: 170px;
  width: 320px;
  margin-bottom: 15px;
  padding:25px 33px;
  box-sizing: border-box;
  position: relative;
  border-radius: 5px;
}
.itemone .storename {

  color: #000000;
  font-size: 23px;
}
.itemone .storeshebei {
  margin-top:20px;
 
  color: #999999;
  font-size: 18px;
}
.itemone .state {
  display: inline-block;
  width: 62px;
  height: 48px;
  position: absolute;
  bottom: 40px;
  right: 37px;
}
.topitem .el-col-8 .item {
  position: relative;
  margin: 15px;
  padding: 12px;
  height: 174px;
  width: 60% !important;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
  color: #fff;
  border: 1px solid #555555;
}

.title {
  padding: 15px 10px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
}
.user-info {
  display: flex;
  align-items: center;
  /* padding-bottom: 20px;
  border-bottom: 2px solid #ccc; */
  margin-bottom: 15px;
}
.user-info-role {
  padding-left: 3px;
}
.user-info-list {
  padding: 15px;
}
.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  display: flex;
  /* justify-content: space-between; */
  font-size: 14px;
  color: #999;
  line-height: 25px;
}
.user-info-list p {
  margin: 0 10px 0 5px;
}
.user-info-list span {
  margin-left: 0 10px 0 0;
}
/* @import url(); 引入公共css类 */
.app-container {
  background-color: #fcf9fc;
}
.item {
  margin-bottom: 16px;
}
.item h4 {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.15;
  padding: 15px 0 15px 0px;
}
</style>


