<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="">
          <el-form-item label="角色名称：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearchList()" size="small">
            查询搜索
          </el-button>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-button class="btn-add" @click="handleAdd()" type="primary">
        新增
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="账号角色" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="角色描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="180">
          <template slot-scope="scope">{{scope.row.created | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="修改时间" align="center">
          <template slot-scope="scope">{{scope.row.updated | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button size="mini" type="text" :disabled="isSuperAdmin" @click="handleDelete(scope.$index, scope.row)">删除
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
    <el-dialog :title="isEdit?'编辑用户':'新增用户'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="角色名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input v-model="role.description" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="分配资源：">
          <el-cascader class="input-width" :options="typeOptions" v-model="listQuery.management"
            :props="{ multiple: true ,value: 'id', label: 'name',emitPath: false}" collapse-tags clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="role.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
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
import { fetchList, createRole, createOrUpdate, deleteRole, editGetMore } from '@/api/otoRole';
import { fetchAllResourceList } from '@/api/resource';
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  status: null, //上架状态
  management: null, //套餐分类
  keyword: null,//套餐名称(关键字)
};
const defaultRole = {
  id: null,
  name: '',
  ids: '',
  description: '',
  status: 1
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
      //套餐状态
      typeOptions: [],
    }
  },
  created () {
    this.getList();
    this.getResource()
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
    /* 新增角色 */
    handleAdd () {
      this.dialogVisible = true;
      this.isEdit = false;
      this.role = Object.assign({}, defaultRole);
    },
    /* 删除角色 */
    handleDelete (index, row) {
      this.$confirm('是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ id: row.id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.listQuery.management = null
          this.getList();
        });
      });
    },
    /* 编辑角色 */
    async handleUpdate (index, row) {
      //console.log(row)
      //console.log(this.listQuery.management)
      await editGetMore({ id: row.id }).then(res => {
        if (res.success) {
          this.dialogVisible = true;
          this.isEdit = true;
          /* 级联赋值 */
          this.listQuery.management = res.data.resourceIds
          this.role = Object.assign({}, row);
          this.$forceUpdate()
        }
      })

    },
    handleDialogConfirm () {
      // 选择的ids
      this.role.ids = String(this.listQuery.management)

      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {

          createOrUpdate(this.role).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.listQuery.management = null
            this.getList();
          })
        } else {
          this.listQuery.management = null
          //console.log(JSON.stringify(this.role))
          createOrUpdate(this.role).then(response => {
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
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    /* 获取资源列表 */
    getResource () {
      fetchAllResourceList().then(res => {
        if (res.success) {
          this.typeOptions = res.data
        }
      })
    }

  }
}
</script>
<style scoped>
.btn-add {
  float: right;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>


