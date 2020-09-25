<template>
  <div class="main-content">
    <transition name="el-fade-in">
      <el-card class="login-form-layout" v-show="!dialogForgetPwd">
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
          <!-- <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div> -->
          <h2 class="login-title">马石油后台管理系统</h2>
          <el-form-item prop="username">
            <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名">
              <span slot="prefix">
                <svg-icon icon-class="user"></svg-icon>
              </span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password"
              autoComplete="on" placeholder="请输入密码">
              <span slot="prefix">
                <svg-icon icon-class="password"></svg-icon>
              </span>
              <span slot="suffix" @click="showPwd">
                <svg-icon icon-class="eye"></svg-icon>
              </span>
            </el-input>
          </el-form-item>
          <div class="color-main fpwd" @click="forgetPwd">
            <p>忘记密码</p>
          </div>
          <el-form-item style="margin-bottom: 20px;text-align: center">
            <el-button class="login-btn" :loading="loading" @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>

    <transition name="el-fade-in-linear">
      <el-card class="login-form-layout" v-show="dialogForgetPwd">
        <div class="forgetPwd" v-if="forgetStep == 1">
          <div class="tit">手机号验证</div>
          <div class="input-block">
            <label>手机号</label>
            <el-input placeholder="请输入手机号" maxlength="11" prefix-icon="el-icon-mobile" clearable
              v-model="forgetPhone" />
          </div>
          <div class="input-block verify">
            <label>验证码</label>
            <el-input placeholder="请输入验证码" maxlength="6" prefix-icon="el-icon-edit" clearable v-model="forgetVerify" />
            <el-button class="login-btn verify-code" @click="sendCode" :disabled="djsStatus">{{djsText}}
            </el-button>
          </div>
          <div class="input-block next">
            <el-button class="login-btn" @click="netxtStep">下一步</el-button>
          </div>
          <div class="input-block login-text" @click="dialogForgetPwd = false">
            密码登录
          </div>
        </div>
        <div class="forgetPwd setting" v-else>
          <div class="tit">设置密码</div>
          <div class="input-block">
            <label>设置密码</label>
            <el-input placeholder="请输入密码" prefix-icon="el-icon-mobile" clearable show-password v-model="newPwd">
            </el-input>
          </div>
          <div class="input-block verify">
            <label>确认密码</label>
            <el-input placeholder="请输入密码" prefix-icon="el-icon-edit" clearable show-password v-model="confimPwd">
            </el-input>
          </div>
          <div class="input-block next">
            <el-button class="login-btn" @click="handleConfirm" :disabled="confimStatus">确认</el-button>
          </div>
          <div class="input-block">
            <a href="javascript:;" class="login-text" @click="forgetStep = 1">返回上一步</a>
            <a href="javascript:;" class="login-text" @click="dialogForgetPwd = false">密码登录</a>
          </div>
        </div>
      </el-card>
    </transition>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate';
import { setSupport, getSupport, setCookie, getCookie } from '@/utils/support';
import { getCaptcha, setNewPassword } from '@/api/login';

export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      dialogVisible: false,
      supportDialogVisible: false,
      dialogForgetPwd: false,
      forgetPhone: '',
      forgetStep: 1,
      forgetVerify: '',
      newPwd: '',
      confimPwd: '',
      djsTimes: 60,//倒计时
      djsText: '获取验证码',//倒计时文案
      djsStatus: false,//是否倒计时
      confimStatus: false,//提交时状态
    }
  },
  created () {
    this.loginForm.username = getCookie("username");
    this.loginForm.password = getCookie("password");
    if (this.loginForm.username === undefined || this.loginForm.username == null || this.loginForm.username === '') {
      this.loginForm.username = 'admin';
    }
    if (this.loginForm.password === undefined || this.loginForm.password == null) {
      this.loginForm.password = '';
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // let isSupport = getSupport();
          // if(isSupport===undefined||isSupport==null){
          //   this.dialogVisible =true;
          //   return;
          // }
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false;
            setCookie("username", this.loginForm.username, 15);
            setCookie("password", this.loginForm.password, 15);
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('参数验证不合法！');
          return false
        }
      })
    },
    handleTry () {
      this.dialogVisible = true
    },
    dialogConfirm () {
      this.dialogVisible = false;
      setSupport(true);
    },
    dialogCancel () {
      this.dialogVisible = false;
      setSupport(false);
    },
    ceshi () {
      this.$router.push({ path: '/' })
    },
    forgetPwd () {
      this.dialogForgetPwd = true;
    },
    handleClose () {
      this.dialogForgetPwd = false;
    },
    handleConfirm () {
      if (this.confimPwd !== this.newPwd) {
        this.$message({
          message: '两次输入的密码不一致',
          type: 'warning'
        });
        return
      }
      this.confimStatus = true
      let params = {
        captcha: this.forgetVerify,
        confirmPassword: this.confimPwd,
        mobile: this.forgetPhone,
        newPassword: this.newPwd
      }
      setNewPassword(params).then(res => {
        this.$message({
          message: '修改成功,请重新登陆您的账号',
          type: 'success'
        });
        this.dialogForgetPwd = false
        this.confimStatus = false
      }, err => {
        this.confimStatus = false
      })
    },
    sendCode () {   // 发送验证码
      if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.forgetPhone)) {
        this.$message({
          message: '请填写正确的手机格式',
          type: 'warning'
        });
      } else {
        this.getCode();
        getCaptcha(this.forgetPhone).then(response => {
          console.log(response);
          this.$message({
            message: '发送成功',
            type: 'success'
          });
        })

      }
    },
    netxtStep () {
      if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.forgetPhone)) {
        this.$message({
          message: '请填写正确的手机格式',
          type: 'warning'
        });
      } else if (this.forgetVerify == "") {
        this.$message({
          message: '请填写验证码',
          type: 'warning'
        });
      } else {
        this.forgetStep = 2;
      }
    },
    getCode () {
      this.djsText = this.djsTimes
      this.djsStatus = true
      this.timer = setInterval(() => {
        this.djsText--
        if (this.djsText === 0) {
          this.djsText = '获取验证码'
          this.djsStatus = false
          clearInterval(this.timer)
        }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.main-content {
  height: 100vh;
  width: 100%;
  background: url("~@/assets/images/loginBg.png") no-repeat center;
  background-size: cover;
}
.login-form-layout {
  position: absolute;
  top: 30%;
  right: 20%;
  width: 360px;
  height: 330px;
  /* margin: 140px auto; */
}

.login-title {
  text-align: center;
  color: #141414;
}
.login-btn {
  width: 100%;
  background: #009e96;
  color: #ffffff;
}
.fpwd {
  font-size: 12px;
  padding-bottom: 10px;
  cursor: pointer;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #009e96;
  text-align: right;
}
.forgetPwd {
  margin-top: 12px;
}
.forgetPwd .tit {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  text-align: center;
  color: #141414;
}
.forgetPwd .input-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 25px;
}
.login-text {
  font-size: 12px;
  font-family: Microsoft YaHei;
  float: right;
  cursor: pointer;
  font-weight: 400;
  color: #898989;
}
.forgetPwd .input-block label {
  width: 60px;
}
.setting .input-block label {
  width: 100px;
}
.forgetPwd .verify .el-input {
  width: 52%;
}
.verify-code {
  width: 100px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.setting .verify .el-input {
  width: 100%;
}
.forgetPwd .verify .el-button--success {
  margin-left: 15px;
}
.forgetPwd .next button {
  width: 100%;
}
</style>
