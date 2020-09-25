<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width>
          <el-form-item label="商户名称：">
            <el-input v-model="listQuery.storeName" class="input-width" placeholder="请输入商户名称"></el-input>
          </el-form-item>
          <el-form-item label="搜索用户：">
            <el-input v-model="listQuery.member" class="input-width" placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item label="评价状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option
                v-for="item in statusTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border="">
        <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="商户名称" align="center">
          <template slot-scope="scope">{{scope.row.storeName}}</template>
        </el-table-column>
        <el-table-column label="评价内容" align="center">
          <template slot-scope="scope">{{scope.row.options}}</template>
        </el-table-column>
        <el-table-column label="用户名称" align="center">
          <template slot-scope="scope">{{scope.row.memberName}}</template>
        </el-table-column>
        <el-table-column label="用户手机号" align="center">
          <template slot-scope="scope">{{scope.row.memberMobile}}</template>
        </el-table-column>
        <el-table-column label="评价状态" align="center">
          <template slot-scope="scope">{{scope.row.approvalStatus?'已审核':'待审核'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button
                size="mini"
                type="text"
                style="margin-left:10px"
                v-show="scope.row.approvalStatus===0"
                @click="handleUpdate(scope.$index, scope.row)"
              >审核通过</el-button>
              <el-button
                size="mini"
                type="text"
                disabled="disabled"
                v-show="scope.row.approvalStatus===1"
              >审核通过</el-button>
              <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-row>
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
import { fetchList, toExamine, Delete } from "@/api/otoEvaluate";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  status: null,
  storeName: null,
  member: null
};
export default {
  name: "roleList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      //上架状态
      statusTypeOptions: [
        {
          label: "未审核",
          value: 0
        },
        {
          label: "已审核",
          value: 1
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
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

    handleDelete(index, row) {
      let params = {
        id: row.id
      };
      this.listLoading = true;
      Delete(params).then(response => {
        this.listLoading = false;
        this.$message.success("删除成功!");
        this.getList();
      });
    },
    handleUpdate(index, row) {
      let params = {
        id: row.id
      };
      this.listLoading = true;
      toExamine(params).then(response => {
        this.listLoading = false;
        this.getList();
      });
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
<style></style>


