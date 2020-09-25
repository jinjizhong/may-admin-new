<template>
  <div class="app-container" v-if="exportStatus">
    <div class="upload-view">
      <el-upload class="upload-demo" ref="upload" :action="importUrl" :auto-upload="false" :on-success="uploadExcalSucc"
        :on-change="getExcal" limit=1>
        <div class="bg-div"></div>
        <p slot="tip" class="el-upload__tip" style="text-align:center">只能上传xls/xlsx文件</p>
      </el-upload>
      <p class="p1">上传其他平台订单</p>
      <a class="href" :href="shiliPath">下载试例</a>
      <p class="p2">
        请仔细核对门店信息和订单信息，如果存在无效门店
        或者套餐信息，或者重复订单无法导入成功
      </p>
    </div>
  </div>
  <div class="app-container" v-else>
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
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
          <el-form-item label="创建时间：">
            <el-date-picker class="input-width" v-model="listQuery.createTime" value-format="yyyy-MM-dd" type="date"
              placeholder="请选择时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="套餐名称：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="用户手机号：">
            <el-input v-model="listQuery.receiverKeyword" class="input-width" placeholder="请输入用户手机号"></el-input>
          </el-form-item>
          <el-form-item label="门店：">
            <el-select v-model="listQuery.orderType" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        <el-button @click="handleResetSearch()" size="small">重置</el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px;margin-bottom: 20px;">导出
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable" :data="list" style="width: 100%;" @selection-change="handleSelectionChange"
        v-loading="listLoading" border="">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.externNo}}</template>
        </el-table-column>
        <el-table-column label="服务门店" width="180" align="center">
          <template slot-scope="scope">{{scope.row.storeName}}</template>
        </el-table-column>
        <el-table-column label="订单内容" align="center">
          <template slot-scope="scope">{{scope.row.packageName}}</template>
        </el-table-column>
        <el-table-column label="订单来源" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.sourceName}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="120" align="center">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.status==0?'未激活':'激活'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDeleteOrder(scope.$index, scope.row)">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background="" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :total="total"></el-pagination>
    </div>
    <el-dialog title="关闭订单" :visible.sync="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input style="width: 80%" type="textarea" :rows="5" placeholder="请输入内容" v-model="closeOrder.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
import { fetchList, closeOrder, deleteOrder, externalOrderList, getPath } from "@/api/order";
import { formatDate } from "@/utils/date";
import LogisticsDialog from "@/views/oms/order/components/logisticsDialog";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  orderSn: null,
  receiverKeyword: null,
  status: null,
  orderType: null,
  sourceType: null,
  createTime: null
};
export default {
  name: "orderList",
  components: { LogisticsDialog },
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      // listLoading: true,
      listLoading: false,

      // list: null,
      list: [
        {
          id1: "1",
          id2: "1",
          id3: "1",
          id4: "1",
          id5: "1",
          id6: "1",
          id7: "1",
          id8: "1",
          id9: "1",
          id10: "1",
          id11: "1"
        },
        {
          id1: "1",
          id2: "1",
          id3: "1",
          id4: "1",
          id5: "1",
          id6: "1",
          id7: "1",
          id8: "1",
          id9: "1",
          id10: "1",
          id11: "1"
        }
      ],

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
          label: "待付款",
          value: 0
        },
        {
          label: "待发货",
          value: 1
        },
        {
          label: "已发货",
          value: 2
        },
        {
          label: "已完成",
          value: 3
        },
        {
          label: "已关闭",
          value: 4
        }
      ],
      orderTypeOptions: [
        {
          label: "正常订单",
          value: 0
        },
        {
          label: "秒杀订单",
          value: 1
        }
      ],
      sourceTypeOptions: [
        {
          label: "PC订单",
          value: 0
        },
        {
          label: "APP订单",
          value: 1
        }
      ],
      operateOptions: [
        {
          label: "批量发货",
          value: 1
        },
        {
          label: "关闭订单",
          value: 2
        },
        {
          label: "删除订单",
          value: 3
        }
      ],
      logisticsDialogVisible: false,
      exportStatus: true, //true 导出状态， false展示状态
      importUrl: process.env.BASE_API + "/externalOrder/import", //文件上传地址
      shiliPath: '',//试例地址
    };
  },
  created () {
    // this.getList();
    this.getPath();
  },
  filters: {
    formatCreateTime (time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatPayType (value) {
      if (value === 1) {
        return "支付宝";
      } else if (value === 2) {
        return "微信";
      } else {
        return "未支付";
      }
    },
    formatSourceType (value) {
      if (value === 1) {
        return "APP订单";
      } else {
        return "PC订单";
      }
    },
    formatStatus (value) {
      if (value === 1) {
        return "待发货";
      } else if (value === 2) {
        return "已发货";
      } else if (value === 3) {
        return "已完成";
      } else if (value === 4) {
        return "已关闭";
      } else if (value === 5) {
        return "无效订单";
      } else {
        return "待付款";
      }
    },
    formtOrderStatus (value) {
      if (value === 0) {
        return "待付款";
      } else if (value === 1) {
        return "已预约";
      } else if (value === 2) {
        return "预约成功";
      } else if (value === 3) {
        return "已核销";
      } else if (value === 4) {
        return "已关闭";
      }
    }
  },
  methods: {
    getExcal () {
      this.$refs.upload.submit();
    },
    uploadExcalErr (err) {
      console.log(1234, err);
    },
    uploadExcalSucc () {
      console.log(123);
      this.$message({
        message: "上传成功",
        type: "success",
        duration: 1000
      });
      this.listQuery.pageNum = 1;
      this.getList();
      this.exportStatus = false;
    },
    getPath () {
      getPath().then(res => {
        console.log('getPath', res)
        this.shiliPath = res.data
      })
    },
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
      this.$router.push({ path: "/oms/orderDetail", query: { id: row.id } });
    },
    handleCloseOrder (index, row) {
      this.closeOrder.dialogVisible = true;
      this.closeOrder.orderIds = [row.id];
    },
    handleDeliveryOrder (index, row) {
      let listItem = this.covertOrder(row);
      this.$router.push({
        path: "/oms/deliverOrderList",
        query: { list: [listItem] }
      });
    },
    handleViewLogistics (index, row) {
      this.logisticsDialogVisible = true;
    },
    handleDeleteOrder (index, row) {
      let ids = [];
      ids.push(row.id);
      this.deleteOrder(ids);
    },
    handleBatchOperate () {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的订单",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.operateType === 1) {
        //批量发货
        let list = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          if (this.multipleSelection[i].status === 1) {
            list.push(this.covertOrder(this.multipleSelection[i]));
          }
        }
        if (list.length === 0) {
          this.$message({
            message: "选中订单中没有可以发货的订单",
            type: "warning",
            duration: 1000
          });
          return;
        }
        this.$router.push({
          path: "/oms/deliverOrderList",
          query: { list: list }
        });
      } else if (this.operateType === 2) {
        //关闭订单
        this.closeOrder.orderIds = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.closeOrder.orderIds.push(this.multipleSelection[i].id);
        }
        this.closeOrder.dialogVisible = true;
      } else if (this.operateType === 3) {
        //删除订单
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteOrder(ids);
      }
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
    handleCloseOrderConfirm () {
      if (this.closeOrder.content == null || this.closeOrder.content === "") {
        this.$message({
          message: "操作备注不能为空",
          type: "warning",
          duration: 1000
        });
        return;
      }
      let params = new URLSearchParams();
      params.append("ids", this.closeOrder.orderIds);
      params.append("note", this.closeOrder.content);
      closeOrder(params).then(response => {
        this.closeOrder.orderIds = [];
        this.closeOrder.dialogVisible = false;
        this.getList();
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    getList () {
      this.listLoading = true;
      externalOrderList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    deleteOrder (ids) {
      this.$confirm("是否要进行该删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteOrder(params).then(response => {
          this.$message({
            message: "删除成功！",
            type: "success",
            duration: 1000
          });
          this.getList();
        });
      });
    },
    covertOrder (order) {
      let address =
        order.receiverProvince +
        order.receiverCity +
        order.receiverRegion +
        order.receiverDetailAddress;
      let listItem = {
        orderId: order.id,
        orderSn: order.orderSn,
        receiverName: order.receiverName,
        receiverPhone: order.receiverPhone,
        receiverPostCode: order.receiverPostCode,
        address: address,
        deliveryCompany: null,
        deliverySn: null
      };
      return listItem;
    }
  }
};
</script>
<style>
.input-width {
  width: 203px;
}
.upload-view {
  width: 300px;
  padding-top: 110px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.upload-view .bg-div {
  width: 150px;
  height: 150px;
  background: url("~@/assets/images/kong.png") center center no-repeat;
}
.upload-view .p1 {
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #565656;
}
.upload-view .href {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #1e968e;
}
.upload-view .p2 {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #565656;
  line-height: 21px;
}
</style>

