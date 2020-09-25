<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="客户名称：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="请输入客户名称"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-select v-model="listQuery.sourceType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in sourceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对账单号：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="请输入对账单号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="handleSearchList()" size="small">
          查询
        </el-button>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="对账订单号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="套餐名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.created | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="付款时间" align="center">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column label="合计金额" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
        </el-table-column>
        <el-table-column label="实收金额" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
        </el-table-column>
        <el-table-column label="门店分成" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
        </el-table-column>
        <el-table-column label="经销商分成" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
        </el-table-column>
        <el-table-column label="运营商分成" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import { fetchList, closeOrder, deleteOrder } from '@/api/otoOrder'
import { formatDate } from '@/utils/date';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null,
};
export default {
  name: "orderList",
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      listLoading: false,
      list: null,
      total: null,
      operateType: null,
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      statusOptions: [
        {
          label: '待付款',
          value: 0
        },
        {
          label: '待发货',
          value: 1
        },
        {
          label: '已发货',
          value: 2
        },
        {
          label: '已完成',
          value: 3
        },
        {
          label: '已关闭',
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: '普通订单',
          value: 0
        },
      ],
      sourceTypeOptions: [
        {
          label: '微信小程序',
          value: 0
        },
      ],
      logisticsDialogVisible: false
    }
  },
  created () {
    // this.getList();
  },
  filters: {
    formatCreateTime (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatStatus (value) {
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
  },
  methods: {
    handleResetSearch () {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList () {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleViewOrder (index, row) {
      this.$router.push({ path: '/order/orderDetail', query: { id: row.id } })
    },
    handleCloseOrder (index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleSizeChange (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
  }
}
</script>
<style scoped>
.input-width {
  width: 203px;
}
</style>


