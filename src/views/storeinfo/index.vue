<!--  -->
<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/monitor' }">实时监控</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/monitor' }">商铺{{$store.state.shops.curshop}}</el-breadcrumb-item>
      <el-breadcrumb-item>钛泡编号({{this.query.ipaddr}})</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="tabledata">
      <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <el-table
            :data="istable"
            style="width: 100%"
            :cell-style="rowClass"
            :header-cell-style="headClass"
          >
            <el-table-column label="养殖池编号">
              <template slot-scope="scope">
                <!-- <span v-bind:class="[{'redwen':scope.row.idnum%2 ==0},circle]">{{ scope.row.idnum }}</span> -->
                <span v-if='scope.row.idnum==1'>&#9312;</span>
                <span v-if='scope.row.idnum==2' class="redwen"> &#9313; </span>
                <span v-if='scope.row.idnum==3' >&#9314; </span>
                <span v-if='scope.row.idnum==4' class="redwen"> &#9315; </span>
                <span v-if='scope.row.idnum==5' > &#9316; </span>
                <!-- <span v-bind:class="[{'redwen':scope.row.idnum%2 ==0}]">&#9312;</span> -->
               
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间"></el-table-column>
            <el-table-column label="温度">
              <template slot-scope="scope">
                <span v-bind:class="[{'redwen':scope.row.tempr>30}]">{{ scope.row.temperature }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="模式"></el-table-column>
            <el-table-column prop="flow" label="水流"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="pagination" v-if="istable.length>0">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="query.pageIndex"
              :page-sizes="[1]"
              :page-size="query.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageTotal"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="mychoose" v-if="istable.length>0"></div>
    <div class="dataline">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-card class="box-card">
            <div class="chart_tittle">
              <div class="chart_tittle_left">
                养殖池温度变化折线
                <span>(摄氏度℃)</span>
              </div>
              <div class="chart_tittle_right">
                <el-select v-model="mytepmtime" @change="selectval">
                  <el-option label="当天" value="1"></el-option>
                  <el-option label="近一周" value="7"></el-option>
                  <el-option label="近一个月" value="30"></el-option>
                </el-select>
              </div>
            </div>
            <div class="chart_box">
              <ve-line :data="chartData" :settings="chartSettings" :data-empty="tempdataEmpty">
                <!-- <div class="data-empty">没有数据😂</div> -->
              </ve-line>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <el-card class="box-card">
            <div class="chart_tittle">
              <div>
                养殖池费用变化柱状图
                <span>(元)</span>
              </div>
              <div class="chart_tittle_right">
                <el-select v-model="mytime" @change="selectcost">
                  <el-option label="当天" value="1"></el-option>
                  <el-option label="近一周" value="7"></el-option>
                  <el-option label="近一个月" value="30"></el-option>
                </el-select>
              </div>
            </div>
            <ve-histogram :data="cost" :settings="chartExtend" :extend="cost.chartExtend"></ve-histogram>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import "v-charts/lib/style.css";
export default {
  //import引入的组件需要注入到对象中才能使用
  data() {
    (this.chartExtend = {
      legend: {
        show: true,
      },
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#8CB1F2" },
          { offset: 0.5, color: "#8CB1F2" },
          { offset: 1, color: "#EFF4FD" },
        ]),
      },
    }),
      (this.chartSettings = {
        metrics: [
          "1号海鲜池",
          "2号海鲜池",
          "3号海鲜池",
          "4号海鲜池",
          "5号海鲜池",
        ],

        dimension: ["时间"],
        area: true,
        itemStyle: {
          //面积图颜色设置
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(53,116,220,0.6)", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "rgba(53,116,220,0.1)", // 100% 处的颜色
              },
            ],
            globalCoord: false, // 缺省为 false
          },
        },
      });
    //这里存放数据
    return {
      tempdataEmpty: true,
      query: {
        ipaddr: "",
        pageIndex: 1,
        pageSize: 1,
        day: 1,
        stime: "",
        etime: "",
      },

      state: {
        day: 1,
      },
      gettime: "",
      tableData: [],
      pageTotal: 0,
      ippaddr: "",
      mytime: "当天",
      mytepmtime: "当天",
      chartData: {
        columns: [
          "时间",
          "1号海鲜池",
          "2号海鲜池",
          "3号海鲜池",
          "4号海鲜池",
          "5号海鲜池",
        ],
        rows: [],
        dataEmpty: true,
      },

      cost: {
        day: 1,
        columns: ["时间", "金额"],
        rows: [],
        dataEmpty: true,
      },

      circle: "circle",
      istable: [
        {
          idnum: 1,
          temperature: 0,
          time: "",
          model: "",
          flow: "",
          state: "",
        },
        {
          idnum: 2,
          temperature: "0",
          time: "",
          model: "",
          flow: "",
          state: "",
        },
        {
          idnum: 3,
          time: "",
          temperature: "0",
          model: "",
          flow: "",
          state: "",
        },
        {
          idnum: 4,
          time: "",
          temperature: "0",
          model: "",
          flow: "",
          state: "",
        },
        {
          idnum: 5,
          time: "",
          temperature: "0",
          model: "",
          flow: "",
          state: "",
        },
      ],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    // 表头样式设置
    headClass() {
      return "text-align: center;color:#333333;";
    },
    // 表格样式设置
    rowClass() {
      return "text-align: center;";
    },
    selectval(val) {
      console.log("22", val);
      this.query.day = val;
      this.getDay(-val);
      this.initTemp();
    },
    selectcost(val) {
      this.cost.day = val;
      this.initcost();
    },
    getDay(day) {
      var today = new Date();

      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

      today.setTime(targetday_milliseconds); //注意，这行是关键代码

      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      var thour = today.getHours();
      var tminutes = today.getMinutes();
      var tseconds = today.getSeconds();
      tMonth = this.doHandleMonth(tMonth + 1);

      tDate = this.doHandleMonth(tDate);
      thour = this.doHandleMonth(thour);
      tminutes = this.doHandleMonth(tminutes);
      tseconds = this.doHandleMonth(tseconds);
      this.query.stime =
        tYear +
        "-" +
        tMonth +
        "-" +
        tDate +
        " " +
        thour +
        ":" +
        tminutes +
        ":" +
        tseconds;
      return (
        tYear +
        "-" +
        tMonth +
        "-" +
        tDate +
        " " +
        thour +
        ":" +
        tminutes +
        ":" +
        tseconds
      );
    },
    doHandleMonth(month) {
      var m = month;

      if (month.toString().length == 1) {
        m = "0" + month;
      }

      return m;
    },
    getTime: function () {
      var _this = this;
      let yy = new Date().getFullYear();
      let mm =
        new Date().getMonth() + 1 < 10
          ? "0" + (new Date().getMonth() + 1)
          : new Date().getMonth() + 1;
      let prevmm =
        new Date().getMonth() < 10
          ? "0" + new Date().getMonth()
          : new Date().getMonth();
      let dd =
        new Date().getDate() < 10
          ? "0" + new Date().getDate()
          : new Date().getDate();

      let zdd =
        new Date().getDate() < 10
          ? "0" + (new Date().getDate() - 1)
          : new Date().getDate() - 1;
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

      _this.query.stime =
        yy + "-" + mm + "-" + dd + " " + "00" + ":" + "00" + ":" + "00";
      _this.query.etime =
        yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
      _this.query.wenk =
        yy + "-" + mm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
      _this.query.mounth =
        yy + "-" + prevmm + "-" + dd + " " + hh + ":" + mf + ":" + ss;
    },
    initcost() {
      this.$axios
        .get(`/getconsume?ipaddr=${this.query.ipaddr}&day=${this.cost.day}`)
        .then((res) => {
          let _data = res.data.data;
          this.cost.dataEmpty = false;
          if (_data.length == 12) {
            console.log("11");
            this.cost.rows = [];
            for (var j = 0, len = _data.length; j < len; j++) {
              let obj = {};
              obj.时间 = j * 2 + "-" + (j * 2 + 2) + "时";
              obj.金额 = _data[j];
              this.cost.rows.push(obj);
            }
          } else if (_data.length == 7) {
            console.log("aa");
            this.cost.rows = [];
            for (var j = 0, len = _data.length; j < len; j++) {
              let obj = {};
              obj.时间 = j + 1 + "天";
              obj.金额 = _data[j];
              this.cost.rows.push(obj);
            }
          } else {
            console.log("11333");
            this.cost.rows = [];
            for (var j = 0; j < _data.length; j++) {
              let obj = {};
              obj["时间"] = j + "天";
              obj["金额"] = _data[j];
              this.cost.rows.push(obj);
            }
            console.log(this.cost.rows);
          }

          //    rows: [
          //   { 时间: "1天前", 金额: 193 },
          //   { 时间: "2天前", 金额: 530 },
          //   { 时间: "3天前", 金额: 293 },
          //   { 时间: "4天前", 金额: 123 },
          //   { 时间: "5天前", 金额: 372 },
          //   { 时间: "6天前", 金额: 459 },
          //   { 时间: "7天前", 金额: 423 }
          // ]
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData() {
      this.$axios
        .get(
          `/hisdata?ipaddr=${this.query.ipaddr}&startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}`
        )
        .then((res) => {
          // consconsole.log(res.data);
          if (res.data.count != 0) {
            let apitimes = res.data.data[0].time.slice(0, -2);
            let postarr = res.data.data;
            this.chartData = this.chartData;
            this.$set(this.istable[0], "id", 1);
            this.$set(this.istable[0], "temperature", res.data.data[0].tempr1);
            this.$set(this.istable[0], "time", apitimes);
            this.$set(
              this.istable[0],
              "model",
              res.data.data[0].valvestat1 == 0 ? "关闭" : "开启"
            );
            this.$set(
              this.istable[0],
              "flow",
              res.data.data[0].watermode1 == 0 ? "关闭" : "开启"
            );
            this.$set(this.istable[0], "state", "制冷");

            this.$set(this.istable[1], "id", 2);
            this.$set(this.istable[1], "temperature", res.data.data[0].tempr2);
            this.$set(this.istable[1], "time", apitimes);
            this.$set(
              this.istable[1],
              "model",
              res.data.data[0].valvestat2 == 0 ? "关闭" : "开启"
            );
            this.$set(
              this.istable[1],
              "flow",
              res.data.data[0].watermode2 == 0 ? "关闭" : "开启"
            );
            this.$set(this.istable[1], "state", "制冷");

            this.$set(this.istable[2], "id", 3);
            this.$set(this.istable[2], "time", apitimes);
            this.$set(this.istable[2], "temperature", res.data.data[0].tempr3);
            this.$set(
              this.istable[2],
              "model",
              res.data.data[0].valvestat3 == 0 ? "关闭" : "开启"
            );
            this.$set(
              this.istable[2],
              "flow",
              res.data.data[0].watermode3 == 0 ? "关闭" : "开启"
            );
            this.$set(this.istable[2], "state", "制冷");

            this.$set(this.istable[3], "id", 4);
            this.$set(this.istable[3], "temperature", res.data.data[0].tempr4);
            this.$set(this.istable[3], "time", apitimes);
            this.$set(
              this.istable[3],
              "model",
              res.data.data[0].valvestat4 == 0 ? "关闭" : "开启"
            );
            this.$set(
              this.istable[3],
              "flow",
              res.data.data[0].watermode4 == 0 ? "关闭" : "开启"
            );
            this.$set(this.istable[3], "state", "制冷");

            this.$set(this.istable[4], "id", 5);
            this.$set(this.istable[4], "time", apitimes);
            this.$set(this.istable[4], "temperature", res.data.data[0].tempr5);
            this.$set(
              this.istable[4],
              "model",
              res.data.data[0].valvestat5 == 0 ? "关闭" : "开启"
            );
            this.$set(
              this.istable[4],
              "flow",
              res.data.data[0].watermode5 == 0 ? "关闭" : "开启"
            );
            this.$set(this.istable[4], "state", "制冷");

            this.pageTotal = res.data.count;
          } else {
            this.istable = [];
            this.chartData = [];
            // this.$message.error("没有查询数据");
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    initTemp() {
      this.$axios
        .post(
          `/hisdatabytime?ipaddr=${this.query.ipaddr}&startPage=${this.query.pageIndex}&pageSize=50000&stime=${this.query.stime}&etime=${this.query.etime}`
        )
        .then((res) => {
          console.log(res);
          let _data = res.data.data;
          if (_data.length == 0) {
            this.tempdataEmpty = true;
            return false;
          }
          this.tempdataEmpty = false;
          this.chartData.rows = [];
          for (var j = 0, len = _data.length; j < len; j++) {
            let apitimes = _data[j].time.slice(0, -2);
            let obj = {};
            obj.时间 = apitimes;
            obj["1号海鲜池"] = _data[j].tempr1;
            obj["2号海鲜池"] = _data[j].tempr2;
            obj["3号海鲜池"] = _data[j].tempr3==180?0: _data[j].tempr3;
            obj["4号海鲜池"] = _data[j].tempr4==180?0: _data[j].tempr4;
            obj["5号海鲜池"] = _data[j].tempr5==180?0: _data[j].tempr5;
            this.chartData.rows.push(obj);
          }

          // {
          //   日期: "2020-3-25",
          //   "1号海鲜池": 23.5,
          //   "2号海鲜池": 26.5,
          //   "3号海鲜池": 14.5,
          //   "4号海鲜池": 16.5,
          //   "5号海鲜池": 19.5
          // },
          // {
          //   日期: "2020-3-26",
          //   "1号海鲜池": 22.1,
          //   "2号海鲜池": 27.1,
          //   "3号海鲜池": 22.4,
          //   "4号海鲜池": 30.5,
          //   "5号海鲜池": 11.5
          // },
          // {
          //   日期: "2020-3-27",
          //   "1号海鲜池": 16.8,
          //   "2号海鲜池": 24.1,
          //   "3号海鲜池": 22.1,
          //   "4号海鲜池": 42.5,
          //   "5号海鲜池": 16.5
          // },
          // {
          //   日期: "2020-3-28",
          //   "1号海鲜池": 24.6,
          //   "2号海鲜池": 20.1,
          //   "3号海鲜池": 25.5,
          //   "4号海鲜池": 16.5,
          //   "5号海鲜池": 16.5
          // },
          // {
          //   日期: "2020-3-29",
          //   "1号海鲜池": 30.5,
          //   "2号海鲜池": 18.1,
          //   "3号海鲜池": 10.5,
          //   "4号海鲜池": 24.5,
          //   "5号海鲜池": 16.5
          // },
          // {
          //   日期: "2020-3-30",
          //   "1号海鲜池": 27.6,
          //   "2号海鲜池": 19.1,
          //   "3号海鲜池": 19.5,
          //   "4号海鲜池": 20.5,
          //   "5号海鲜池": 16.5
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageSize", val);
      console.log(`当前页: ${val}` + this.query.pageIndex);
      this.getData();
    },

    handleSizeChange(val) {
      this.$set(this.query, "pageSize", val);
      //  this.query.pageSize=val
      this.getData();
    },

    handleCurrentChange(val) {
      console.log(val);
      // this.query.startPage=val

      this.$set(this.query, "pageIndex", val);
      console.log(`当前页: ${val}` + this.query.pageIndex);
      this.getData();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.obj = JSON.parse(sessionStorage.getItem("user"));
    console.log(this.getDay(-7));
    // console.log(this.obj);
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getTime();
    let id = this.$route.params.id;
    this.query.ipaddr = id;
    this.getData();
    this.initcost();
    this.initTemp();
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
  activated() {},
};
</script>
<style>
.tabledata .el-table .cell {
  line-height: inherit;
}
.chart_tittle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin: 15px 0px;
  color: #333333;
}

.chart_tittle span {
  font-size: 16px;

  color: #999;
}
.mychoose .el-select {
  background: none;
  margin-left: 15px;
}
.el-select .el-input__inner {
  background: none;
  /* font-size: 14px; */
}
.tabledata .circle {
 height: 20px;    width: 20px;    display: inline-block;    background: #FFFFFF;  border-radius: 50%;border: 1px solid #000000;    vertical-align: top;
}
</style>
<style scoped>
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  color: #888;
  font-size: 14px;
}
.mychoose {
  margin: 15px 0;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataline {
  margin: 15px 0;
}
.tabledata {
  /* padding: 15px 10px; */
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
}
.tabledata li {
  list-style-type: none;
}

.redwen {
  color: #ea6472;
}
.greenwen {
  color: #4fd992;
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