<template>
  <div class="app-container" v-loading.fullscreen.lock="fullscreenLoading">
    <el-card class="filter-container" shadow="never">
      <div>
        <span>补充信息</span>
      </div>
      <el-form :inline="true" size="small" label-width="140px">
        <el-form-item label="套餐名称：">
          <el-input v-model="listQuery.name" class="input-width" placeholder="请输入套餐名称"></el-input>
        </el-form-item>
        <el-form-item label="套餐分类：">
          <el-select v-model="listQuery.categoryId" class="input-width" placeholder="全部" clearable>
            <el-option v-for="item in managementTypeOptions" :key="item.id" :label="item.name" :disabled="!item.status"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="small" label-width="140px">
        <el-form-item label="分成比例：">
          <el-input v-model="listQuery.shareRateHeadquarters" class="input-width input-width-small" placeholder="总部比例%">
          </el-input>
          <span>%</span>
          <el-input v-model="listQuery.shareRateOperation" class="input-width input-width-small" placeholder="运营比例%">
          </el-input>
          <span>%</span>
          <el-input v-model="listQuery.shareRateStore" class="input-width input-width-small" placeholder="门店比例%">
          </el-input>
          <span>%</span>
        </el-form-item>
      </el-form>
      <div class="add-parts">
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="包含配件/服务：">
            <el-tag :key="tag.id" v-for="tag in listQuery.products" closable :disable-transitions="false"
              @close="handleCloseTag(tag)">{{tag.name}}(￥{{tag.price}})</el-tag>
            <el-button class="button-new-tag" type="success" size="small" @click="addParts">+</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-form :inline="true" size="small" label-width="140px">
        <el-form-item label="价格：">
          <el-input v-model="listQuery.price" class="input-width" placeholder="请输入价格"></el-input>
          <el-button type="primary" @click="calcPrice">计算</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="small" label-width="140px">
        <el-form-item label="可实施门店：">
          <el-tag :key="tag.id" v-for="tag in listQuery.stores" closable :disable-transitions="false"
            @close="handleCloseTag2(tag)">{{tag.name}}</el-tag>
          <el-button class="button-new-tag" type="success" size="small" @click="addShop">+</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" size="small" label-width="140px">
        <el-form-item label="排序：">
          <el-input v-model="listQuery.sort" class="input-width" placeholder="套餐排序"></el-input>
          <span style="color:#8C8C8C;font-size:12px;margin-top:20px">按数值大小排序</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <span>套餐缩略图片</span>
      </div>
      <div style="margin-top: 15px">
        <el-upload :action="actionUrl" list-type="picture-card" :file-list="fileList1" :limit="1"
          :on-success="getMinioUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove1">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传图片，仅支持格式png,jgps格式，最多可上传一张图片。(建议大小166×155)</span>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <span>套餐详情图片</span>
      </div>
      <div style="margin-top: 15px">
        <el-upload :action="actionUrl" list-type="picture-card" :file-list="fileList2" :limit="3"
          :on-success="getDetailUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove2">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传图片，仅支持格式png,jgps格式，最多可上传三张图片。(建议大小750×406)</span>
      </div>
    </el-card>
    <el-card class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <span>套餐介绍</span>
      </div>
      <el-input type="textarea" :rows="5" placeholder="请输入内容" style="margin:20px 0" v-model="listQuery.description">
      </el-input>
      <div class="btns">
        <el-button type="primary" @click="formUpdateStatus()" v-if="id">确定</el-button>
        <el-button type="primary" @click="formChange()" v-else>确定</el-button>
      </div>
    </el-card>
    <!-- 配件弹层 -->
    <el-dialog :visible.sync="dialogParts" width="60%" :before-close="handleClose">
      <div class="parts-tit">配件与服务列表</div>
      <el-form :inline="true" :model="listQueryParts" size="small" label-width="100px" style="padding-bottom:44px;">
        <el-form-item label="搜索">
          <el-select v-model="listQueryParts.type" class="input-width" clearable>
            <el-option v-for="item in partsAndService" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配件服务名称">
          <el-input v-model="listQueryParts.name" class="input-width" placeholder="配件/服务/名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSearchList()" size="small">查询</el-button>
        <el-button style="margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
        <div>
          <el-table ref="roleTable" :data="productListOptions" style="width: 100%;" border="">
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="规格" align="center">
              <template slot-scope="scope">{{scope.row.specification}}</template>
            </el-table-column>
            <el-table-column label="原价" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price" placeholder="请输入价格"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="savePart(scope.$index, scope.row)">保存</el-button>
                <el-button v-if="scope.row.s == 1" :disabled="true" size="mini" type="primary"
                  @click="useParts(scope.row)">已使用</el-button>
                <el-button v-else size="mini" type="primary" @click="useParts(scope.row)">使用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-container">
          <el-pagination background="" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQueryParts.pageNum"
            :page-size="listQueryParts.pageSize" :page-sizes="[5,10,15]" :total="total"></el-pagination>
        </div>
      </el-form>
    </el-dialog>
    <!-- 门店弹层 -->
    <el-dialog :visible.sync="dialogShop" width="60%" :before-close="handleCloseShop">
      <div class="parts-tit">门店列表</div>
      <el-form :inline="true" :model="listQueryShop" size="small" label-width="100px" style="padding-bottom:44px;">
        <!-- <el-form-item label="搜索">
          <el-select v-model="listQueryParts.type" class="input-width" clearable>
            <el-option v-for="item in partsAndService"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="门店名称">
          <el-input v-model="listQueryParts.name" class="input-width" placeholder="门店名称"></el-input>
        </el-form-item>
        <el-form-item label="门店省市区:">
          <el-col :span="24">
            <el-cascader style="width:100%" size="small" :options="addressOptions" v-model="selectedAddressOptions"
              @change="addressHandleChange"></el-cascader>
          </el-col>
        </el-form-item>
        <el-button type="primary" @click="handleSearchList()" size="small">查询</el-button>
        <el-button style="margin-right: 15px" @click="handleResetSearch()" size="small">重置</el-button>
        <template>
          <el-checkbox v-model="checked">适用全部门店</el-checkbox>
        </template>
        <div>
          <el-table ref="roleTable" :data="storeTypeOptions" style="width: 100%;" border="">
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="电话" align="center">
              <template slot-scope="scope">{{scope.row.phone}}</template>
            </el-table-column>
            <el-table-column label="地址" align="center">
              <template slot-scope="scope">{{scope.row.address}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">{{scope.row.status ? '正常' : '冻结'}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="primary" :disabled="scope.row.status == 1" @click="handleDelete(scope.$index,scope.row, 1)">
                      启用
                    </el-button>
                    <el-button size="mini" type="primary" :disabled="scope.row.status == 0" @click="handleDelete(scope.$index, scope.row, 0)">
                      冻结
                </el-button>-->
                <el-button size="mini" type="primary" :disabled="scope.row.s == 1 || checked == true"
                  @click="useShop(scope.row)">使用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination-container">
          <el-pagination background="" @size-change="handleSizeChangeShop" @current-change="handleCurrentChangeShop"
            layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQueryShop.pageNum"
            :page-size="listQueryShop.pageSize" :page-sizes="[5,10,15]" :total="total"></el-pagination>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  productCategoryList,
  productList,
  storeList,
  updateStatus,
  changeCreate,
  packageGet,
  minioUpload
} from "@/api/otoPackageManagement";
import { changeUpdate } from "@/api/otoParts";
import { changeStatus } from "@/api/otoManagement";
import { formatDate } from "@/utils/date";
import { regionData, CodeToText } from "element-china-area-data";
const defaultListQuery = {
  categoryId: null,
  description: null,
  id: null,
  images: [],
  name: null,
  price: null,
  products: [],
  productDesc: null,
  productIds: [],
  shareRateHeadquarters: null,
  shareRateOperation: null,
  shareRateStore: null,
  sort: 1,
  storeIds: [],
  thumbs: []
};
const defaultListPartsQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null
};
const defaultListShopQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null,
  type: null,
  informationCompleted: 1,
  status: 1
};
export default {
  name: "adminList",
  data () {
    return {
      id: null,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fullscreenLoading: false,
      fileList1: [],
      fileList2: [],
      listQuery: Object.assign({}, defaultListQuery),
      listQueryParts: Object.assign({}, defaultListPartsQuery), // 配件列表
      listQueryShop: Object.assign({}, defaultListShopQuery), // 门店列表
      //套餐列表
      managementTypeOptions: [],
      //配件列表
      productListOptions: [],
      //门店分类列表
      storeTypeOptions: [],
      dialogParts: false,
      partsAndService: [
        { label: "配件", value: 0 },
        { label: "服务", value: 1 }
      ],
      total: null,
      product: [],
      dialogShop: false,
      checked: false, // 适用全部门店
      addressOptions: regionData, //省市区控件数据
      selectedAddressOptions: [], //省市区选中展示
      actionUrl: process.env.BASE_API + "/minio/upload"
    };
  },
  created () {
    this.getProductCategoryList();
    this.id = this.$route.query.id;
    if (this.id != undefined) {
      this.packageGet();
    } else {
      this.getStoreList();
      this.getProductList();
    }
  },

  methods: {
    handleRemove1 (file, fileList) {
      this.fileList1 = fileList;
      this.listQuery.thumbs = [];
      for (let it of fileList) {
        this.listQuery.thumbs.push(it.url);
      }
    },
    handleRemove2 (file, fileList) {
      this.fileList2 = fileList;
      this.listQuery.images = [];
      for (let it of fileList) {
        this.listQuery.images.push(it.url);
      }
    },
    //省市区选择
    addressHandleChange (value) {
      //console.log(value, CodeToText[value[0]], CodeToText[value[1]], CodeToText[value[2]]);
      //console.log("daaaas:", this.selectedAddressOptions)
      this.listQueryShop.province = value[0];
      this.listQueryShop.city = value[1];
      this.listQueryShop.district = value[2];
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //查询套餐
    getProductCategoryList () {
      productCategoryList().then(response => {
        let arr = [];
        for (let it of response.data.list) {
          if (it.status == 1) {
            arr.push(it);
          }
        }
        this.managementTypeOptions = arr;
      });
    },
    //查询配件
    getProductList () {
      productList(this.listQueryParts).then(response => {
        this.productListOptions = response.data.list;
        this.total = response.data.total;
        if (this.productListOptions) {
          for (let i = 0; i < this.productListOptions.length; i++) {
            this.productListOptions[i].s = 0;
            if (this.listQuery.products && this.listQuery.products.length) {
              for (let j = 0; j < this.listQuery.products.length; j++) {
                if (
                  this.productListOptions[i].id == this.listQuery.products[j].id
                ) {
                  this.productListOptions[i].s = 1;
                }
              }
            }
          }
        }
      });
    },
    //门店
    getStoreList () {
      console.log(this.listQueryShop, 9999);
      storeList(this.listQueryShop).then(response => {
        this.storeTypeOptions = response.data.list;
        if (this.storeTypeOptions) {
          for (let i = 0; i < this.storeTypeOptions.length; i++) {
            this.storeTypeOptions[i].s = 0;
            if (this.listQuery.stores && this.listQuery.stores.length) {
              for (let j = 0; j < this.listQuery.stores.length; j++) {
                if (
                  this.storeTypeOptions[i].id == this.listQuery.stores[j].id
                ) {
                  this.storeTypeOptions[i].s = 1;
                }
              }
            }
          }
        }
      });
      console.log(this.storeTypeOptions);
    },
    //查询详情
    packageGet () {
      let params = {
        id: this.id
      };
      packageGet(params).then(response => {
        // console.log('详情', response.data);

        this.listQuery = response.data;
        // 详情的图片
        /* 缩略图 */
        if (this.listQuery.thumbs) {
          for (let i = 0; i < this.listQuery.thumbs.length; i++) {
            this.fileList1.push({
              name: "",
              url: this.listQuery.thumbs[i]
            });
          }
        }
        /* 套餐详情图 */
        if (this.listQuery.images) {
          for (let i = 0; i < this.listQuery.images.length; i++) {
            this.fileList2.push({
              name: "",
              url: this.listQuery.images[i]
            });
          }
        }

        this.getStoreList();
        this.getProductList();

        //this.listQuery.whetherAllStore = false;
        this.checked = this.listQuery.whetherAllStore;
      });
    },
    //修改套餐
    formUpdateStatus () {
      let total =
        parseFloat(this.listQuery.shareRateHeadquarters) +
        parseFloat(this.listQuery.shareRateOperation) +
        parseFloat(this.listQuery.shareRateStore);
      if (!this.listQuery.name) {
        this.$message.error("请填写套餐名称!");
      } else if (!this.listQuery.categoryId) {
        this.$message.error("请选择套餐分类!");
      } else if (!this.listQuery.price) {
        this.$message.error("请填写价格!");
      } else if (
        !this.listQuery.shareRateHeadquarters ||
        !this.listQuery.shareRateOperation ||
        !this.listQuery.shareRateStore
      ) {
        this.$message.error("请完整填写分成比例!");
      } else if (total !== 100) {
        this.$message.error("分成比例总和需要为100");
      } else {
        let params = {
          id: this.id
        };
        for (let key in this.listQuery) {
          params[key] = this.listQuery[key];
        }
        let arr = [];
        if (params.products) {
          for (let i = 0; i < params.products.length; i++) {
            arr.push(params.products[i].id);
          }
        }
        params.productIds = arr;
        let arr2 = [];
        if (params.stores) {
          for (let i = 0; i < params.stores.length; i++) {
            arr2.push(params.stores[i].id);
          }
        }
        params.storeIds = arr2;
        params.whetherAllStore = this.checked;
        params.images = this.listQuery.images;
        params.thumbs = this.listQuery.thumbs;
        this.fullscreenLoading = true;
        //console.log(this.listQuery)
        console.log(params);
        updateStatus(params).then(response => {
          this.$message.success("操作成功!");
          this.fullscreenLoading = false;
          this.$router.back();
        });
      }
    },
    //创建套餐
    formChange () {
      if (!this.listQuery.name) {
        this.$message.error("请填写套餐名称!");
      } else if (!this.listQuery.categoryId) {
        this.$message.error("请选择套餐分类!");
      } else if (!this.listQuery.price) {
        this.$message.error("请填写价格!");
      } else if (
        !this.listQuery.shareRateHeadquarters ||
        !this.listQuery.shareRateOperation ||
        !this.listQuery.shareRateStore
      ) {
        this.$message.error("请完整填写分成比例!");
      } else if (
        parseFloat(this.listQuery.shareRateHeadquarters) +
        parseFloat(this.listQuery.shareRateOperation) +
        parseFloat(this.listQuery.shareRateStore) !=
        100
      ) {
        // console.log(parseFloat(this.listQuery.shareRateHeadquarters) + parseFloat(this.listQuery.shareRateOperation) + parseFloat(this.listQuery.shareRateStore));
        this.$message.error("分成比例总和需要为100");
      } else {
        let arr = [];
        if (this.listQuery.products) {
          for (let i = 0; i < this.listQuery.products.length; i++) {
            arr.push(this.listQuery.products[i].id);
          }
        }
        this.listQuery.productIds = arr;
        let arr2 = [];
        if (this.listQuery.stores) {
          for (let i = 0; i < this.listQuery.stores.length; i++) {
            arr2.push(this.listQuery.stores[i].id);
          }
        }
        this.listQuery.storeIds = arr2;
        this.listQuery.whetherAllStore = this.checked;
        // delete this.listQuery.products;
        // delete this.listQuery.stores;

        // this.listQuery.shareRateHeadquarters /= 100;
        // this.listQuery.shareRateOperation /= 100;
        // this.listQuery.shareRateStore /= 100;

        changeCreate(this.listQuery).then(response => {
          this.$message({
            type: "success",
            message: "操作成功!",
            duration: 1000
          });
          this.$router.back();
        });
      }
    },
    //上传图片缩略图
    getMinioUpload (response) {
      if (this.listQuery.thumbs && this.listQuery.thumbs.length) {
        this.listQuery.thumbs.push(response.data.url);
      } else {
        this.listQuery.thumbs = [response.data.url];
      }
    },
    //上传图片详情图
    getDetailUpload (response) {
      if (this.listQuery.products && this.listQuery.images.length) {
        this.listQuery.images.push(response.data.url);
      } else {
        this.listQuery.images = [response.data.url];
      }
    },
    handleClose () {
      this.dialogParts = false;
    },
    handleCloseShop () {
      this.dialogShop = false;
    },
    addParts () {
      // 添加配件
      this.dialogParts = true;
      this.getProductList();
    },
    addShop () {
      // 添加门店
      this.dialogShop = true;
      this.getStoreList();
    },
    handleSearchList () {
      this.listQueryParts.pageNum = 1;
      // this.getProductList();
      this.getStoreList();
    },
    handleResetSearch () {
      this.listQueryParts = Object.assign({}, defaultListPartsQuery);
      this.selectedAddressOptions = [];
      this.getProductList();
    },
    savePart (i, r) {
      // 保存配件
      this.$confirm("是否要保存价格?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        changeUpdate(r).then(response => {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
        });
      });
    },
    useParts (data) {
      //使用配件
      if (this.listQuery.products && this.listQuery.products.length) {
        this.listQuery.products.push({
          id: data.id,
          name: data.name,
          price: data.price
        });
      } else {
        this.listQuery.products = [
          { id: data.id, name: data.name, price: data.price }
        ];
      }
      // this.calcPrice();
      this.getProductList();
    },
    calcPrice () {
      // 计算配件和服务的价格
      this.listQuery.price = 0;
      for (let i = 0; i < this.listQuery.products.length; i++) {
        this.listQuery.price += parseFloat(this.listQuery.products[i].price);
      }
    },
    useShop (data) {
      // 使用门店
      if (this.listQuery.stores && this.listQuery.stores.length) {
        this.listQuery.stores.push({ id: data.id, name: data.name });
      } else {
        this.listQuery.stores = [{ id: data.id, name: data.name }];
      }
      this.getStoreList();
    },
    handleSizeChange (val) {
      this.listQueryParts.pageNum = 1;
      this.listQueryParts.pageSize = val;
      this.getProductList();
    },
    handleSizeChangeShop (val) {
      this.listQueryShop.pageNum = 1;
      this.listQueryShop.pageSize = val;
      this.getStoreList();
    },
    handleCurrentChange (val) {
      this.listQueryParts.pageNum = val;
      this.getProductList();
    },
    handleCurrentChangeShop (val) {
      this.listQueryShop.pageNum = val;
      this.getStoreList();
    },
    handleCloseTag (tag) {
      // 删除配件
      if (this.listQuery.products.length == 1) {
        this.$message.error("至少添加一个配件");
        return;
      }
      for (let i = 0; i < this.listQuery.products.length; i++) {
        if (this.listQuery.products[i].id == tag.id) {
          this.listQuery.products.splice(i, 1);
          this.$forceUpdate();
        }
      }
      // console.log(this.listQuery.products);
      // console.log(this.listQuery.products.length);
      // this.calcPrice();
    },
    handleCloseTag2 (tag) {
      // 删除门店
      if (this.listQuery.stores.length == 1) {
        this.$message.error("至少添加一个实施门店");
        return;
      }
      if (tag.name == "全部门店") {
        // this.$message({
        //   message: '全部不允许删除',
        //   type: 'warning'
        // });
        return;
      }
      for (let i = 0; i < this.listQuery.stores.length; i++) {
        if (this.listQuery.stores[i].id == tag.id) {
          this.listQuery.stores.splice(i, 1);
          this.$forceUpdate();
        }
      }
    },
    //修改状态
    handleDelete (index, row, status) {
      this.$confirm("是否要修改该用户状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let params = {
          id: row.id,
          status: status
        };
        changeStatus(params).then(response => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getStoreList();
        });
      });
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
.btns button {
  display: block;
  margin: 0 auto;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.parts-tit {
  margin-bottom: 30px;
  font-weight: 700;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.input-width {
  width: 203px;
  display: inline-block;
}
.input-width-small {
  width: 100px;
}
.input-width-max {
  width: 500px;
}
</style>


