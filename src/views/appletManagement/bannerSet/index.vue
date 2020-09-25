<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div class="banner-top">
        <div>
          <svg-icon icon-class="marker" class="icon1"></svg-icon>
          <span>Banner设置</span>
        </div>
        <el-button type="primary" @click="confirmUp">立即发布</el-button>
      </div>
      <div>
        <div class="banner-top" style="margin-top: 15px;">
          <!-- banner top -->
          <div v-for="(item,index) in bannerTop" :key="index" @click="clickIndex=index">
            <el-upload v-if="!item.imageUrl" class="avatar-uploader" :action="actionUrl" list-type="picture"
              :on-success="handleSuccess1">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div v-else class="avatar-uploader">
              <p class="delete" @click="handleRemove1(index,item)">×</p>
              <img class="el-upload avatar-uploader-icon" :src="item.imageUrl" alt="">
            </div>
          </div>
        </div>
      </div>

      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传banner图片，仅支持格式png,jgps格式，最多可上传四张banner图片。</span>
      </div>
    </el-card>
    <!-- 下面预设banner -->
    <el-card v-if="hasYuBanner" class="filter-container" shadow="never" style="margin-top:20px">
      <div>
        <svg-icon icon-class="marker" class="icon1"></svg-icon>
        <span>预设Banner设置</span>
      </div>
      <div class="banner-top" style="margin-top: 15px">
        <!-- banner bottom -->
        <div v-for="(item,index) in bannerBottom" :key="index" @click="clickIndex=index">
          <el-upload v-if="!item.imageUrl" class="avatar-uploader" :action="actionUrl" list-type="picture"
            :on-success="handleSuccess2">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div v-else class="avatar-uploader">
            <p class="delete" @click="handleRemove2(index,item)">×</p>
            <img class="el-upload avatar-uploader-icon" :src="item.imageUrl" alt="">
          </div>
        </div>
      </div>

      <div style="color:#8C8C8C;font-size:12px;margin-top:20px">
        <span>请上传banner图片，仅支持格式png,jgps格式，最多可上传四张banner图片。</span>
      </div>
      <div>
        <div style="font-size:14px;margin-top:20px">设置banner更换时间</div>
        <div style="margin-top: 15px;" class="banner-top">
          <el-form :inline="true" size="small" label-width="">
            <el-form-item label="">
              <el-date-picker class="input-width" v-model="createTime" type="datetime" placeholder="请选择时间">
              </el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="confirmTime()" size="small">
              确认时间
            </el-button>
          </el-form>
          <el-button type="danger" @click="deleteAll" size="small">
            删除
          </el-button>
        </div>
      </div>
    </el-card>
    <el-button type="primary" style="margin-top:20px" @click="hasYuBanner = true">添加预播banner</el-button>
  </div>
</template>
<script>
import { getBanner, bannerPublish, bannerDelete } from '@/api/otoBannerSet';
import { fetchAllRoleList } from '@/api/role';
import { formatDate } from '@/utils/date';
export default {
  data () {
    return {
      actionUrl: process.env.BASE_API + '/minio/upload',//文件上传地址
      clickIndex: 0,//当前选择的index下标
      createTime: null,
      bannerTop: [{}, {}, {}, {}],//上面的banner
      bannerBottom: [{}, {}, {}, {}],//下面的banner
      hasYuBanner: true
    }
  },
  created () {
    this.getList();
  },
  methods: {
    //查询banner
    getList () {
      getBanner().then(res => {
        // console.log('hahahas', JSON.stringify(res))
        this.bannerTop = [{ channel: 1 }, { channel: 2 }, { channel: 3 }, { channel: 4 }]
        this.bannerBottom = [{ channel: 1 }, { channel: 2 }, { channel: 3 }, { channel: 4 }]
        let topList = res.data.effectiveList;//上面的banner
        let botList = res.data.ineffectiveList//下面的banner
        /* 遍历插值 */
        for (let it of topList) {
          if (it.channel == 1) {
            this.bannerTop[0] = it
          } else if (it.channel == 2) {
            this.bannerTop[1] = it
          } else if (it.channel == 3) {
            this.bannerTop[2] = it
          } else if (it.channel == 4) {
            this.bannerTop[3] = it
          }
        }
        for (let it of botList) {
          if (it.channel == 1) {
            this.bannerBottom[0] = it
          } else if (it.channel == 2) {
            this.bannerBottom[1] = it
          } else if (it.channel == 3) {
            this.bannerBottom[2] = it
          } else if (it.channel == 4) {
            this.bannerBottom[3] = it
          }
          this.createTime = it.beginTime
        }
        // 强制更新
        this.$forceUpdate()
      });
    },
    /* top上传成功 */
    handleSuccess1 (res, file) {
      console.log(res)
      for (let i = 0; i < this.bannerTop.length; i++) {
        if (this.clickIndex === i) {
          this.bannerTop[i].channel = i + 1
          this.bannerTop[i].whetherDelete = false
          this.bannerTop[i].imageUrl = res.data.url;
        }
      }
      // 强制更新
      this.$forceUpdate()
    },
    /* bottom上传成功  */
    handleSuccess2 (res, file) {
      for (let i = 0; i < this.bannerBottom.length; i++) {
        if (this.clickIndex === i) {
          this.bannerBottom[i].channel = i + 1
          this.bannerBottom[i].whetherDelete = false
          this.bannerBottom[i].imageUrl = res.data.url;
        }
      }
      // 强制更新
      this.$forceUpdate()
    },
    /* 移除 */
    handleRemove1 (index, item) {
      let id = ''
      if (item.id) {
        id = item.id
      }
      let bannerTopItem = {
        id: id,
        beginTime: item.beginTime,
        channel: item.channel,
        whetherDelete: true
      }
      this.bannerTop[index] = bannerTopItem
      this.$forceUpdate()
    },
    handleRemove2 (index, item) {
      if (item.id) {
        this.bannerBottom[index] = { id: item.id, channel: index + 1, whetherDelete: true };
      } else {
        this.bannerBottom[index] = { channel: index + 1, imageUrl: '', whetherDelete: true };
      }

      this.$forceUpdate()
    },
    /* 立即发布 */
    async confirmUp () {
      let arr = []
      for (let it of this.bannerTop) {
        if (it.imageUrl) {
          arr.push(it.imageUrl)
        }
      }
      if (arr.length == 0) {
        this.$message.error('请选择上传banner')
        return
      }
      let params = {
        effectiveList: this.bannerTop,
        ineffectiveList: []
      }
      await bannerPublish(params).then(res => {
        if (res.success) {
          this.$message.success('操作成功');
        }
      })
    },
    /* 确认时间发布预设 */
    confirmTime () {
      if (this.createTime == null) {
        this.$message.error('请设置更换时间！');
        return
      }

      let yusheList = []

      for (let it of this.bannerBottom) {
        it.beginTime = this.createTime
      }
      for (let it of this.bannerBottom) {
        if (it.imageUrl) {
          yusheList.push(it)
        }
      }
      if (yusheList.length == 0) {
        this.$message.error('未上传图片不能设置时间！');
        this.createTime = null
        return
      }
      let params = {
        effectiveList: [],
        ineffectiveList: yusheList
      }
      bannerPublish(params).then(res => {
        if (res.success) {
          this.$message.success('操作成功！');
        }
      })
    },
    /* 删除轮播图 */
    deleteAll () {
      this.hasYuBanner = false
      let ids = []
      for (let it of this.bannerBottom) {
        if (it.id) {
          ids.push(it.id)
        }
      }
      let params = {
        ids: String(ids)
      }
      bannerDelete(params).then(res => {
        if (res.success) {
          this.$message.success('操作成功！');
          this.getList()
        }
      })
    }
  }
}
</script>
<style>
.banner-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.avatar-uploader {
  position: relative;
  width: 240px;
  height: 120px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/* 删除的标记 */
.avatar-uploader .delete {
  position: absolute;
  top: -16px;
  right: 0px;
  width: 20px;
  height: 20px;
  text-align: center;
  z-index: 99;
  cursor: pointer;
}
.avatar-uploader .delete:hover {
  border-radius: 50%;
  color: #ffffff;
  background-color: #409eff;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 240px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 240px;
  height: 120px;
  display: block;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>


