<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
          <el-form-item label="套餐分类：">
            <el-select v-model="listQuery.categoryId" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in managementTypeOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.saleStatus" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusTypeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="请输入套餐名称"></el-input>
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
    <el-card class="operate-container" shadow="never">
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px;margin-bottom:20px">新增</el-button>
      <el-button size="mini" class="btn-add" @click="exportData()" style="margin-left: 20px;margin-bottom:20px">导出</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="套餐id" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="套餐编号" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="套餐图片" align="center">
          <template slot-scope="scope"><img :src="scope.row.imageUrl" style="height:35px"></template>
        </el-table-column>
        <el-table-column label="套餐名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="套餐价格" align="center">
          <template slot-scope="scope">{{scope.row.price}}</template>
        </el-table-column>
        <el-table-column label="套餐包含内容" align="center">
          <template slot-scope="scope">{{scope.row.productDesc}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.created | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="是否上架" width="100" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleStatusShelfChange(scope.$index, scope.row)" :active-value="1" :inactive-value="0"
              v-model="scope.row.saleStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" width="100" align="center">
          <template slot-scope="scope">
            <el-switch @change="handleStatusRecommendChange(scope.$index, scope.row)" :active-value="1"
              :inactive-value="0" v-model="scope.row.recommendStatus">
            </el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus }}</template>
        </el-table-column> -->
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdata(scope.row)">
              修改
            </el-button>
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
    <el-dialog :title="isEdit?'编辑套餐':'添加套餐'" :visible.sync="dialogVisible" width="40%">
      <el-form :model="role" ref="roleForm" label-width="150px" size="small">
        <el-form-item label="套餐名称：">
          <el-input v-model="role.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格：">
          <el-input v-model="role.price" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="套餐图片：">
          <img :src="role.imageUrl" style="height:35px">
        </el-form-item>
        <el-form-item label="套餐包含内容：">
          <el-input v-model="role.productDesc" style="width: 250px"></el-input>
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
import { fetchList, changeStatus, changeCreate, updateStatus, productCategoryList, changeSaleStatus, changeRecommendStatus, packageExport } from '@/api/otoPackageManagement';
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  saleStatus: null, //上架状态
  categoryId: null, //套餐分类
  name: null,//套餐名称
};
const defaultRole = {
  id: null,
  name: null,
  description: null,
  adminCount: 0,
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
      //上架状态
      statusTypeOptions: [
        {
          label: '下架',
          value: 0
        },
        {
          label: '上架',
          value: 1
        }
      ],
      //套餐分类
      managementTypeOptions: [],
    }
  },
  created () {
    this.getList();
    this.getProductCategory();
  },
  filters: {
    formatDateTime (time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatStatus (value) {
      if (value === 0) {
        return '禁用';
      } else if (value === 1) {
        return '启用';
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
    handleSizeChange (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    //导出数据
    exportData() {
      this.listLoading = true;
      packageExport(this.listQuery).then(res => {
        let a = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        let objectUrl = URL.createObjectURL(blob);
        a.setAttribute("href", objectUrl);
        a.setAttribute("download", "套餐列表.xls");
        a.click();
        this.listLoading = false;
      });
    },
    handleAdd () {
      // this.dialogVisible = true;
      // this.isEdit = false;
      // this.role = Object.assign({},defaultRole);
      this.$router.push({ path: '/packageManagement/addManagement' })
    },
    handleUpdata (row) {
      // console.log(row);
      this.$router.push({ path: '/packageManagement/addManagement', query: { id: row.id } })
    },
    //修改上架状态
    handleStatusShelfChange (index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          saleStatus: row.saleStatus
        };
        changeSaleStatus(params).then(response => {
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
    //修改推荐状态
    handleStatusRecommendChange (index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          id: row.id,
          recommendStatus: row.recommendStatus
        };
        changeRecommendStatus(params).then(response => {
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
          updateStatus(this.role.id, this.role).then(response => {
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
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getProductCategory () {
      productCategoryList().then(response => {
        console.log('', response.data.list);
        this.managementTypeOptions = response.data.list;
      });
    },
  }
}
</script>
<style></style>


