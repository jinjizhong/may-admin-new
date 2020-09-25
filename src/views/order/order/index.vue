<template>
  <div class="app-container">
    <el-card class="filter-container paddingb20" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="订单编号">
            <el-input v-model="listQuery.orderNo" class="input-width" placeholder="请输入订单编号"></el-input>
          </el-form-item>
          <el-form-item label="选择时间">
            <el-date-picker
              v-model="times"
              type="daterange"
              :value-format="'yyyy-MM-dd'"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源">
            <el-select
              v-model="listQuery.sourceType"
              class="input-width"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="item in sourceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户手机号">
            <el-input v-model="listQuery.mobile" class="input-width" placeholder="请输入用户手机号"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearchList()" size="small">查询</el-button>
        </el-form>
      </div>
      <div>
        <el-button class="fr ml20" type="primary" @click="exportData()" size="small">导出</el-button>
        <el-button class="fr" type="primary" @click="goExport()" size="small">订单数据导入</el-button>
      </div>
    </el-card>
    <div class="table-container">
      <el-table
        ref="orderTable"
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border=""
      >
        <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{scope.row.orderNo}}</template>
        </el-table-column>
        <el-table-column label="订单来源" align="center">
          <template slot-scope="scope">{{scope.row.channel | foramtChannel}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.created | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="用户手机号" align="center">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column label="订单金额"  align="center">
          <template slot-scope="scope">￥{{scope.row.orderAmount}}</template>
        </el-table-column>
        <el-table-column label="订单状态"  align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleViewOrder(scope.$index, scope.row)">订单明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background=""
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList, closeOrder, deleteOrder, exportList } from "@/api/otoOrder";
import { formatDate } from "@/utils/date";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderNo: null,
  status: null,
  sourceType: null,
  mobile: null,
  orderTimeFrom: null,
  orderTimeTo: null
};
export default {
  name: "orderList",
  data() {
    return {
      importUrl: process.env.BASE_API + "/externalOrder/import", //文件上传地址
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      listLoading: false,
      list: null,
      total: null,
      times: [],
      multipleSelection: [],
      closeOrder: {
        dialogVisible: false,
        content: null,
        orderIds: []
      },
      statusOptions: [
        {
          label: "待付款",
          value: 0
        },
        {
          label: "待核销",
          value: 1
        },
        {
          label: "已完成",
          value: 2
        },
        {
          label: "已退款",
          value: 3
        },
        {
          label: "已关闭",
          value: 4
        }
      ],
      sourceTypeOptions: [
        {
          label: "微信小程序",
          value: 0
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  filters: {
    formatCreateTime(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(value) {
      switch (value) {
        case 0:
          return "待付款";
          break;
        case 1:
          return "待核销";
          break;
        case 2:
          return "已完成";
          break;
        case 3:
          return "已退款";
          break;
        case 4:
          return "已关闭";
          break;
        default:
          return "";
          break;
      }
    },
    foramtChannel(value) {
      switch (value) {
        case 0:
          return "O2O商城";
          break;
        case 1:
          return "京东商城";
          break;
        case 2:
          return "天猫商城";
          break;
      }
    }
  },
  methods: {
    //导出
    exportData() {
      this.listLoading = true;
      exportList(this.listQuery).then(res => {
        let a = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        let objectUrl = URL.createObjectURL(blob);
        a.setAttribute("href", objectUrl);
        a.setAttribute("download", "订单列表.xls");
        a.click();
        this.listLoading = false;
      });
    },
    goExport() {
      this.$router.push({ path: "/order/orderAdd" });
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.orderTimeFrom = this.times[0];
      this.listQuery.orderTimeTo = this.times[1];
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleViewOrder(index, row) {
      this.$router.push({ path: "/order/orderDetail", query: { id: row.id } });
    },
    handleCloseOrder(index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    }
  }
};
</script>
<style scoped>
.input-width {
  width: 203px;
}
.flex {
  display: flex;
}
.ml20 {
  margin-left: 20px;
}
.upload-excal .el-upload-list--picture {
  display: none;
}
.fr {
  float: right;
}
</style>


