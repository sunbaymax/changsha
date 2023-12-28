<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-redpacket_fill"></i> 历史充值
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="按商户名查询" class="handle-input mr10 " clearable>></el-input>
          <el-input v-model="query.linkman" placeholder="按联系人查询" class="handle-input mr10" clearable>></el-input>
          <el-input v-model="query.phone" placeholder="按手机号查询" class="handle-input mr10" clearable>></el-input>
        
        <!-- <el-date-picker
        
          v-model="choosetime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker> -->
        <el-button type="primary"  class="mr10" icon="el-icon-search" @click="handleSearch">查询</el-button>
        
      </div>
      <el-table
        :data="tableData"
        border
        stripe
        v-loading="loading"
        element-loading-text="拼命加载中"

      >
        
        <el-table-column prop="ipaddr" label="设备地址"></el-table-column>
        <el-table-column prop="account" label="充值金额"></el-table-column>
        <el-table-column prop="time" label="充值时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageIndex"
          :page-sizes="[10,20,50]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        ></el-pagination>
      </div>
    </div>
        <el-dialog title="历史充值" :visible.sync="dialogFormVisible"  width="30%" >
          <el-form :model="form" ref="searchform">
         
            <el-form-item label="设备地址" >
              <el-select v-model="query.ipaddr" placeholder="请选择">
                <el-option
                  v-for="item in form.ipaddr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                   <span style="float: left">{{ item.label }} </span>
                   <span style="float: right; margin-left:30px; color: #8492a6; font-size: 13px" class="choosecenter"><label class="cname">{{ item.name }}</label>  <label  class="clinkman">{{ item.linkman }}</label> <label class="cphone">{{ item.phone }}</label> </span>
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
          <div slot="footer" class="dialog-footer" >
           
            <el-button type="primary" @click="handquery">确 定</el-button>
             <el-button type="success"  icon="el-icon-download" @click="handleexcel">导出</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
import global_msg from '@/utils/global.js'
export default {
  data() {
    return {
      query: {
        ipaddr: "",
        pageIndex: 1,
        pageSize: 10,
         name:'',
        linkman:'',
        phone:'',
      
      },
      form: {
         ipaddr:[],       
         choosetime: [],
      },
      tableData: [],
      pageTotal: 0,
       choosetime: [],
       loading:true,
       dialogFormVisible:false
    
    };
  },
  created() {
    this.getData();
  },
  watch: {
    query: {
      handler(newValue, oldValue) {
        if (newValue.name == ""&&newValue.linkman == ""&&newValue.phone == "") {
          this.getData();
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      //http://114.64.253.136:8011/hisdata?startPage=1&pageSize=10&ipaddr=
      this.$axios
        .get(
          `/hisrecharge?startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}&ipaddr=${this.query.ipaddr}`
        )
        .then(res => {
          console.log(res.data);
          if (res.data.count != 0) {
              setTimeout(()=>{
                 this.loading=false
           },1000)
           
            this.tableData = res.data.data;
            this.pageTotal = res.data.count;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    
    handleexcel(){
      
        let _stime=this.moment(this.form.choosetime[0]).format("YYYY-MM-DD HH:mm:ss");
        let _etime=this.moment(this.form.choosetime[1]).format("YYYY-MM-DD HH:mm:ss");
        window.location.href = `${global_msg.host}/export/rechargereport?ipaddr=${this.query.ipaddr}&stime=${_stime}&etime=${_etime}`
 
    },
    handleSearch() {
      let that=this
      var array=[]
      this.$axios({
          method:'post',
          url:'/getusersvague',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',//设置请求头请求格式为JSON            
          },
          data:{
            name:this.query.name,
            linkman:this.query.linkman,
            phone:this.query.phone
            },          
        }).then((response)=>{
         if(response.data.count>=1){ 
           this.query.ipaddr=''
            this.form.ipaddr=[]
            this.form.choosetime=[]
            let arr=response.data.data           
             this.dialogFormVisible=true;
             arr.forEach(function(item) {
                  let obj={}
                  obj.value=item.ipaddr
                  obj.label=item.ipaddr
                  obj.linkman=item.linkman
                  obj.phone=item.phone
                  obj.name=item.name
                  array.push(obj)
            })
           this.form.ipaddr= array;
           this.query.ipaddr= array[0].value

          }else{
             this.$message.error('没有查询该记录');
              that.tableData = response.data.data;
              that.pageTotal = response.data.count;
             
          }
          
         
         
        }).catch((err)=>{
          console.log(err)
        })    
      //this.getData();

    },
    handquery(){
      
      if(this.form.choosetime.length!=0){
        let _stime=this.moment(this.form.choosetime[0]).format("YYYY-MM-DD HH:mm:ss");
        let _etime=this.moment(this.form.choosetime[1]).format("YYYY-MM-DD HH:mm:ss");
        this.$axios.get(
          `/hisrechargebytime?ipaddr=${this.query.ipaddr}&stime=${_stime}&etime=${_etime}&startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}`
        )
        .then(res => {
          console.log(res.data);
          if (res.data.count != 0) {   
             this.dialogFormVisible=false 
            this.tableData = res.data.data;
            this.pageTotal = res.data.count;
           setTimeout(()=>{
            
                 this.loading=false
           },1500)
            
          } else {
             this.loading=false
            this.tableData = [];
            this.$message.error("没有查询数据");
            this.dialogFormVisible=false
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      }else{

         this.$axios.get(
          `/hisrecharge?startPage=${this.query.pageIndex}&pageSize=${this.query.pageSize}&ipaddr=${this.query.ipaddr}`
        )
        .then(res => {
          console.log(res.data);
          if (res.data.count != 0) {    
            this.tableData = res.data.data;
            this.pageTotal = res.data.count;
              this.dialogFormVisible=false
           setTimeout(()=>{
                 this.loading=false
               
           },1500)
            
          } else {
             this.loading=false
            this.tableData = [];
            this.$message.error("没有查询数据");
            this.dialogFormVisible=false
          }
        })
        .catch(function(err) {
          console.log(err);
        });
      }



    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePageChange(val) {
      this.$set(this.query, "pageSize", val);
      console.log(`当前页: ${val}` + this.query.pageIndex);
      // this.getData();
    },

    handleSizeChange(val) {
      this.$set(this.query, "pageSize", val);
      console.log(`当前条: ${val}`);
      //  this.query.pageSize=val
      // this.getData();
    },

    handleCurrentChange(val) {
      console.log(val);
      // this.query.startPage=val

      this.$set(this.query, "pageIndex", val);
      console.log(`当前页: ${val}` + this.query.pageIndex);
      // this.getData();
    }
  }
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
  width: 300px;
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
.choosecenter .cname{
  display: inline-block;
  width: 60px;
  text-align: left;
}
.choosecenter .clinkman{
  display: inline-block;
  width: 60px;
  text-align: left;
}
.choosecenter .cphone{
  display: inline-block;
  width: 120px;
  text-align: left;
}
</style>
