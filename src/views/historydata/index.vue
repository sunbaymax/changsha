<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-redpacket_fill"></i> 历史数据
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <div>
          <el-input
            v-model="query.name"
            placeholder="按商户名查询"
            class="handle-input mr10"
            clearable
            >></el-input
          >
          <el-input
            v-model="query.linkman"
            placeholder="按联系人查询"
            class="handle-input mr10"
            clearable
            >></el-input
          >
          <el-input
            v-model="query.phone"
            placeholder="按手机号查询"
            class="handle-input mr10"
            clearable
            >></el-input
          >
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
            >查询</el-button
          >
        </div>
        <!-- <div class="mt20">
     
          <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
          </el-select>
      
          <el-date-picker
            v-model="choosetime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
      
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button type="success" icon="el-icon-download" @click="downexecl">下载</el-button>
         </div> -->
      </div>
      <div style="margin-bottom:5px" v-show="Object.keys(dailyStatistics).length>0">
        <h3>此时间段设备使用工时：{{dailyStatistics.costtime}}分钟，费用：{{dailyStatistics.cost}}</h3>
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <!-- <el-table-column type="selection" prop="id" width="55" align="center"></el-table-column> -->
        <el-table-column
          prop="ipaddr"
          label="设备地址"
          width="140px"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="采集时间"
          width="180px"
        ></el-table-column>
        <el-table-column prop="tempr1" label="温度一"></el-table-column>
        <el-table-column prop="tempr2" label="温度二"></el-table-column>
        <el-table-column prop="tempr3" label="温度三"></el-table-column>
        <el-table-column prop="tempr4" label="温度四"></el-table-column>
        <el-table-column prop="tempr5" label="温度五"></el-table-column>

        <el-table-column prop="valvestat1" label="阀门状态一">
          <template slot-scope="scope">
            <span v-show="scope.row.valvestat1 == 1">开</span>
            <span v-show="scope.row.valvestat1 == 0">关</span>
          </template>
        </el-table-column>
        <el-table-column prop="valvestat2" label="阀门状态二">
          <template slot-scope="scope">
            <span v-show="scope.row.valvestat2 == 1">开</span>
            <span v-show="scope.row.valvestat2 == 0">关</span>
          </template>
        </el-table-column>
        <el-table-column prop="valvestat3" label="阀门状态三">
          <template slot-scope="scope">
            <span v-show="scope.row.valvestat3 == 1">开</span>
            <span v-show="scope.row.valvestat3 == 0">关</span>
          </template>
        </el-table-column>

        <el-table-column label="水流信号一">
          <template slot-scope="scope">
            <span v-show="scope.row.watersign1 == 1">开</span>
            <span v-show="scope.row.watersign1 == 0">关</span>
          </template>
        </el-table-column>
        <el-table-column prop="watersign2" label="水流信号二">
          <template slot-scope="scope">
            <span v-show="scope.row.watersign2 == 1">开</span>
            <span v-show="scope.row.watersign2 == 0">关</span>
          </template>
        </el-table-column>
        <el-table-column prop="watersign3" label="水流信号三">
          <template slot-scope="scope">
            <span v-show="scope.row.watersign3 == 1">开</span>
            <span v-show="scope.row.watersign3 == 0">关</span>
          </template>
        </el-table-column>
        <el-table-column prop="watersign4" label="水流信号四">
          <template slot-scope="scope">
            <span v-show="scope.row.watersign4 == 1">开</span>
            <span v-show="scope.row.watersign4 == 0">关</span>
          </template>
        </el-table-column>
        <el-table-column prop="watersign5" label="水流信号五">
          <template slot-scope="scope">
            <span v-show="scope.row.watersign5 == 1">开</span>
            <span v-show="scope.row.watersign5 == 0">关</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="制冷制热一">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="edit"
                            v-show="scope.row.watermode1==1"
                        >开</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="delete"
                            v-show="scope.row.watermode1==0"
                        >关</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="制冷制热二">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="edit"
                            v-show="scope.row.watermode2==1"
                        >开</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="delete"
                            v-show="scope.row.watermode2==0"
                        >关</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="制冷制热三">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="edit"
                            v-show="scope.row.watermode3==1"
                        >开</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="delete"
                            v-show="scope.row.watermode3==0"
                        >关</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="制冷制热四">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="edit"
                            v-show="scope.row.watermode4==1"
                        >开</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="delete"
                            v-show="scope.row.watermode4==0"
                        >关</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="制冷制热五">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="edit"
                            v-show="scope.row.watermode5==1"
                        >开</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="delete"
                            v-show="scope.row.watermode5==0"
                        >关</el-button>
                    </template>
        </el-table-column>-->
        <!-- <el-table-column prop="model1" label="模式"></el-table-column> -->
        <!-- <el-table-column prop="money" label="充值金额"></el-table-column> -->
        <!--  <el-table-column prop="time" label="充值时间"></el-table-column>-->
      </el-table>
      <div class="pagination" v-if="tableData.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageIndex"
          :page-sizes="[10, 20, 50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="历史数据" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" ref="searchform">
        <el-form-item label="设备地址">
          <el-select v-model="query.ipaddr" placeholder="请选择">
            <el-option
              v-for="item in form.ipaddr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }} </span>
              <span
                style="
                  float: right;
                  margin-left: 30px;
                  color: #8492a6;
                  font-size: 13px;
                "
                class="choosecenter"
                ><label class="cname">{{ item.name }}</label>
                <label class="clinkman">{{ item.linkman }}</label>
                <label class="cphone">{{ item.phone }}</label>
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询时间" labei-width="240px">
          <el-date-picker
            v-model="form.choosetime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handquery">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        ipaddr: "",
        name: "",
        linkman: "",
        phone: "",
        pageIndex: 1,
        pageSize: 10,
      },
      form: {
        ipaddr: [],
        choosetime: [],
      },
      dailyStatistics:'',
      tableData: [],
      exportList: [],
      pageTotal: 0,
      dialogFormVisible: false,
      loading: false,
    };
  },
  created() {
    // this.getData();
  },
  watch: {
    query: {
      handler(newValue, oldValue) {
        if (
          newValue.name == "" &&
          newValue.linkman == "" &&
          newValue.phone == ""
        ) {
          this.query.name = "";
          this.query.ipaddr = "";
          this.query.linkman = "";
          this.query.phone = "";
          this.getData();
        }
      },
      deep: true,
    },
  },
  methods: {
    getData() {
      this.loading = true;
      //http://114.64.253.136:8011/hisdata?startPage=1&pageSize=10&ipaddr=
      this.$axios
        .get(
          `/hisdata?startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}&ipaddr=${this.query.ipaddr}`
        )
        .then((res) => {
          if (res.data.count != 0) {
            let resdata = res.data.data;

            let _resdata = resdata.map((ele, index) => {
              ele.time = ele.time.substring(0, 19);
              return ele;
            });

            this.tableData = _resdata;
            this.pageTotal = res.data.count;
            setTimeout(() => {
              this.loading = false;
            }, 1000);
          } else {
            this.loading = false;
            this.tableData = [];
            this.$message.error("没有查询数据");
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    handquery() {
      if (this.form.choosetime.length != 0) {
        let _stime = this.moment(this.form.choosetime[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        let _etime = this.moment(this.form.choosetime[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
          this.$axios.get(
            `/getCostByTime?ipaddr=${this.query.ipaddr}&stime=${_stime}&etime=${_etime}`
          )
          .then((res) => {
            console.log(res.data)
            this.dailyStatistics=res.data

           })
          .catch(function (err) {
            console.log(err);
          });
        this.$axios.get(
            `/hisdatabytime?ipaddr=${this.query.ipaddr}&stime=${_stime}&etime=${_etime}&startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}`
          )
          .then((res) => {
            console.log(res.data);
            if (res.data.count != 0) {
              let resdata = res.data.data;
              let _resdata = resdata.map((ele, index) => {
                ele.time = ele.time.substring(0, 19);
                return ele;
              });
              this.tableData = _resdata;
              this.pageTotal = res.data.count;
              this.dialogFormVisible = false;
              setTimeout(() => {
                this.loading = false;
              }, 1500);
            } else {
              this.loading = false;
              this.tableData = [];
              this.$message.error("没有查询数据");
              this.dialogFormVisible = false;
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        this.$axios
          .get(
            `/hisdata?startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}&ipaddr=${this.query.ipaddr}`
          )
          .then((res) => {
            console.log(res.data);
            if (res.data.count != 0) {
              this.tableData = res.data.data;
              this.pageTotal = res.data.count;
              this.loading = false;
              setTimeout(() => {
                this.dialogFormVisible = false;
              }, 1500);
            } else {
              this.loading = false;
              this.tableData = [];
              this.$message.error("没有查询数据");
              this.dialogFormVisible = false;
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    },
    downexecl() {
      this.exportList = this.tableData;
      this.exportExcel();
    },
    exportExcel() {
      let _this = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel");
        const tHeader = [
          "设备地址",
          "温度一",
          "温度二",
          "温度三",
          "温度四",
          "温度五",
          "阀门状态一",
          "阀门状态二",
          "阀门状态三",
          "水流信号一",
          "水流信号二",
          "水流信号三",
          "水流信号四",
          "水流信号五",
          "时间",
        ];
        const filterVal = [
          "ipaddr",
          "tempr1",
          "tempr2",
          "tempr3",
          "tempr4",
          "tempr5",
          "valvestat1",
          "valvestat2",
          "valvestat3",
          "watersign1",
          "watersign2",
          "watersign3",
          "watersign4",
          "watersign5",
          "time",
        ];
        const list = this.exportList;
        console.log(this.exportList);
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "历史数据");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    handleSearch() {
      var array = [];
      this.$axios({
        method: "post",
        url: "/getusersvague",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", //设置请求头请求格式为JSON
        },
        data: {
          name: this.query.name,
          linkman: this.query.linkman,
          phone: this.query.phone,
        },
      })
        .then((response) => {
          if (response.data.count >= 1) {
            this.query.ipaddr = "";
            this.form.ipaddr = [];
            this.form.choosetime = [];
            let arr = response.data.data;
            this.dialogFormVisible = true;
            arr.forEach(function (item) {
              let obj = {};
              obj.value = item.ipaddr;
              obj.label = item.ipaddr;
              obj.linkman = item.linkman;
              obj.phone = item.phone;
              obj.name = item.name;
              array.push(obj);
            });
            this.form.ipaddr = array;
            this.query.ipaddr = array[0].value;
          } else {
            this.$message.error("没有查询该记录");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      //this.getData();
    },
    //多选
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
};
</script>

<style scoped>
.handle-box .mt20 {
  margin-top: 10px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 200px;
  display: inline-block;
}

.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
.choosecenter .cname {
  display: inline-block;
  width: 60px;
  text-align: left;
}
.choosecenter .clinkman {
  display: inline-block;
  width: 60px;
  text-align: left;
}
.choosecenter .cphone {
  display: inline-block;
  width: 120px;
  text-align: left;
}
</style>
