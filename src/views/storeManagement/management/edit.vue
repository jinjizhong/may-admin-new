<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>门店基础信息</span>
      </div>
      <el-form :inline="true" size="small" label-width="140px" style="padding: 0 0 20px 20px;">
        <el-col :span="7" class="font-small mt20">门店名称:{{admin.name}}</el-col>
        <el-col :span="7" class="font-small mt20">门店Code:{{admin.code}}</el-col>
        <el-col :span="12" class="font-small _center mt20" style="padding-bottom:20px">
          <el-button type="primary" @click="storeSync()" size="small">同 步</el-button>
        </el-col>
      </el-form>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div class="mt20">
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span class="font-small">补充信息</span>
      </div>
      <el-form :model="admin" ref="adminForm" label-width="150px" size="small" class="mt20">
        <el-form-item label="门店省市区:">
          <el-col :span="18">
            <el-cascader style="width:100%" size="small" :options="addressOptions" v-model="selectedAddressOptions"
              @change="addressHandleChange"></el-cascader>
          </el-col>
          <!-- <el-input v-model="admin.address" style="width: 250px"></el-input> -->
        </el-form-item>
        <el-form-item label="具体地址：">
          <el-col :span="18">
            <el-input v-model="admin.address" @input="updateAddress"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="门店联系人：">
          <el-col :span="18">
            <el-input v-model="admin.contactName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="门店联系人手机：">
          <el-col :span="18">
            <el-input v-model="admin.contactPhone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="门店固定电话：">
          <el-col :span="18">
            <el-input v-model="admin.phone"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>门店营业执照</span>
      </div>
      <div style="margin-top: 15px" @click="setImgType('yyzz')">
        <el-upload :action="actionUrl" list-type="picture-card" :file-list="admin.businessLicenseImage" :limit="4"
          :on-success="(res) => {getMinioUpload(res,'yyzz')}"
          :on-remove="(file, fileList) => {handleRemove(file, fileList, 'yyzz')}">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传图片，仅支持格式png,jgps格式，最多可上传4张图片。</span>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>门店门头照片</span>
      </div>
      <div style="margin-top: 15px" @click="setImgType('mt')">
        <el-upload :action="actionUrl" list-type="picture-card" :file-list="admin.storeDoorHeaderImage" :limit="4"
          :on-success="(res) => {getMinioUpload(res,'mt')}"
          :on-remove="(file, fileList) => {handleRemove(file, fileList, 'mt')}">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传图片，仅支持格式png,jgps格式，最多可上传4张图片。</span>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>门店外观照片</span>
      </div>
      <div style="margin-top: 15px" @click="setImgType('wg')">
        <el-upload :action="actionUrl" list-type="picture-card" :file-list="admin.storeAppearanceImage" :limit="4"
          :on-success="(res) => {getMinioUpload(res,'wg')}"
          :on-remove="(file, fileList) => {handleRemove(file, fileList, 'wg')}">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传图片，仅支持格式png,jgps格式，最多可上传4张图片。</span>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>门店内部陈列照片</span>
      </div>
      <div style="margin-top: 15px" @click="setImgType('nb')">
        <el-upload :action="actionUrl" list-type="picture-card" :file-list="admin.storeExhibitImage" :limit="4"
          :on-success="(res) => {getMinioUpload(res,'nb')}"
          :on-remove="(file, fileList) => {handleRemove(file, fileList, 'nb')}">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传图片，仅支持格式png,jgps格式，最多可上传4张图片。</span>
      </div>
    </el-card>
    <span slot="footer" class="dialog-footer">
      <div class="btns _center mt20">
        <el-button type="primary" @click="handleDialogConfirm()" size="small">修 改</el-button>
      </div>
    </span>
  </div>
</template>
<script>
import { updateStatus, getStoreInfo, storeSync } from "@/api/otoManagement";
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
  status: 1,
  businessLicenseImage: [],
  storeDoorHeaderImage: [],
  storeAppearanceImage: [],
  storeExhibitImage: []
};
export default {
  name: "adminList",
  data () {
    return {
      actionUrl: process.env.BASE_API + "/minio/upload", //文件上传地址
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      dialogVisible: false,
      admin: Object.assign({}, defaultAdmin),
      addressOptions: regionData, //省市区控件数据
      selectedAddressOptions: [], //省市区选中展示
      selectedAddrByList: [], //门店搜索省市区选中
      selectedAddressOptionsVal: "", //省市区选中展示具体值
      imgType: "" //上传图片类型
    };
  },
  created () {
    this.admin.id = this.$route.query.id;
    this.getStoreDetail();
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
    updateAddress(e) {
      this.admin.address2 =
        this.selectedAddressOptionsVal || "" + this.admin.address;
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
    //获取门店详情
    getStoreDetail () {
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
  },
  watch: {
    checked (newV, oldV) {
      if (newV) {
        this.listQuery.stores = [{ id: "", name: "全部门店" }];
      } else {
        this.listQuery.stores = [];
      }
    }
  }
};
</script>
<style>
.mt20 {
  margin-top: 20px;
}
._center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>


