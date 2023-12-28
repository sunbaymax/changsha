<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/usercenter' }"
        >客户信息</el-breadcrumb-item
      >
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <div class="container">
      <div class="handle-box">
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
        <el-button type="success " icon="el-icon-plus" @click="handleAdd"
          >添加</el-button
        >
        <el-button
          type="warning "
          icon="el-icon-edit"
          @click="handleEditDeduction"
          >扣费系数</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <!-- <el-table :data="tableData" border > -->
        <!-- <el-table-column type="selection" prop="id" width="55" align="center"></el-table-column> -->

        <el-table-column prop="name" label="商户名称"></el-table-column>
        <el-table-column prop="linkman" label="联系人"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱地址"
          width="180"
        ></el-table-column>
        <el-table-column prop="ipaddr" label="设备地址"></el-table-column>
        <el-table-column label="余额">
          <template slot-scope="scope">￥{{ scope.row.balance }}</template>
        </el-table-column>

        <el-table-column label="运行状态">
          <template slot-scope="scope">{{ scope.row.runstatus }}</template>
        </el-table-column>
        <el-table-column label="充值状态">
          <template slot-scope="scope">{{ scope.row.rechargestatus }}</template>
        </el-table-column>
        <el-table-column label="命令状态">
          <template slot-scope="scope">{{ scope.row.orderstatus }}</template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              type="text"
              icon="el-icon-data-line"
              class="green"
              @click="handleRealdata(scope.$index, scope.row)"
            >实时数据</el-button>-->
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handlePay(scope.$index, scope.row)"
              >缴费</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleStop(scope.$index, scope.row)"
              >停机</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="tableData.length > 0">
        <!-- <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
        ></el-pagination>-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageIndex"
          :page-sizes="[10, 20, 50]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        ></el-pagination>
      </div>
    </div>

    <!-- 添加弹出框 -->
    <el-dialog
      title="添加设备"
      :visible.sync="addVisible"
      width="30%"
      @close="addclosedio('addform')"
    >
      <el-form ref="addform" :model="addform" label-width="70px">
        <el-form-item label="IP地址">
          <el-input v-model="addform.ipaddr"></el-input>
        </el-form-item>
        <el-form-item label="商户名">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="addform.area"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="addform.linkman"></el-input>
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="addform.phone"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="addform.email"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="addform.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveaddbtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editVisible"
      width="30%"
      @close="closeeditform('editform')"
    >
      <el-form ref="editform" :model="editform" label-width="70px">
        <el-form-item label="IP地址">
          <el-input v-model="editform.ipaddr" disabled></el-input>
        </el-form-item>
        <el-form-item label="商铺名">
          <el-input v-model="editform.name"></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="editform.area"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="editform.linkman"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editform.phone"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="editform.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 充值弹出框 -->
    <el-dialog
      title="设备管理"
      :visible.sync="payVisible"
      width="30%"
      @close="closepayform('payform')"
    >
      <el-form ref="payform" :model="payform" label-width="70px">
        <el-form-item label="金额">
          <el-input v-model="payform.money" type="number" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payVisible = false">取 消</el-button>
        <el-button type="primary" @click="savepay()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改扣费系数 -->
    <el-dialog
      title="修改扣费系数"
      :visible.sync="editDeductionnum"
      width="30%"
      @close="closepayform('payform')"
    >
      <el-form ref="payform" :model="payform" label-width="70px">
        <el-form-item label="扣费系数">
          <el-input
            v-model="payform.deductionval"
            placeholder="请输入扣费系数"
            type="number"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDeductionnum = false">取 消</el-button>
        <el-button type="primary" @click="isdeduction()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchData } from '../../api/index';
export default {
  name: "basetable",
  data() {
    return {
      loading: true,
      query: {
        name: "",
        linkman: "",
        phone: "",
        ipaddr: "",
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      payVisible: false, //充值显示
      addVisible: false,
      editDeductionnum: false,
      pageTotal: 0,
      editform: {
        ipaddr: "",
        area: "",
        name: "",
        linkman: "",
        phone: "",
        email: "",
        remarks: "",
      },
      payform: {
        ipaddr: "",
        money: "",
        deductionval: "",
      },
      idx: -1,
      id: -1,
      addform: {
        ipaddr: "",
        area: "",
        name: "",
        linkman: "",
        phone: "",
        email: "",
        remarks: "",
      },
    };
  },
  mounted() {
    this.getData();

    if (this.timer) {
      clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.getData();
      }, 30000);
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  // created() {
  //   this.getData();
  // },
  watch: {
    query: {
      handler(newValue, oldValue) {
        if (
          newValue.name == "" &&
          newValue.linkman == "" &&
          newValue.phone == ""
        ) {
          this.getData();
        }
      },
      deep: true,
    },
  },
  methods: {
    getDeduction() {
      this.$axios
        .get(`/getRatio`)
        .then((res) => {
          console.log(res.data.data);
          setTimeout(() => {
            this.loading = false;
          }, 1500);
          this.payform.deductionval = res.data.data;
          this.editDeductionnum = true;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    //修改扣费系数
    handleEditDeduction() {
      this.getDeduction();
    },
    isdeduction() {
      let params = {
        ratio: this.payform.deductionval,
      };
      this.$axios //.post("/reRatio", this.$qs.stringify(params))
        .post(`/reRatio?ratio=${this.payform.deductionval}`)
        .then((res) => {
          console.log(res);
          this.$message.success("正在下发中...");
          this.editDeductionnum = false;
          this.getData();
          //           if (res.code == 200) {
          //             this.$message.success("下发成功");
          //             this.editDeductionnum = false;
          //             this.getData();
          //           } else {
          //             this.$message.error("通讯异常");
          //           }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      // fetchData(this.query).then(res => {
      //     console.log(res);
      //     this.tableData = res.list;
      //     this.pageTotal = res.pageTotal || 50;
      // });
      let params = {
        startPage: this.query.pageIndex,
        pageSize: this.query.pageSize,
        ipaddr: this.query.ipaddr,
      };
      //http://linke58.com/hly/api/Login.php
      this.$axios
        .get(
          `/getDevUserInfo?area=&startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}`
        )
        .then((res) => {
          console.log(res.data);
          setTimeout(() => {
            this.loading = false;
          }, 1500);
          this.tableData = res.data.data;
          this.pageTotal = res.data.count;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // 触发搜索按钮
    handleSearch() {
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
          console.log(response);
          this.tableData = response.data.data;
          this.pageTotal = response.data.data.length;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          // http://114.64.253.136:8011/removeDevUser?ipaddr=100.22.23.6
          this.$axios
            .get(`/removeDevUser?ipaddr=${row.ipaddr}`)
            .then((res) => {
              console.log(res.data);
              // this.tableData = res.data.data;
              // this.pageTotal = res.data.count;
              if (res.data.code == 200) {
                this.$message.success(res.data.message);
                this.getData();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(function (err) {
              console.log(err);
            });
          // this.$message.success('删除成功');
          // this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },

    //停机操作
    handleStop(index, row) {
      // http://192.168.1.27:8001/devcontrol?ipaddr=192.168.0.5&order=stop
      let title = `将对${row.ipaddr}下发停机命令?`;
      this.$confirm(title, "提示", {
        type: "warning",
      })
        .then(() => {
          this.$axios
            .get(`/devcontrol?ipaddr=${row.ipaddr}&order=stop`)
            .then((res) => {
              console.log(res.data);
              // this.tableData = res.data.data;
              // this.pageTotal = res.data.count;
              if (res.data.code == 200) {
                this.$message.success(res.data.message);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(function (err) {
              console.log(err);
            });

          // this.tableData.splice(index, 1);
        })
        .catch(() => {});
    },
    //关闭编辑重置
    closeeditform(editform) {
      this.$refs[editform].resetFields();
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    delAllSelection() {
      const length = this.multipleSelection.length;
      let str = "";
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + " ";
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    //缴费
    handlePay(index, row) {
      this.payVisible = true;
      this.payform.money = "";
      this.payform.ipaddr = row.ipaddr;
    },
    savepay() {
      console.log(this.payform); //http://192.168.1.27:8001/recharge?ipaddr=192.168.0.2&amount=10
      this.$axios
        .get(
          `/recharge?ipaddr=${this.payform.ipaddr}&amount=${this.payform.money}`
        )
        .then((res) => {
          console.log(res);
          if (res.data.code == 115) {
            this.$message.success(res.data.message);
            this.payVisible = false;
            this.getData();
          }
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.payVisible = false;
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index;
      this.editform = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false;
      // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      // this.$set(this.tableData, this.idx, this.form);
      let params = {
        ipaddr: this.editform.ipaddr,
        area: this.editform.area,
        linkman: this.editform.linkman,
        name: this.editform.name,
        phone: this.editform.phone,
        email: this.editform.email,
        remarks: this.editform.remarks,
      };
      this.$axios
        .post("/updateDevUser", params)
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
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
    //添加设备
    handleAdd() {
      this.addVisible = true;
      this.addform.ipaddr = "";
      this.addform.linkman = "";
      this.addform.name = "";
      this.addform.phone = "";
      this.addform.email = "";
      this.addform.remarks = "";
      this.addform.area = "";
    },
    addclosedio(a) {
      console.log(a);

      this.$refs["addform"].resetFields();
    },
    //保存添加
    saveaddbtn() {
      let params = {
        ipaddr: this.addform.ipaddr,
        area: this.addform.area,
        name: this.addform.name,
        linkman: this.addform.linkman,
        phone: this.addform.phone,
        email: this.addform.email,
        remarks: this.addform.remarks,
      };
      this.$axios
        .post("/addDevUser", params)
        .then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.addVisible = false;
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    closepayform(edituserform) {
      console.log(edituserform);
    },
    handleRealdata(index, row) {
      console.log(row);

      this.$router.push({
        path: "/realtimedata",
        query: {
          ipaddr: row.ipaddr,
        },
      });
    },
  },
};
</script>

<style scoped>
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
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.green {
  color: green;
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
</style>
