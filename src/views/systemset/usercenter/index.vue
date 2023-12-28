<template>
  <div class="app-container" >
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/usercenter' }">用户信息</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
       <div class="content">
      <div class="handle-box">
        <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10" clearable>></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button type="success " icon="el-icon-plus" @click="handleAdduser">添加</el-button>
      </div>
      <el-table :data="tableData" border  
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"
     
        >
        <!-- <el-table-column type="selection" prop="id" width="55" align="center"></el-table-column> -->
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="role" label="角色ID"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="createtime" label="创建时间"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>

        <el-table-column label="设置" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleuserEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleuserDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="tableData.length>0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageIndex"
          :page-sizes="[5,10,20,50]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        ></el-pagination>
      
    </div>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addVisible"
      width="30%"
      @close="closeDialog('adduserform')"
    >
      <el-form ref="adduserform" :model="adduserform" :rules="adduserrules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="adduserform.username"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="adduserform.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="adduserform.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="adduserform.phone" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="adduserform.mail" type="text"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="adduserform.role" placeholder="请选择角色" style="width:100%">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="adduserform.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveadduser('adduserform')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑用户"
      :visible.sync="editVisible"
      width="30%"
      @close="closeeditDialog('edituserform')"
    >
      <el-form ref="edituserform" :model="edituserform" :rules="edituserrules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="edituserform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="edituserform.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="edituserform.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="edituserform.phone" type="text"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituserform.email" type="text"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="edituserform.role" placeholder="请选择角色" style="width:100%">
            <el-option label="0" value="0"></el-option>
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="edituserform.remarks"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveedituser('edituserform')">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
// import { fetchData } from '../../api/index';
export default {
  name: "basetable",
  data() {
    var checkPhone = (rule, value, callback) => {
      const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
      if (!value) {
        return callback(new Error("电话号码不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (phoneReg.test(value)) {
            callback();
          } else {
            callback(new Error("电话号码格式不正确"));
          }
        }
      }, 100);
    };

    return {
      loading:true,
      query: {
        username: "",
        pageIndex: 1,
        pageSize: 5
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      addVisible: false,
      editVisible: false,
      pageTotal: 0,
      adduserform: {
        username: "",
        name: "",
        password: "",
        role: "",
        address: "",
        mail: "",
        remarks: ""
      },
      adduserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { required: true, validator: checkPhone, trigger: "blur" }
        ],
        mail: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      edituserform: {
        username: "",
        name: "",
        password: "",
        phone: "",
        role: "",
        email: "",
        remarks: ""
      },
      edituserrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],

        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { required: true, validator: checkPhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      idx: -1,
      id: -1
    };
  },

  created() {
    this.getData();
  },
  watch: {
    query: {
      handler(newValue, oldValue) {
        console.log(newValue);
        if (newValue.username == "") {
          this.getData();
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData() {
      //http://linke58.com/hly/api/Login.php listuser?index=1&size=15
      this.$axios
        .get(
          `/listuser?startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}`
        )
        .then(res => {
          console.log(res.data);
          this.tableData = res.data.data;
          this.pageTotal = res.data.total;
            setTimeout(()=>{
                 this.loading=false
           },1500)
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    // 触发搜索按钮
    handleSearch() {
      let one = [];
      // this.$set(this.query, 'pageIndex', 1);
      this.$axios
        .get(`/getuser?username=${this.query.username}`)
        .then(res => {
          if (res.data.code == 200 && res.data.data != undefined) {
            one.push(res.data.data);
            this.tableData = one;
            this.pageTotal = 1;
          } else {
            this.tableData = [];
            this.$message.error("没有查询到该用户");
          }
        })
        .catch(function(err) {
          console.log(err);
        });

      // this.getData();
    },
    // 删除操作
    handleuserDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          // this.$message.success('删除成功');
          // this.tableData.splice(index, 1);
          //http://114.64.253.136:8011/deleteuser?username=888
          this.$axios
            .get(`/deleteuser?username=${row.username}`)
            .then(res => {
              console.log(res.data);
              // this.tableData = res.data.data;
              // this.pageTotal = res.data.count;
              if (res.data.code == 200) {
                this.$message.success("删除成功！");
                this.getData();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    //停机操作
    handleStop(index, row) {
      // http://192.168.1.27:8001/devcontrol?ipaddr=192.168.0.5&order=stop
      let title = `将对${row.ipaddr}下发停机命令?`;
      this.$confirm(title, "提示", {
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(`/devcontrol?ipaddr=${row.ipaddr}&order=stop`)
            .then(res => {
              console.log(res.data);
              // this.tableData = res.data.data;
              // this.pageTotal = res.data.count;
              if (res.data.code == 200) {
                this.$message.success(res.data.message);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(function(err) {
              console.log(err);
            });

          // this.tableData.splice(index, 1);
        })
        .catch(() => {});
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
      console.log(index);
      console.log(row);
    },
    savepay() {
      console.log(this.payform);
      //http://192.168.1.27:8001/recharge?ipaddr=192.168.0.2&amount=10
      this.$axios
        .get(
          `/recharge?ipaddr=${this.payform.ipaddr}&amount=${this.payform.money}`
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 115) {
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    // 编辑操作
    handleuserEdit(index, row) {
      console.log(row);
      this.edituserform = row;
      this.editVisible = true;
    },
    // 保存编辑
    saveadduser(adduserform) {
      // console.log(adduserform);
      // return
      this.$refs[adduserform].validate(valid => {
        if (valid) {
          // alert('submit!');
          let params = {
            username: this.adduserform.username,
            name: this.adduserform.name,
            password: this.adduserform.password,
            role: this.adduserform.role,
            phone: this.adduserform.phone,
            email: this.adduserform.mail,
            remarks: this.adduserform.remarks
          };
          this.$axios
            .post("/adduser", params)
            .then(res => {
              console.log(res);
              if (res.data.code == 200) {
                this.addVisible = false;
                this.$message.success(res.data.message);
                this.getData();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(function(err) {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
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
    //添加用户
    handleAdduser() {
      this.addVisible = true;
    },
    //关闭新增用户重置
    closeDialog(adduserform) {
      // console.log('55');
      console.log(this.$refs[adduserform]);
      this.$refs[adduserform].resetFields();
    },
    //关闭用户重置
    closeeditDialog(edituserform) {
      // console.log('55');
      console.log(this.$refs[edituserform]);
      this.$refs[edituserform].resetFields();
    },
    //修改用户
    saveedituser(edituserform) {
      console.log(edituserform);
      let params = {
        username: this.edituserform.username,
        name: this.edituserform.name,
        password:
          this.edituserform.password == undefined
            ? ""
            : this.edituserform.password,
        role: this.edituserform.role,
        phone: this.edituserform.phone,
        email: this.edituserform.email,
        remarks: this.edituserform.remarks
      };
      this.$axios
        .post("/updateuser",params)
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.editVisible = false;
            this.$message.success(res.data.message);
            this.getData();
          } else {
            this.$message.error(res.data.message);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>

.title {
  height: 230px;
  border-radius: 5px;
  padding: 40px 20px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}

</style>
