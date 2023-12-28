<!--  -->
<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">后台首页</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="title">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="user-info">
            <img src="../../assets/images/img/touxiang.png" class="user-avator" alt />
            <div class="user-info-cont">
              <div class="user-info-name">{{obj.username}}</div>
              <div class="user-info-role">{{obj.role==0?'管理员':'普通用户'}}</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <div class="user-info-list">
            <p>
              <span>登录时间：{{gettime}}</span>
            </p>
            <!-- <p>
            <span>登录IP：{{getIp}}</span>
            </p>-->

            <p>
              <span>当前城市：{{getcity}}</span>
            </p>
            <p>
              <span>天气： {{getweatherifo.type}},{{ getweatherifo.low}} ~{{ getweatherifo.high}}，{{getweatherifo.fengxiang}}，{{getweatherifo.fengli}}</span>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="item">
      <!-- <h4>选项卡展示</h4> -->
      <data-tabs :option="easyDataOption"></data-tabs>
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
      option: {
        span: 8,
        color: "#15A0FF",
        data: [
          {
            count: 1000,
            title: "日活跃数"
          },
          {
            count: 3000,
            title: "月活跃数"
          },
          {
            count: 20000,
            title: "年活跃数"
          }
        ]
      },
      easyDataOption: {
        span: 6,
        gutter: 0,
        data: [
          {
            title: "欠费商户",
            Height:'0.916rem',
            Width:'1.807rem',
            subtitle: "实时",
            count: 0,
            allcount: 2000,
            text: "当前记录数",
            color:
              "url(" + require("../../assets/images/img/qianfeibg.png") + ")",
            key: "",
            percent: 0
          },
          {
            title: "故障设备",
            subtitle: "实时",
            count: 0,
             Height:'0.916rem',
            Width:'1.807rem',
            allcount: 10222,
            text: "当前故障数",
            color:
              "url(" + require("../../assets/images/img/guanzhangbg.png") + ")",
            key: "故",
            percent: 0
          },
          {
            title: "报警设备",
            subtitle: "实时",
            count: 0,
             Height:'0.916rem',
            Width:'1.807rem',
            allcount: 10222,
            text: "评论次数",
            color:
              "url(" + require("../../assets/images/img/warningbg.png") + ")",
            key: "评",
            percent: 0
          },
          {
            title: "在线设备",
            subtitle: "实时",
            count: 0,
             Height:'0.916rem',
            Width:'1.807rem',
            allcount: 10222,
            text: "评论次数",
            color:
              "url(" + require("../../assets/images/img/onlinebg.png") + ")",
            key: "新",
            percent: 0
          }
        ]
      },
      totol: "",
      obj: {},
      gettime: "", //当前时间
      getcity: "", //当前城市
      getIp: "",
      getweatherifo: {}
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    changeDate() {
      const now = new Date().getTime();
      this.data.forEach((item, index) => {
        const date = new Date(now - (6 - index) * 86400000);
        item.name = `${date.getFullYear()}/${date.getMonth() +
          1}/${date.getDate()}`;
      });
    },
    detail(str) {
      let _ipaddr = this.$route.query.ipaddr;
      console.log(str);
      this.$router.push({
        path: "/detailinfo",
        query: {
          ipaddr: str
        }
      });
      i;
    },
    getTime: function() {
      var _this = this;
      let yy = new Date().getFullYear();
      let mm =
        new Date().getMonth() + 1 < 10
          ? "0" + new Date().getMonth()
          : new Date().getMonth();
      let dd =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();
      let hh =
        new Date().getHours() < 10
          ? "0" + new Date().getHours()
          : new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.gettime = yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },
    currentTime() {
      setInterval(this.getTime(), 1000);
    },
    getweather: function(_city) {
      let _this = this;
      this.$axios
        .get(`http://wthrcdn.etouch.cn/weather_mini?city=${_city}`)
        .then(function(response) {
          console.log(response.data);
          _this.getweatherifo = response.data.data.forecast.slice(0, 1)[0];
          _this.$set(
            _this.getweatherifo,
            "low",
            _this.getweatherifo.low.slice(2)
          );
          _this.$set(
            _this.getweatherifo,
            "high",
            _this.getweatherifo.high.slice(2)
          );
          // _this.$set(_this.getweatherifo, 'fengli', _this.getweatherifo.fengli.substring(9,13))
          _this.$set(
            _this.getweatherifo,
            "fengli",
            _this.getweatherifo.fengli
              .replace("<![CDATA[", "")
              .replace("]]>", "")
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    init() {
      this.$axios
        .post("/gethomepagedatas")
        .then(res => {
          console.log(res.data);
          this.$set(this.easyDataOption.data[0], "count", res.data.owecount);
          let owecountpertent =
            this.GetPercent(res.data.owecount, res.data.devcounts) == 0
              ? 0
              : parseFloat(
                  this.GetPercent(
                    res.data.owecount,
                    res.data.devcounts
                  ).toFixed(1)
                );
          if (res.data.comexcpcount != 0) {
            this.$set(this.easyDataOption.data[1], "percent", owecountpertent);
          }
          this.$set(this.easyDataOption.data[0], "percent", owecountpertent);
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
          this.$set(this.easyDataOption.data[3], "count", res.data.onlinecount);

          let onlinecountpertent =
            this.GetPercent(res.data.onlinecount, res.data.devcounts) == 0
              ? 0
              : parseFloat(
                  this.GetPercent(
                    res.data.onlinecount,
                    res.data.devcounts
                  ).toFixed(1)
                );
          if (res.data.comexcpcount != 0) {
            this.$set(
              this.easyDataOption.data[3],
              "percent",
              onlinecountpertent
            );
          }
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
    console.log(this.obj);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.currentTime();
    this.getcity = localStorage.getItem("cityname");
    this.getIp = localStorage.getItem("Ip");
    this.getweather(this.getcity);
    this.init();
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
.item .el-progress {
    position: relative;
    line-height: 1;
    display: flex;
    align-items: center;
}
</style>
<style scoped>

.title {
  height: 230px;
  /* border:1px solid #222; */
  background: url("../../assets/images/img/indextitle.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
  border-radius: 5px;
  padding: 40px 20px;
}
.el-table {
  width: 80%;
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
  width: 85px;
  height: 85px;
  border-radius: 50%;
  margin: 5px 0 0 10px;
}

.user-info-cont {
  padding-left: 10px;
  flex: 1;
  font-size: 18px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 34px;
  color: #222;
}

.user-info-list {
  display: flex;
  /* justify-content: space-between; */
  font-size: 18px;
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