<template>
  <div class="login-container">
    <el-form
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
      label-width="0px"
      class="card-box login-form"
    >
      <div class="content">
        <p class="title">长沙绿色食品交易中心计费系统</p>
        <p class="desc">一款让海鲜租赁市场更高效的智能平台</p>
        <div class="forminput">
          <el-form-item prop="username">
            <span class="svg-container svg-container_login">
              <i class="el-icon-user"></i>
            </span>
            <el-input
              name="username"
              type="text"
              v-model="loginForm.username"
              autocomplete="on"
              placeholder="请输入管理员姓名"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container svg-container_pwd">
              <i class="el-icon-lock"></i>
            </span>
            <el-input
              name="password"
              :type="pwdType"
              @keyup.enter.native="handleLogin"
              v-model="loginForm.password"
              autocomplete="on"
              placeholder="请输入登录密码"
            ></el-input>
            <span class="show-pwd" @click="showPwd">
              <!-- <svg-icon icon-class="eye" /> -->
            </span>
          </el-form-item>
          <el-form-item class="lastformitem1">
            <!-- <el-checkbox v-model="checked">记住用户名</el-checkbox> -->
               <img  @click="ischecked" v-if="checked" src="../../assets/images/img/chooseno.png"/>
               <img  @click="ischecked" v-else src="../../assets/images/img/choose-ok.png"/>
               <span>记住密码</span>
          </el-form-item>
        </div>
        <el-form-item class="lastformitem">
          <el-button type="primary" round :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from "@/utils/validate";

export default {
  name: "login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error("请输入正确的用户名"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error("密码不能小于5位"));
      } else {
        callback();
      }
    };
    return {
      checked: true,
      loginForm: {
        username: "admin",
        password: "123456"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      pwdType: "password"
    };
  },
  created(){
    this.readyip();
  },
  methods: {
    ischecked(){
      console.log("11")
      this.checked=!this.checked;
    },
    readyip() {
      var cip = returnCitySN["cip"];
      var cityname = returnCitySN["cname"].indexOf("北京") != -1?"北京市":"长沙市";
      //给vuedata对象里的字段赋值
      this.ip = cip;
      localStorage.setItem("Ip", cip);
      localStorage.setItem("cityname", cityname);
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          let params = {
            username: this.loginForm.username,
            password: this.loginForm.password
          };
          //http://linke58.com/hly/api/Login.php
          this.$axios
            .post("/login", this.$qs.stringify(params))
            .then(res => {
              console.log(res);
              //  return false;
              if (res.data.code == "200") {
                this.$message.success("登录成功");
                let userinfo = res.data;
                sessionStorage.setItem("user", JSON.stringify(userinfo));
                this.$router.push({ path: "/" });
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
    }
  }
};
</script>

<style  lang="less">
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("~@/assets/images/img/loginbg.png") no-repeat;
  background-size: 100% 100%;

  input {
    background: none;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 12px 5px 12px 15px;
    color: #333333;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }
  .tips {
    font-size: 24px;
    color: #fff;
    margin-bottom: 10px;
  }
  .svg-container {
    padding: 6px 5px 6px 5px;
    color: #306BEB;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      // padding-left:0;
      font-size: 26px;
    }
    &_pwd {
      font-size: 26px;
    }
  }

  .login-form {
    position: absolute;
    top: 22%;
    right: 5.5%;
    width: 28%;
    height: 56%;
    background: url("~@/assets/images/img/loginform.png") no-repeat;
    //  width: 26%;
    //  height: 60%;
    //  right: 10%;
    //  top: 20%;
    // background: #ffffff;
    // opacity:0.9;
    // filter:alpha(opacity=90);
    border-radius: 20px;
    background-size: 100% 100%;
    text-align: center;
  }

/*当屏幕小于1200px*/



// 此处针对992~1200px屏幕的css属性，当屏幕小于992时会继续引用默认的css属性，除非重新设置屏幕小于992的CSS属性。
  .title {
    font-size: 28px;
    font-weight: 546;
    color: #333333;
    width: 100%;
    // margin: 0px auto 40px auto;
    text-align: center;
    // font-weight: bold;
    position: absolute;
    top: 0%;
    // left: 5%;
  }
  .desc {
    text-align: left;
    font-size: 14px;
    color: #999999;
     width: 90%;
    position: absolute;
    left: 10%;
    top: 14%;
    letter-spacing:4px;
  }
  .forminput {
    position: absolute;
    top: 30%;
    left: 8%;
    width: 334px;
    z-index: 99;
    // border: 1px solid #dd0000;
  }
  .el-form-item {
    // border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  //    position: absolute;
  //  bottom: 0;
    
  }
  .forminput .el-form-item__content {
    line-height: 46px;
    display: flex;
    align-items: center;
    position: relative;
    font-size: 20px;
    border-bottom: 1px solid #ededed;
  }
  .forminput .lastformitem1 .el-form-item__content {
  
    border: none;
    text-align: left;
  }
  .forminput .lastformitem1 img {
     margin-left: 8px;
    width: 19px;
    height: 18px;
    color: #999999;
    font-size:18px ;
  }
  .forminput .lastformitem1 span {
    margin-left: 10px;
    color: #999999;
    font-size:18px ;
  }
  .forminput .lastformitem .el-form-item__content {
    border: none;

  }

  @media screen and (min-width:1200px) and (max-width:1440px){
      .login-form {
    position: absolute;
    top: 22%;
    right: 5.5%;
    width: 28%;
    height: 60%;
    background: url("~@/assets/images/img/loginform.png") no-repeat;
    border-radius: 20px;
    background-size: 100% 100%;
    text-align: center;
  }
  .content {
    margin: 12% auto 18%;
    width: 90%;
    height: 70%;
    // border: 1px solid #ff0000;
    position: relative;
  }
  .content .lastformitem .el-button {
    margin-top: 68%;
    // margin-left: 23%;
    display: inline-block;
    width: 296px;
    height: 50px;
    background: #0f64fd;
    font-size: 20px;
    border-radius: 50px;
  

  }
}
@media screen and (min-width:1440px) and (max-width:1920px){
    .content {
    margin: 12.2% auto;
    width: 90%;
    height: 66%;
    // border: 1px solid #ff0000;
    position: relative;
  }
  .content .lastformitem .el-button {
    margin-top: 70%;
    // margin-left: 23%;
    display: inline-block;
    width: 296px;
    height: 50px;
    background: #0f64fd;
    font-size: 20px;
    border-radius: 50px;
  

  }
}

  .el-input__inner {
    background: none;
    font-size: 18px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 24px;
    color: #333333;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
    background: #0f64fd;
  }
}
</style>
