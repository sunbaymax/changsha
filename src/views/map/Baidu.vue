<!--  -->
<template>
  <div class="map_baidu">
    <!-- <div class="title">监控中心</div> -->

    <el-row class="title">
      <el-col :span="18">
        <div class="grid-content bg-purple">诺和制源（所属工程：空白工程） 到期时间：2020-09-03</div>
      </el-col>
      <el-col :span="6" class="title-right">
        <div class="grid-content bg-purple">
          <el-button size="small" type="primary">开关机</el-button>
          <el-dropdown size="small" split-button type="primary">
            更多选项
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>

              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="10">
        <div class="wen-title">
          <h3>冷库温度状态</h3>
        </div>
        <el-table :data="lengkutempstate" stripe>
          <el-table-column prop="id" label="序号"></el-table-column>
          <el-table-column prop="date" label="冷库"></el-table-column>
          <el-table-column prop="name" label="温度"></el-table-column>
          <el-table-column prop="address" label="状态"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="14">
        <div class="wen-title">
          <h3>数据跟踪</h3>
        </div>
        <div class="chart_box">
          <ve-line :data="chartData" :settings="chartSettings" legend-position="right"></ve-line>
        </div>
      </el-col>
    </el-row>
    <div style="clear:both"></div>
    <el-row :gutter="10">
      <el-col :span="10">
        <div class="tabset">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="first">
              <div class="line">
                <span>设备号</span>
                <label for>5522211</label>
              </div>
              <div class="line">
                <span>别名</span>
                <label for>hkkj</label>
              </div>
              <div class="line">
                <span>控制器型号</span>
                <label for>NHHJl</label>
              </div>
              <div class="line">
                <span>压缩累计运行时间</span>
                <el-button size="mini" type="primary">获取</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="常用设置" name="second">常用设置</el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="warning">
          <div class="wen-title">
            <h3>报警信息</h3>
          </div>
          <el-table :data="warnings" height="220px">
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <div class="wen-title">
        <h3>详细信息</h3>
      </div>
      <el-col :span="24">
        <el-tabs v-model="detailinfo">
          <el-tab-pane label="压缩机" name="detailinfo1">压缩机</el-tab-pane>
          <el-tab-pane label="告警信息" name="detailinfo2">告警信息</el-tab-pane>
          <el-tab-pane label="故障锁定类" name="detailinfo3">故障锁定类</el-tab-pane>
          <el-tab-pane label="温度" name="detailinfo4">温度</el-tab-pane>
          <el-tab-pane label="湿度" name="detailinfo5">湿度</el-tab-pane>
          <el-tab-pane label="电流" name="detailinfo6">电流</el-tab-pane>
          <el-tab-pane label="系统状态" name="detailinfo7">系统状态</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row>
      <div class="wen-title">
        <h3>参数设置</h3>
      </div>
      <el-col :span="24">
        <el-tabs v-model="parameter">
          <el-tab-pane label="化霜类" name="parameter1">化霜类</el-tab-pane>
          <el-tab-pane label="压缩机" name="parameter2">压缩机</el-tab-pane>
          <el-tab-pane label="告警类" name="parameter3">告警类</el-tab-pane>
          <el-tab-pane label="峰谷电模式类" name="parameter4">峰谷电模式类</el-tab-pane>
          <el-tab-pane label="湿度" name="parameter5">湿度</el-tab-pane>
          <el-tab-pane label="电流" name="parameter6">电流</el-tab-pane>
          <el-tab-pane label="系统状态" name="parameter7">系统状态</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-row>
      <div class="wen-title">
        <h3>历史数据</h3>
      </div>

      <el-col :span="24">
        <div class="searchhistory">
          <el-form label-width="200px" :model="historydata">
            <el-form-item label="选择查看类型">
              <el-input v-model="historydata.type"></el-input>
            </el-form-item>
            <el-form-item label="选择间隔类型">
              <el-input v-model="historydata.timetype"></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-input v-model="historydata.time"></el-input>
            </el-form-item>
            <el-form-item class="btndiv">
              <el-button type="text" size="small">提交</el-button>
              <el-button type="text" size="small">重置</el-button>
              <el-button type="primary" size="small">导出EXCEL</el-button>
              <el-button type="primary" size="small">导出PDF</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple">2222</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    this.chartSettings = {
      dimension: ["日期"]
    };
    return {
      historydata: {
        type: "",
        timetype: "",
        time: ""
      },
      activeName: "second",
      lengkutempstate: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        },
        {
          id: 5,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      detailinfo: "detailinfo1",
      parameter: "parameter1",
      warnings: [
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        }
      ],
      chartData: {
        columns: ["日期", "访问用户", "下单用户", "下单率"],
        rows: [
          { 日期: "1/1", 访问用户: 1393, 下单用户: 1093, 下单率: 0.32 },
          { 日期: "1/2", 访问用户: 3530, 下单用户: 3230, 下单率: 0.26 },
          { 日期: "1/3", 访问用户: 2923, 下单用户: 2623, 下单率: 0.76 },
          { 日期: "1/4", 访问用户: 1723, 下单用户: 1423, 下单率: 0.49 },
          { 日期: "1/5", 访问用户: 3792, 下单用户: 3492, 下单率: 0.323 },
          { 日期: "1/6", 访问用户: 4593, 下单用户: 4293, 下单率: 0.78 }
        ]
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
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
</style>
<style scoped>
/* @import url(); 引入公共css类 */
.map_baidu {
  background-color: #FCF9FC;
  height: 100%;
  padding: 5px;
}

.title {
  /* height: 40px; */
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  background: #ffffff;
}

.wen-title {
  border-left: 3px solid #4c8ce8;
  height: 40px;
  padding: 5px 0;
  border-bottom: 1px solid #cccccc;
  background: #ffffff;
}
.wen-title h3 {
  margin-left: 10px;
  color: #2d353e;
}
.map_baidu .el-row {
  margin: 10px 0;
}
.frist {
  /* height: 400px; */
  background-color: #FCF9FC;
}

.right {
  /* height: 120px; */
  background: #ffffff;
}
.chart_box {
  background: #ffffff;
}
.left {
  background: #ffffff;
  /* margin-right: 10px; */
}
.frist .left .el-table {
  background: #ffffff;
  height: 400px;
  /* margin-right: 10px; */
}
.title-right {
  text-align: end;
}
.tabset .el-tabs {
  height: 260px;
  background: #ffffff;
  padding: 0px 5px;
}
.el-tabs .line {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.warning {
  height: 260px;
  background: #ffffff;
  /* padding: 0px 5px; */
}
.searchhistory {
  width: 100%;
  text-align: center;
  margin: 10px 0;
}
.searchhistory form {
  width: 500px;
  margin: 0 auto;
}
.searchhistory form .el-form-item__content{
  display: flex;
  justify-content: center;
}
</style>