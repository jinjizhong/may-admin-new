<template>
  <div>
    <div class="top-header">
      <img class="title-img" src="@/assets/images/msgTitle.png" alt="">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar">
          <span class="user-name">{{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="editPwd" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 弹框 -->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="40%">
      <el-form label-width="150px">
        <el-form-item label="原密码：">
          <el-input class="input-width" v-model="oldPwd" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="修改密码：">
          <el-input class="input-width" v-model="newPwd" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：">
          <el-input class="input-width" v-model="comfirmPwd" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updatePassword } from '@/api/login'
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["sidebar", "avatar", "name"])
  },
  data () {
    return {
      dialogVisible: false,
      oldPwd: '',
      newPwd: '',
      comfirmPwd: '',
    };
  },
  methods: {
    editPwd () {
      this.dialogVisible = true
    },
    logout () {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    handleConfirm () {
      let { oldPwd, newPwd, comfirmPwd } = this
      if (!oldPwd) {
        this.$message({
          message: '原密码不可为空',
          type: 'warning'
        });
        return
      } else if (!newPwd) {
        this.$message({
          message: '新密码不可为空',
          type: 'warning'
        });
        return
      } else if (!comfirmPwd) {
        this.$message({
          message: '确认密码不可为空',
          type: 'warning'
        });
        return
      } else if (newPwd != comfirmPwd) {
        this.$message({
          message: '新密码和确认密码不想等',
          type: 'warning'
        });
        return
      } else if (newPwd.length < 3) {
        this.$message({
          message: '新密码的位数不能少于3位',
          type: 'warning'
        });
        return
      }
      let params = {
        confirmPassword: comfirmPwd,
        newPassword: newPwd,
        oldPassword: oldPwd,
        username: this.$store.state.user.name
      }
      this.updatePassword(params)
    },
    updatePassword (_params) {
      updatePassword(_params).then(res => {
        this.$message({
          message: '密码修改成功',
          type: 'success'
        });
        this.logout()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top-header {
  width: 100%;
  height: 61px;
  position: fixed;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #009e96;
  .title-img {
    margin-left: 20px;
  }
}
.avatar-container {
  height: 50px;
  display: inline-block;
  position: absolute;
  right: 50px;
  .avatar-wrapper {
    cursor: pointer;
    position: relative;
    height: 60px;
    display: flex;
    align-items: center;
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 10px;
    }
    .user-name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      padding-left: 10px;
    }
    .el-icon-caret-bottom {
      position: absolute;
      color: #ffffff;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>