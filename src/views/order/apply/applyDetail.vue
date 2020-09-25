<template>
  <div class="detail-container">
    <el-card shadow="never" style="margin-top: 15px">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>客户退款申请</span>
      </div>
      <div class="table-layout paddingb20">
        <el-row>
          <el-col :span="8" class="font-small">订单号：{{order.refund.refundNo}}</el-col>
          <el-col :span="8" class="font-small">支付编号：{{order.refund.payNo}}</el-col>
          <el-col :span="8" class="font-small">退款原因：{{order.refund.reason}}</el-col>
        </el-row>
        <div class="font-small">实际退款金额：{{order.refund.refundAmount}}</div>
        <div class="closeFloat">
          <!-- <div class="font-small" style="float:left;color:#FF0000">请在36个小时内审核，若超时后无处理，系统则自动退款给客户</div> -->
          <div style="float:right">
            <el-button class="refound" size="mini" @click="handleUpdate()">不同意退款</el-button>
            <el-button class="accept mr20" size="mini" @click="handleRelease()">同意退款</el-button>
          </div>
        </div>
        <div></div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>车主信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="font-small">联系电话：{{order.order.mobile}}</el-col>
          <el-col :span="8" class="font-small">车主姓名：{{order.order.realName}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>门店信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="font-small">门店名称：{{order.store.name}}</el-col>
          <el-col :span="8" class="font-small">门店地址：{{order.store.address2}}</el-col>
          <el-col :span="8" class="font-small">门店电话：{{order.store.phone}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>套餐信息</span>
      </div>
      <div class="table-layout">
        <el-row style="margin-top:20px">
          <el-col :span="5" class="table-cell-title">商品图片</el-col>
          <el-col :span="4" class="table-cell-title">单价</el-col>
          <el-col :span="5" class="table-cell-title">实际付款金额</el-col>
          <el-col :span="5" class="table-cell-title">数量</el-col>
          <el-col :span="5" class="table-cell-title">积分抵扣金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="5" class="table-cell">
            <img :src="order.packageInfo.imageUrl | formatNull" style="height: 40px">
          </el-col>
          <el-col :span="4" class="table-cell">{{order.order.orderAmount | formatNull}}</el-col>
          <el-col :span="5" class="table-cell">{{order.order.cashAmount | formatNull}}</el-col>
          <el-col :span="5" class="table-cell">{{order.packageInfo.productCount | formatNull}}</el-col>
          <el-col :span="5" class="table-cell">{{order.order.integrationAmount||0}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>退款信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="font-small">退款状态：{{order.refund.status | formatStatus}}</el-col>
          <el-col :span="8" class="font-small">退款原因：{{order.refund.reason}}</el-col>
          <el-col :span="8" class="font-small">退款金额：{{order.refund.refundAmount}}</el-col>
          <el-col :span="8" class="font-small">退款渠道：微信小程序</el-col>
          <el-col :span="8" class="font-small">申请时间：{{order.refund.applyTime | formatCreateTime}}</el-col>
        </el-row>
      </div>
    </el-card>
    <el-dialog :title="isEdit?'退款审核':'退款审核'" :visible.sync="dialogVisible" width="40%">
      <el-form ref="roleForm" label-width="150px" size="small">
        <el-form-item label="退款原因:">
          <el-select v-model="reasonId" class="input-width" placeholder="全部" clearable>
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="tuikuanRemark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleReject()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import { getApplyDetail, reject, release, fetchReason } from "@/api/otoApply";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
import { formatDate } from "@/utils/date";
import VDistpicker from "v-distpicker";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10
};
const defaultReceiverInfo = {
  orderId: null,
  receiverName: null,
  receiverPhone: null,
  receiverPostCode: null,
  receiverDetailAddress: null,
  receiverProvince: null,
  receiverCity: null,
  receiverRegion: null,
  status: null
};

export default {
  name: "orderDetail",
  components: { VDistpicker, LogisticsDialog },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      id: null,
      order: {},
      isEdit: false,
      dialogVisible: false,
      listLoading: true,
      receiverDialogVisible: false,
      receiverInfo: Object.assign({}, defaultReceiverInfo),
      moneyDialogVisible: false,
      moneyInfo: {
        orderId: null,
        freightAmount: 0,
        discountAmount: 0,
        status: null
      },
      messageDialogVisible: false,
      message: { title: null, content: null },
      closeDialogVisible: false,
      closeInfo: { note: null, id: null },
      markOrderDialogVisible: false,
      markInfo: { note: null },
      logisticsDialogVisible: false,
      orderTypeOptions: [],
      reasonId: null,
      tuikuanRemark: "" //退款备注
    };
  },
  created() {
    this.id = this.list = this.$route.query.id;
    getApplyDetail(this.id).then(response => {
      this.order = response.data;
    });
    fetchReason().then(response => {
      this.orderTypeOptions = response.data;
    });
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatNull(value) {
      if (value === undefined || value === null || value === "") {
        return "暂无";
      } else {
        return value;
      }
    },

    formatStatus(value) {
      if (value === 0) {
        return "待处理";
      } else if (value === 1) {
        return "已审核";
      } else if (value === 2) {
        return "已拒绝";
      } else if (value === 3) {
        return "已退款";
      } else if (value === 4) {
        return "退款失败";
      }
    },
    formatProductAttr(value) {
      if (value == null) {
        return "";
      } else {
        let attr = JSON.parse(value);
        let result = "";
        for (let i = 0; i < attr.length; i++) {
          result += attr[i].key;
          result += ":";
          result += attr[i].value;
          result += ";";
        }
        return result;
      }
    }
  },
  methods: {
    onSelectRegion(data) {
      this.receiverInfo.receiverProvince = data.province.value;
      this.receiverInfo.receiverCity = data.city.value;
      this.receiverInfo.receiverRegion = data.area.value;
    },
    //退款原因查询

    formatTime(time) {
      if (time == null || time === "") {
        return "";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    handleUpdate() {
      this.dialogVisible = true;
    },
    handleReject() {
      let params = {
        id: this.id,
        reasonId: this.reasonId,
        memo: this.tuikuanRemark
      };
      reject(params).then(response => {
        this.$router.push({ path: "/order/returnApply" });
      });
    },
    handleRelease() {
      let params = {
        orderId: this.id
      };
      release(params).then(response => {
        this.$router.push({ path: "/order/returnApply" });
      });
    },
    formatStepStatus(value) {
      if (value === 1) {
        //待发货
        return 2;
      } else if (value === 2) {
        //已发货
        return 3;
      } else if (value === 3) {
        //已完成
        return 4;
      } else {
        //待付款、已关闭、无限订单
        return 1;
      }
    }
  }
};
</script>
<style scoped>
.detail-container {
  width: 92%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #f2f6fc;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px;
}

.closeFloat {
  overflow: hidden;
}

.table-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  background: #f2f6fc;
  text-align: center;
  font-size: 14px;
  color: #303133;
}

.font-small {
  padding: 10px;
}
.refound {
  border: 1px solid #009e96;
  border-radius: 4px;
  color: #009e96;
}
.accept {
  background: #009e96;
  border-radius: 4px;
  color: #ffffff;
}
</style>