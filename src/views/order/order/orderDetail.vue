<template> 
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="预约确认" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="核销完成" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.order.status | formatStatus}}</span>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">订单编号</el-col>
          <el-col :span="6" class="table-cell-title">订单金额</el-col>
          <el-col :span="6" class="table-cell-title">订单来源</el-col>
          <el-col :span="6" class="table-cell-title">支付渠道</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.order.orderNo | formatNull}}</el-col>
          <el-col :span="6" class="table-cell">￥{{order.order.orderAmount}}</el-col>
          <el-col :span="6" class="table-cell">微信小程序</el-col>
          <el-col :span="6" class="table-cell">微信支付</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">车主信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">头像</el-col>
          <el-col :span="6" class="table-cell-title">联系电话</el-col>
          <el-col :span="6" class="table-cell-title">车主姓名</el-col>
          <el-col :span="6" class="table-cell-title">车牌号</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell"><img :src="order.member.icon | formatNull" style="height: 40px"></el-col>
          <el-col :span="6" class="table-cell">{{order.member.mobile | formatNull}}</el-col>
          <el-col :span="6" class="table-cell">{{order.member.realName | formatNull}}</el-col>
          <el-col :span="6" class="table-cell">{{order.order.licensePlate | formatNull}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">套餐信息</span>
      </div>
      <!-- <el-table
        ref="orderItemTable"
        :data="order.order.orderInfo"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.thumbUrl" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="套餐包含内容" width="250" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.productDesc}}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productCount}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.originalPrice}}
          </template>
        </el-table-column>
      </el-table> -->
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.order.orderAmount}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="3" class="table-cell-title">商品合计</el-col>
          <el-col :span="3" class="table-cell-title">运费</el-col>
          <el-col :span="3" class="table-cell-title">优惠券</el-col>
          <el-col :span="3" class="table-cell-title">积分抵扣</el-col>
          <el-col :span="3" class="table-cell-title">活动优惠</el-col>
          <el-col :span="3" class="table-cell-title">折扣金额</el-col>
          <el-col :span="3" class="table-cell-title">订单总金额</el-col>
          <el-col :span="3" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="table-cell">￥{{order.order.orderAmount}}</el-col>
          <el-col :span="3" class="table-cell">￥{{order.order.freightAmount}}</el-col>
          <el-col :span="3" class="table-cell">-￥{{order.order.couponAmount}}</el-col>
          <el-col :span="3" class="table-cell">-￥{{order.order.integrationAmount}}</el-col>
          <el-col :span="3" class="table-cell">-￥{{order.order.promotionAmount}}</el-col>
          <el-col :span="3" class="table-cell">-￥{{order.order.discountAmount}}</el-col>
          <el-col :span="3" class="table-cell">
            <span class="color-danger">￥{{order.order.orderAmount}}</span>
          </el-col>
          <el-col :span="3" class="table-cell">
            <span class="color-danger">￥{{order.order.cashAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.histories" border>
        <el-table-column label="操作者"  align="center">
          <template slot-scope="scope">
            {{scope.row.operateBy}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间"  align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.operateTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  align="center">
          <template slot-scope="scope">
            {{scope.row.status | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.memo}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
  import {getOrderDetail} from '@/api/otoOrder';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {formatDate} from '@/utils/date';
  import VDistpicker from 'v-distpicker';
  const defaultReceiverInfo = {
    orderId:null,
    receiverName:null,
    receiverPhone:null,
    receiverPostCode:null,
    receiverDetailAddress:null,
    receiverProvince:null,
    receiverCity:null,
    receiverRegion:null,
    status:null
  };
  export default {
    name: 'orderDetail',
    components: { VDistpicker, LogisticsDialog},
    data() {
      return {
        id: null,
        order: {},
        receiverDialogVisible:false,
        receiverInfo:Object.assign({},defaultReceiverInfo),
        moneyDialogVisible:false,
        moneyInfo:{orderId:null, freightAmount:0, discountAmount:0,status:null},
        messageDialogVisible:false,
        message: {title:null, content:null},
        closeDialogVisible:false,
        closeInfo:{note:null,id:null},
        markOrderDialogVisible:false,
        markInfo:{note:null},
        logisticsDialogVisible:false
      }
    },
    created() {
      this.id = this.list = this.$route.query.id;
      getOrderDetail(this.id).then(response => {
        this.order = response.data;
      });
    },
    filters: {
      formatNull(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else{
          return value;
        }
      },
      
      formatStatus(value) {
        if (value === 1) {
          return '待发货';
        } else if (value === 2) {
          return '已发货';
        } else if (value === 3) {
          return '已完成';
        } else if (value === 4) {
          return '已关闭';
        } else if (value === 5) {
          return '无效订单';
        } else {
          return '待付款';
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return '未支付';
        } else if(value===4){
          return '已退款';
        }else{
          return '已支付';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0||value === 1) {
          return '未发货';
        } else {
          return '已发货';
        }
      },
      formatProductAttr(value){
        if(value==null){
          return '';
        }else{
          let attr = JSON.parse(value);
          let result='';
          for(let i=0;i<attr.length;i++){
            result+=attr[i].key;
            result+=":";
            result+=attr[i].value;
            result+=";";
          }
          return result;
        }
      }
    },
    methods: {
      onSelectRegion(data){
        this.receiverInfo.receiverProvince=data.province.value;
        this.receiverInfo.receiverCity=data.city.value;
        this.receiverInfo.receiverRegion=data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
        }else {
          //待付款、已关闭、无限订单
          return 1;
        }
      },
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 92%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


