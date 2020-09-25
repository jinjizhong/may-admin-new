<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="flex">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <p class="left-title">积分获得设置</p>
      </div>

      <p class="line" />

      <div class="content-asign">
        <el-form label-width="100px">
          <el-form-item label="评价获得积分">
            <el-input size="small" type="number" v-model="integral" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submitForm(1)">提交</el-button>
            <el-button size="small" @click="cancel(1)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="flex">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
          <p class="left-title">积分消费设置</p>
      </div>
      <p class="line" />

      <div class="content-asign">
        <el-form label-width="100px">
          <el-form-item label="积分兑换比例">
            <div class="flex">
              <el-input style="width:200px" size="small" type="number" v-model="biliIntegral" />
              <span class="label-width">积分</span>
              <i class="el-icon-sort trans"></i>
              <el-input :disabled="true" size="small" style="width:50px" v-model="money" />
              <span class="label-width">元</span>
            </div>
          </el-form-item>
          <el-form-item label="积分兑换上限">
            <div class="flex">
              <el-input style="width:200px" type="number" size="small" v-model="upIntegral" />
              <span class="label-width">积分</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="submitForm(2)">提交</el-button>
            <el-button size="small" @click="cancel(2)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { inteQuery, inteUpdate } from '@/api/oss.js';
export default {
  name: 'integralManage',
  data () {
    return {
      integral: 100,//评价获得积分
      code1: '',
      code2: '',
      code3: '',
      money: 1,//兑换钱
      biliIntegral: 100,//兑换比例
      upIntegral: 100,//兑换上限
    }
  },
  created () {
    this.getGral();
  },

  methods: {
    /* 获取积分设置信息 */
    getGral () {
      inteQuery().then(res => {
        if (res.success) {
          this.code1 = res.data[0].code
          this.code2 = res.data[1].code
          this.code3 = res.data[2].code
          this.integral = res.data[0].value
          this.biliIntegral = res.data[1].value
          this.upIntegral = res.data[2].value
        }
      })
    },
    /* 提交 */
    submitForm (key) {
      let array = []
      if (this.integral < 0 || this.biliIntegral < 0 || this.upIntegral < 0) {
        this.$message.error('必须设置为正整数')
        return
      }

      if (key == 1) {

        let it = {
          code: this.code1,
          value: this.integral
        }
        array.push(it)
        inteUpdate(array).then(res => {
          if (res.success) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('提交失败')
          }
        })
      } else {
        let it1 = {
          code: this.code2,
          value: this.biliIntegral
        }
        let it2 = {
          code: this.code3,
          value: this.upIntegral
        }
        if (parseFloat(this.biliIntegral) > parseFloat(this.upIntegral)) {
          this.$message.error('兑换比例不能超过兑换上限')
          return
        }
        array.push(it1)
        array.push(it2)
        inteUpdate(array).then(res => {
          if (res.success) {
            this.$message.success('操作成功')
          } else {
            this.$message.error('提交失败')
          }
        })
      }
    },
    /* 取消 */
    cancel (key) {
      if (key == 1) {
        this.integral = 100
      } else {
        this.upIntegral = 100
        this.biliIntegral = 100
      }

    }
  }
}
</script>
<style scoped lang='scss'>
.left-title {
  font-size: 18px;
}
.line {
  width: 100%;
  height: 1px;
  background: #eeeeee;
}
.content-asign {
  display: flex;
  align-items: center;
  // margin-left: 20%;
  width: 100%;
}
.flex {
  display: flex;
  align-items: center;
}
.label-width {
  padding-left: 10px;
  width: 80px;
}
.trans {
  transform: rotate(270deg);
  font-size: 20px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>


