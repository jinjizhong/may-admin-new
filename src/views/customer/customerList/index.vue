<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
          <el-form-item label="搜索用户：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="请输入用户名称或手机号" clearable></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearchList()" size="small">
            查询搜索
          </el-button>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="客户头像" width="100" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.icon" width="40" height="40" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickname|| nullData}}</template>
        </el-table-column>
        <el-table-column label="客户姓名" align="center">
          <template slot-scope="scope">{{scope.row.realName|| nullData}}</template>
        </el-table-column>
        <el-table-column label="客户手机号" align="center">
          <template slot-scope="scope">{{scope.row.mobile|| nullData}}</template>
        </el-table-column>
        <el-table-column label="客户积分数量" align="center">
          <template slot-scope="scope">{{scope.row.integration || 0}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
              查看购买记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit?'查看购买记录':'查看购买记录'" :visible.sync="dialogVisible" width="60%">
      <div class="table-container">
        <el-table ref="adminTable" :data="shopList" style="width: 100%;" v-loading="listLoading" border>
          <el-table-column label="购买时间" width="200" align="center">
            <template slot-scope="scope">{{scope.row.orderTime | formatCreateTime}}</template>
          </el-table-column>
          <el-table-column label="购买商品名称" align="center">
            <template slot-scope="scope">{{scope.row.packageName}}</template>
          </el-table-column>
          <el-table-column label="购买金额" align="center">
            <template slot-scope="scope">{{scope.row.orderAmount}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container" style="margin-bottom:20px">
        <el-pagination background @size-change="shopHandleSizeChange" @current-change="shopHandleCurrentChange"
          layout="total, sizes,prev, pager, next,jumper" :current-page.sync="orderListQuery.pageNum"
          :page-size="orderListQuery.pageSize" :page-sizes="[10,15,20]" :total="shopTotal">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, memberOrderList } from '@/api/otoCustomer';
import { formatDate } from '@/utils/date';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  name: null
}
const memberOrderListQuery = {
  memberId: null,
  pageNum: 1,
  pageSize: 10
}
export default {
  name: 'adminList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      nullData: '暂无数据',
      list: null,
      shopList: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      orderListQuery: Object.assign({}, memberOrderListQuery),
      total: null,
      shopTotal: null,
      isEdit: false,
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: [],
      allocAdminId: null
    }
  },
  created () {
    this.getList();
  },
  filters: {
    formatCreateTime (time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
    handleSizeChange (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    shopHandleSizeChange (val) {
      this.orderListQuery.pageNum = 1;
      this.orderListQuery.pageSize = val;
      this.getMemberOrderList();
    },
    shopHandleCurrentChange (val) {
      this.orderListQuery.pageNum = val;
      this.getMemberOrderList();
    },
    handleUpdate (index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.orderListQuery.memberId = row.id;
      this.getMemberOrderList()
    },
    getList () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getMemberOrderList () {
      memberOrderList(this.orderListQuery).then(response => {
        this.shopList = response.data.list;
        this.shopTotal = response.data.total;
      });
    },
  }
}
</script>
<style>
.head_pic {
  display: block;
  margin: 0 auto;
  border-radius: 50%;
}
.el-dialog__body {
  padding: 30px 20px 70px 20px;
}
</style>


