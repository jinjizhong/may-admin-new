<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="100px">
          <!-- <el-form-item label="所在地区：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable></el-input>
          </el-form-item>-->
          <el-form-item label="所在地区:">
            <el-col :span="24">
              <el-cascader style="width:100%" size="small" :options="addressOptions" v-model="selectedAddrByList"
                @change="addressHandleChange1"></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-model="listQuery.status" placeholder="请选择">
              <el-option v-for="item in listSatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经销商：">
            <el-input v-model="listQuery.supplierName" class="input-width" placeholder="经销商名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="门店名称：">
            <el-input v-model="listQuery.name" class="input-width" placeholder="门店名称" clearable></el-input>
          </el-form-item>
          <el-button type="primary" @click="handleSearchList()" size="small">查询搜索</el-button>
          <el-button style="margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
        </el-form>
      </div>
      <div></div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-button size="mini" @click="exportData()" class="btn-add" style="margin-left: 20px;margin-bottom: 20px">导出
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable" :data="list" style="width: 100%;" v-loading="listLoading" border="">
        <el-table-column label="编号" type="index" align="center" width="50"></el-table-column>
        <el-table-column label="门店编码" align="center">
          <template slot-scope="scope">{{scope.row.code}}</template>
        </el-table-column>
        <el-table-column label="门店名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="门店联系人" align="center">
          <template slot-scope="scope">{{scope.row.contactName}}</template>
        </el-table-column>
        <el-table-column label="联系人手机" align="center">
          <template slot-scope="scope">{{scope.row.contactPhone}}</template>
        </el-table-column>
        <el-table-column label="固定电话" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.created | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">{{scope.row.status | isStatus}}</template>
        </el-table-column>
        <el-table-column label="资料完整度" align="center">
          <template slot-scope="scope">{{scope.row.informationCompleted | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-row>
              <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
              <el-button size="mini" type="text" style="margin-left:10px" v-show="scope.row.status===1"
                @click="handleDelete(scope.$index, scope.row)">禁用</el-button>
              <el-button size="mini" type="text" :disabled="scope.row.informationCompleted | setBtnStatus"
                v-show="scope.row.status===0" @click="handleDelete(scope.$index, scope.row)">启用</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background="" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize" :page-sizes="[10,15,20]" :total="total"></el-pagination>
    </div>
    <el-dialog title="分配角色" :visible.sync="allocDialogVisible" width="30%">
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option v-for="item in allRoleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleAllocDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  fetchList,
  updateStatus,
  changeStatus,
  Export,
  getStoreInfo,
  storeSync,
  exportStoreList
} from "@/api/otoManagement";
import { formatDate } from "@/utils/date";
import { regionData, CodeToText } from "element-china-area-data";
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
};
const defaultAdmin = {
  id: null,
  username: null,
  password: null,
  nickName: null,
  email: null,
  note: null,
  status: 1
};
const imgs = {
  businessLicenseImage: [],
  storeDoorHeaderImage: [],
  storeAppearanceImage: [],
  storeExhibitImage: []
};
export default {
  name: "adminList",
  data () {
    return {
      listSatus: [
        { value: "", label: "全部" },
        { value: "1", label: "启用" },
        { value: "0", label: "禁用" }
      ], //0  禁用   1 启用   2全部
      actionUrl: process.env.BASE_API + "/minio/upload", //文件上传地址
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      admin: Object.assign({}, defaultAdmin),
      isEdit: false,
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: [],
      storeDetail: {},
      addressOptions: regionData, //省市区控件数据
      selectedAddressOptions: [], //省市区选中展示
      selectedAddrByList: [], //门店搜索省市区选中
      selectedAddressOptionsVal: "", //省市区选中展示具体值
      imgType: "" //上传图片类型
    };
  },
  created () {
    this.getList();
  },
  filters: {
    formatDateTime (time) {
      if (time == null || time === "") {
        return "N/A";
      }
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    //资料完整度
    formatStatus (value) {
      if (value === false) {
        return "不完整";
      } else if (value === true) {
        return "完整";
      }
    },
    setBtnStatus (value) {
      if (value == false) {
        return true;
      } else if (value == true) {
        return false;
      }
    },
    //
    isStatus (value) {
      if (value === 0) {
        return "禁用";
      } else if (value === 1) {
        return "启用";
      } else if (value === 2) {
        return "全部";
      }
    }
  },
  methods: {
    addressHandleChange1 (value) {
      console.log(
        value,
        CodeToText[value[0]],
        CodeToText[value[1]],
        CodeToText[value[2]]
      );
      this.listQuery.province = value[0];
      this.listQuery.city = value[1];
      this.listQuery.district = value[2];
    },
    //省市区选择
    addressHandleChange (value) {
      console.log(
        value,
        CodeToText[value[0]],
        CodeToText[value[1]],
        CodeToText[value[2]]
      );
      this.admin.province = value[0];
      this.admin.city = value[1];
      this.admin.district = value[2];
      this.admin.address2 = `${CodeToText[value[0]]}${CodeToText[value[1]]}${CodeToText[value[2]]
        }${this.admin.address || ""}`;
      this.selectedAddressOptionsVal = `${CodeToText[value[0]]}${CodeToText[value[1]]
        }${CodeToText[value[2]]}`;
      console.log("daaaas:", this.selectedAddressOptions, this.admin);
    },
    setImgType (type) {
      this.imgType = type;
    },
    updateAddress (e) {
      this.admin.address2 =
        this.selectedAddressOptionsVal || "" + this.admin.address;
    },
    handlePictureCardPreview () { },
    getMinioUpload (res, a, b) {
      let _url = res.data.url;
      console.log(
        _url,
        this.imgType,
        "_url",
        this.admin,
        this.admin.businessLicenseImage
      );
      switch (this.imgType) {
        case "yyzz":
          this.admin.businessLicenseImage.push(res.data);
          break;
        case "mt":
          this.admin.storeDoorHeaderImage.push(res.data);
          break;
        case "wg":
          this.admin.storeAppearanceImage.push(res.data);
          break;
        case "nb":
          this.admin.storeExhibitImage.push(res.data);
          break;
      }
    },
    handleRemove (file, fileList, imgType) {
      //console.log(fileList, 'fileList')
      let _imgs = [];
      fileList.forEach(x => {
        _imgs.push(x.url);
      });
      switch (imgType) {
        case "yyzz":
          this.admin.businessLicenseImage = _imgs;
          break;
        case "mt":
          this.admin.storeDoorHeaderImage = _imgs;
          break;
        case "wg":
          this.admin.storeAppearanceImage = _imgs;
          break;
        case "nb":
          this.admin.storeExhibitImage = _imgs;
          break;
      }

      this.$forceUpdate();
    },
    handleResetSearch () {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.selectedAddrByList = [];
      this.getList();
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
    //修改状态
    handleDelete (index, row) {
      console.log("row", row);
      let status = row.status;
      this.$confirm(`确定要${status == 0 ? "启用" : "禁用"}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id,
          status: status == 0 ? 1 : 0
        };
        changeStatus(params).then(response => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getList();
        });
      });
    },
    handleUpdate (index, row) {
      this.$router.push({
        path: "/storeManagement/edit",
        query: { id: row.id }
      });
      // this.dialogVisible = true;
      // this.isEdit = true;
      // this.admin = Object.assign(Object.assign({}, row), imgs);
      // this.getStoreDetail();
    },
    //导出数据
    exportData () {
      this.listLoading = true;
      exportStoreList(this.listQuery).then(res => {
        let a = document.createElement("a");
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
        let objectUrl = URL.createObjectURL(blob);
        a.setAttribute("href", objectUrl);
        a.setAttribute("download", "门店列表.xls");
        a.click();
        this.listLoading = false;
      });
    },
    //修改门店信息
    handleDialogConfirm () {
      console.log(this.admin, 223344);
      let {
        businessLicenseImage,
        storeDoorHeaderImage,
        storeAppearanceImage,
        storeExhibitImage
      } = this.admin;
      if (businessLicenseImage.length == 0) {
        this.$message({
          message: "请上传营业执照",
          type: "warning"
        });
        return;
      }
      if (storeDoorHeaderImage.length == 0) {
        this.$message({
          message: "请上传门头照片",
          type: "warning"
        });
        return;
      }
      if (storeAppearanceImage.length == 0) {
        this.$message({
          message: "请上传门店外观照片",
          type: "warning"
        });
        return;
      }
      if (storeExhibitImage.length == 0) {
        this.$message({
          message: "请上传门店内部陈列照片",
          type: "warning"
        });
        return;
      }
      this.$confirm("是否要确认?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // console.log('businessLicenseImage', businessLicenseImage)
        // console.log('storeAppearanceImage', storeAppearanceImage)
        // console.log('storeDoorHeaderImage', storeDoorHeaderImage)
        // console.log('storeExhibitImage', storeExhibitImage)

        let params = this.admin;
        // let arr1 = []
        // let arr2 = []
        // let arr3 = []
        // let arr4 = []
        // for(let it of params.businessLicenseImage){
        //   arr1.push(it.url)
        // }
        // for(let it of params.storeAppearanceImage){
        //   arr2.push(it.url)
        // }
        // for(let it of params.storeDoorHeaderImage){
        //   arr3.push(it.url)
        // }
        // for(let it of params.storeExhibitImage){
        //   arr4.push(it.url)
        // }
        params.businessLicenseImage = this.resetFomatImg(
          businessLicenseImage
        );
        params.storeAppearanceImage = this.resetFomatImg(storeAppearanceImage);
        params.storeDoorHeaderImage = this.resetFomatImg(storeDoorHeaderImage);
        params.storeExhibitImage = this.resetFomatImg(storeExhibitImage);

        console.log("提交的数据是===》", JSON.stringify(params));
        updateStatus(params).then(response => {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.dialogVisible = false;
          this.getList();
        });
      });
    },
    //获取列表数据
    getList () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    //获取门店详情
    getStoreDetail () {
      console.log("this.listQuery", this.listQuery, this.admin);
      let id = this.admin.id;
      getStoreInfo(id).then(res => {
        // this.admin = res.data
        let informations = JSON.parse(res.data.informations);
        res.data.businessLicenseImage = this.fomatImg(
          informations.businessLicenseImage || []
        );
        res.data.storeAppearanceImage = this.fomatImg(
          informations.storeAppearanceImage || []
        );
        res.data.storeDoorHeaderImage = this.fomatImg(
          informations.storeDoorHeaderImage || []
        );
        res.data.storeExhibitImage = this.fomatImg(
          informations.storeExhibitImage || []
        );
        this.selectedAddressOptions = [
          res.data.province,
          res.data.city,
          res.data.district
        ];
        this.admin = res.data;
        this.$forceUpdate();
        console.log(
          "res.data.informations",
          this.admin,
          this.selectedAddressOptions
        );
      });
    },
    //同步门店信息
    storeSync () {
      let params = { storeId: this.admin.id };
      storeSync(params).then(res => {
        console.log(res.data);
        this.listQuery.name = res.data.name;
      });
    },
    fomatImg (arr) {
      let _arr = [];
      arr.forEach(x => {
        _arr.push({ url: x });
      });
      return _arr;
    },
    resetFomatImg (arr) {
      let _arr = [];
      arr.forEach(x => {
        if (x.url) {
          _arr.push(x.url);
        } else {
          _arr.push("");
        }
      });
      return _arr;
    }
  }
};
</script>
<style>
.table-layout {
  border: 1px solid #dcdfe6;
  padding: 0 20px 20px;
}
.table-layout .el-col {
  padding-top: 20px;
}
.mt20 {
  margin-top: 20px;
}
._center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


