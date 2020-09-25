<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="">
          <el-form-item label="用户账号：">
            <el-input v-model="listQuery.userName" class="input-width" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="用户角色：">
            <el-select v-model="listQuery.roleId" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in roleAllList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="handleSearchList()" size="small">
            查询搜索
          </el-button>
          <el-button style="margin-right: 15px" @click="handleResetSearch()" size="small">
            重置
          </el-button>
        </el-form>
      </div>
    </el-card>
    <el-button class="btn-add" @click="handleAdd()" type="primary">
      新增
    </el-button>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="用户账号" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="用户角色" align="center">
          <template slot-scope="scope">{{scope.row.role}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column label="是否启用" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleStatusChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status">正常</span>
            <span v-else>失效</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button :disabled="scope.isSuperAdmin" size="mini" type="text"
                @click="handleDelete(scope.$index, scope.row)">删除
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
        <el-form-item label="用户账号：">
          <el-input v-model="role.username" style="width: 250px" maxlength="20" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')">></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="role.mobile" type="number" style="width: 250px" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="设置密码：" v-if="!isEdit">
          <el-input v-model="role.password" style="width: 250px" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="用户角色：">
          <el-select v-model="role.roleId" class="input-width" placeholder="选择角色" clearable>
            <el-option v-for="item in roleAllList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
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
import { fetchAllRoleList } from '@/api/otoRole';
import { fetchList, updateStatus, deleteAdmin, newAdmin, updateAdmin, getInfoById } from '@/api/login';
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  status: null, //状态
  roleId: null, //角色
  userName: null,//名称
};
const defaultRole = {
  id: null,
  username: null,
  mobile: null,
  email: null,
  password: '',
  roleId: '',
  status: 1
};
export default {
  name: 'roleList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: [],
      total: null,
      listLoading: false,
      dialogVisible: false,
      role: Object.assign({}, defaultRole),
      isEdit: false,
      //状态
      statusTypeOptions: [
        {
          label: '失效',
          value: 0
        },
        {
          label: '正常',
          value: 1
        }
      ],
      //所有角色
      roleAllList: [],
    }
  },
  created () {
    this.getAllRoleList();
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
    /* 添加 */
    handleAdd () {
      this.dialogVisible = true;
      this.isEdit = false;
      this.role = Object.assign({}, defaultRole);
    },
    handleStatusChange (index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { status: row.status }).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });
        this.getList();
      });
    },
    /* 删除 */
    handleDelete (index, row) {
      this.$confirm('是否确认删除当前用户账号？一旦删除不可恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    // 编辑修改
    async handleUpdate (index, row) {
      /* 先获取详情 */
      await getInfoById(row.id).then(res => {
        if (res.success) {
          this.dialogVisible = true;
          this.isEdit = true;
          this.role = Object.assign({}, row);
        }
      })
    },
    handleDialogConfirm () {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateAdmin(this.role.id, this.role).then(response => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible = false;
            this.getList();
          })
        } else {
          newAdmin(this.role).then(response => {
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
    /* 获取所有role列表 */
    getAllRoleList () {
      fetchAllRoleList().then(res => {
        if (res.success) {
          this.roleAllList = res.data
        }
      })
    },
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


