<template>
  <div class="app-container">
    <div class="total-layout">
      <!-- <div class="layout-title">待处理事务</div> -->
      <el-row :gutter="20">
        <el-col :span="6" class="clo20">
          <div class="total-frame img1">
            <img :src="mendian" class="total-icon">
            <div class="total-title">门店数量</div>
            <div class="total-value">{{waitToHandleData.store}}</div>
          </div>
        </el-col>
        <el-col :span="6" class="clo20">
          <div class="total-frame img2">
            <img :src="zaishou" class="total-icon">
            <div class="total-title">在售商品数量</div>
            <div class="total-value">{{waitToHandleData.package}}</div>
          </div>
        </el-col>
        <el-col :span="6" class="clo20">
          <div class="total-frame img3">
            <img :src="fukuan" class="total-icon">
            <div class="total-title">付款订单</div>
            <div class="total-value">{{waitToHandleData.order}}</div>
          </div>
        </el-col>
        <el-col :span="6" class="clo20">
          <div class="total-frame img4">
            <img :src="tuikuan" class="total-icon">
            <div class="total-title">待退款订单</div>
            <div class="total-value">{{waitToHandleData.refund}}</div>
          </div>
        </el-col>
        <el-col :span="6" class="clo20">
          <div class="total-frame img5">
            <img :src="kehu" class="total-icon">
            <div class="total-title">客户数</div>
            <div class="total-value">{{waitToHandleData.member}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="6" class="clo25">
          <div class="total-frame" style="height: 257px;">
            <div class="title top-bg">交易概况 今日</div>
            <div class="disflex">
              <div class="left flex">
                <div class="main-color">
                  <img src="@/assets/main/1.png" alt="">
                  下单笔数
                </div>
                <div class="num">{{todaySummaryData.orderCount}}</div>
              </div>
              <div class="right flex">
                <div class="main-color">
                  <img src="@/assets/main/3.png" alt="">
                  下单金额
                </div>
                <div class="num">{{todaySummaryData.orderAmount}}</div>
              </div>
            </div>
            <div class="disflex">
              <div class="left flex">
                <div class="main-color">
                  <img src="@/assets/main/3.png" alt="">
                  待付款订单数
                </div>
                <div class="num">{{todaySummaryData.unpaidOrderCount}}</div>
              </div>
              <div class="right flex">
                <div class="main-color">
                  <img src="@/assets/main/4.png" alt="">
                  付款金额
                </div>
                <div class="num">{{todaySummaryData.unpaidOrderAmount}}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="clo25">
          <div class="total-frame" style="height: 257px;">
            <div class="title top-bg">商品概况 今日</div>
            <div class="disflex">
              <div class="left flex">
                <div class="main-color">
                  <img src="@/assets/main/5.png" alt="">
                  商品总数SKU
                </div>
                <div class="num">{{todaySummaryData.packageCount}}</div>
              </div>
              <div class="right flex">
                <div class="main-color">
                  <img src="@/assets/main/8.png" alt="">
                  销售中商品SKU
                </div>
                <div class="num">{{todaySummaryData.salePackageCount}}</div>
              </div>
              <!-- <div class="right flex">
                <div class="main-color">
                  <img src="@/assets/main/6.png" alt="">
                  已审核商品SKU
                </div>
                <div class="num">{{todaySummaryData.onlinePackageCount}}</div>
              </div> -->
            </div>
            <div class="disflex">
              <!-- <div class="left flex">
                <div class="main-color">
                  <img src="@/assets/main/7.png" alt="">
                  上架商品数
                </div>
                <div class="num">{{todaySummaryData.onlinePackageCount}}</div>
              </div> -->

            </div>
          </div>
        </el-col>
        <el-col :span="6" class="clo25">
          <div class="total-frame" style="height: 257px;">
            <div class="title top-bg">客户概况</div>
            <div class="disflex">
              <div class="left flex">
                <div class="ht-color">
                  <img src="@/assets/main/9.png" alt="">
                  客户总数
                </div>
                <div class="num">{{todaySummaryData.memberCount}}</div>
              </div>
              <div class="right flex">
                <div class="ht-color">
                  <img src="@/assets/main/10.png" alt="">
                  新增客户数
                </div>
                <div class="num">{{todaySummaryData.todayMemberCount}}</div>
              </div>
            </div>
            <div class="disflex">
              <div class="left flex">
                <div class="ht-color">
                  <img src="@/assets/main/11.png" alt="">
                  上架商品数
                </div>
                <div class="num">{{todaySummaryData.onlinePackageCount}}</div>
              </div>
              <div class="right flex">
                <div class="ht-color">
                  <img src="@/assets/main/12.png" alt="">
                  销售中商品SKU
                </div>
                <div class="num">{{todaySummaryData.salePackageCount}}</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="clo25">
          <div class="total-frame" style="height: 257px;">
            <div class="title">020小程序</div>
            <img class="otoimg" src="@/assets/images/wx.png">
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <el-row :gutter="20">
        <el-col :span="6" class="clo50">
          <div class="total-frame">
            <div class="title top-bg">
              店铺交易排行榜 Top 10
            </div>
            <el-table ref="returnReasonTable" :data="topRankingData.store" style="width: 100%;"
              @selection-change="handleSelectionChange" v-loading="listLoading" max-height="350">
              <el-table-column label="序号" width="80" align="center">
                <template slot-scope="scope">{{scope.row.storeId}}</template>
              </el-table-column>
              <el-table-column label="店铺名称" align="center">
                <template slot-scope="scope">{{scope.row.storeName}}</template>
              </el-table-column>
              <el-table-column label="下单笔数" width="100" align="center">
                <template slot-scope="scope">{{scope.row.orderCount}}</template>
              </el-table-column>
              <el-table-column label="下单人员" width="100" align="center">
                <template slot-scope="scope">{{scope.row.memberCount}}</template>
              </el-table-column>
              <el-table-column label="下单金额" width="100" align="center">
                <template slot-scope="scope">{{scope.row.orderAmount}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>

        <el-col :span="6" class="clo50">
          <div class="total-frame">
            <div class="title top-bg">
              商品销量 Top 10
            </div>
            <el-table ref="returnReasonTable" :data="topRankingData.package" style="width: 100%;"
              @selection-change="handleSelectionChange" v-loading="listLoading" max-height="350">
              <el-table-column label="序号" width="80" align="center">
                <template slot-scope="scope">{{scope.row.packageId}}</template>
              </el-table-column>
              <el-table-column label="商品名称" align="center">
                <template slot-scope="scope">{{scope.row.packageName}}</template>
              </el-table-column>
              <el-table-column label="下单笔数" width="100" align="center">
                <template slot-scope="scope">{{scope.row.orderCount}}</template>
              </el-table-column>
              <el-table-column label="下单人员" width="100" align="center">
                <template slot-scope="scope">{{scope.row.memberCount}}</template>
              </el-table-column>
              <el-table-column label="下单金额" width="100" align="center">
                <template slot-scope="scope">{{scope.row.orderAmount}}</template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getTodaySummary, getTopRanking, geWaitToHandle } from '@/api/otoHome';
import { str2Date } from '@/utils/date';
import fukuan from '@/assets/main/fukuan.png';
import kehu from '@/assets/main/kehu.png';
import mendian from '@/assets/main/mendian.png';
import tuikuan from '@/assets/main/tuikuan.png';
import zaishou from '@/assets/main/zaishou.png';
export default {
  name: 'home',
  data () {
    return {
      loading: false,
      dataEmpty: false,
      fukuan,
      kehu,
      mendian,
      tuikuan,
      zaishou,
      todaySummaryData: {},
      topRankingData: {},
      waitToHandleData: {},
      listLoading: false,
    }
  },
  created () {
    this.todaySummary()
    this.topRanking()
    this.waitToHandle()
  },
  methods: {
    //今日概况
    todaySummary () {
      getTodaySummary().then(response => {
        this.todaySummaryData = response.data;
      });
    },
    //Top排行榜
    topRanking () {
      getTopRanking().then(response => {
        this.topRankingData = response.data;
      });
    },
    //待处理事项
    waitToHandle () {
      geWaitToHandle().then(response => {
        this.waitToHandleData = response.data;
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
  }
}
</script>

<style scoped>
.app-container {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
.main-color {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #009e96;
}
.main-color img {
  padding-right: 4px;
}
.ht-color {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #e8ad22;
}
.ht-color img {
  padding-right: 4px;
}
.num {
  font-size: 25px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #565656;
}
.total-layout {
  margin-top: 20px;
  background: #f7f7f7;
  padding: 10px;
  border-radius: 20px;
}
.clo20 {
  width: 20% !important;
}
.clo25 {
  width: 25% !important;
  background-color: #ffffff;
}
.clo50 {
  width: 50% !important;
  background-color: #ffffff;
}
.total-frame {
  border: 1px solid #dcdfe6;
  color: #ffffff;
  padding: 10px 10px;
  height: 80px;
  /* margin-top: 10px;
  margin-bottom: 10px; */
  border-radius: 10px;
}
.img1 {
  background: url("~@/assets/main/bg1.png") no-repeat center;
  background-size: cover;
}
.img2 {
  background: url("~@/assets/main/bg2.png") no-repeat center;
  background-size: cover;
}
.img3 {
  background: url("~@/assets/main/bg3.png") no-repeat center;
  background-size: cover;
}
.img4 {
  background: url("~@/assets/main/bg4.png") no-repeat center;
  background-size: cover;
}
.img5 {
  background: url("~@/assets/main/bg5.png") no-repeat center;
  background-size: cover;
}
.total-icon {
  /* width: 60px;
  height: 60px; */
  padding: 5px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
  left: 70px;
  top: -45px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
  left: 70px;
  top: -35px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f7f7f7;
  font-weight: bold;
}

.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #ebeef5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-layout .title {
  color: #606266;
  padding: 15px 0;
  background: #ffffff;
  font-weight: bold;
}
.overview-layout .disflex {
  display: flex;
  color: #333333;
  background: #ffffff;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  border-radius: 2px;
  margin-bottom: 20px;
}
.overview-layout .total-frame {
  background: #ffffff;
  height: auto;
}
.overview-layout .flex {
  flex: 1;
}

.overview-layout .otoimg {
  display: block;
  width: 160px;
  margin: 0 auto;
}
.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #dcdfe6;
}

.statistics-layout {
  margin-top: 20px;
}

.statistics-layout .title {
  color: #606266;
  padding: 15px 0;
  font-weight: bold;
}
.statistics-layout .disflex {
  display: flex;
  color: #333333;
  background: #ffffff;
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  border-radius: 2px;
}
.statistics-layout .content {
  background: #ffffff;
  line-height: 50px;
  border-radius: 0px;
  border-bottom: 1px solid #fafafa;
}
.statistics-layout .total-frame {
  background: #ffffff;
  padding: 0;
  height: auto;
}
.statistics-layout .flex {
  flex: 1;
}
.top-bg {
  width: 100%;
  height: 48px;
  text-align: center;
  background: #f8f8f8;
}
.mine-layout {
  position: absolute;
  right: 140px;
  top: 107px;
  width: 250px;
  height: 235px;
}
.address-content {
  padding: 20px;
  font-size: 18px;
}
.qrcode {
  display: block;
  width: 120px;

  margin: 0 auto;
}
</style>
