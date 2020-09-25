<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
          <el-form-item label="关键词：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="请输入名称/规格/型号"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
    </el-card>
    <!-- <el-card class="operate-container" shadow="never">
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px;margin-bottom: 20px">新增配件
      </el-button>
    </el-card> -->
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="配件编号" width="center" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="scope">{{scope.row.specification}}</template>
        </el-table-column>
        <el-table-column label="型号" width="150" align="center">
          <template slot-scope="scope">{{scope.row.model}}</template>
        </el-table-column>
        <el-table-column label="价格" width="80" align="center">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
                编辑
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[5,10,15]" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="isEdit?'编辑配件':'添加配件'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="配件名称：">
          <el-input v-model="role.name" disabled="disabled" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="规格：">
          <el-input v-model="role.specification" disabled="disabled" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="型号：">
          <el-input v-model="role.model" disabled="disabled" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="单位：">
          <el-input v-model="role.unit" disabled="disabled" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="role.price" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, changeCreate, changeUpdate } from '@/api/otoParts';
import { formatDate } from '@/utils/date';
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: 0
};
const defaultRole = {
  id: null,
  name: null,


};
export default {
  name: 'roleList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      isEdit: false,
    }
  },
  created () {
    this.getList();
  },
  filters: {
    formatDateTime (time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
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
    handleAdd () {
      this.dialogVisible = true;
      this.isEdit = false;
      this.role = Object.assign({}, defaultRole);
    },
    handleUpdate (index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.role = Object.assign({}, row);
    },
    handleDialogConfirm () {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          changeUpdate(this.role).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        } else {
          changeCreate(this.role).then(response => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        }
      })
    },
    handleSelectMenu (index, row) {
      this.$router.push({ path: '/ums/allocMenu', query: { roleId: row.id } })
    },
    handleSelectResource (index, row) {
      this.$router.push({ path: '/ums/allocResource', query: { roleId: row.id } })
    },
    getList () {
      this.listLoading = true;
      console.log('参数', this.listQuery);
      fetchList(this.listQuery).then(response => {
        //console.log('配件数组信息', response);
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    }
  }
}
</script>
<style></style>


