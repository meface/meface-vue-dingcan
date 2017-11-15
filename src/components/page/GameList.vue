<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-star-on"></i> 游戏</el-breadcrumb-item>
          <el-breadcrumb-item>游戏列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-input v-model="select_word" placeholder="搜索游戏" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label="游戏地址" inline class="demo-table-expand">
              <el-form-item label="微信扫描二维码">
                <span><vue-qr margin="0" size="120" :logoSrc="logosrc" :text="props.row.playurl" height="100" width="100"></vue-qr>
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="游戏名称"></el-table-column>
        <el-table-column prop="minscore" label="最低积分"></el-table-column>
        <el-table-column prop="minrank" :formatter="formatRank" label="最低分组"></el-table-column>
        <el-table-column prop="state" :formatter="formatState" label="状态"></el-table-column>
        <el-table-column prop="admin" label="所属用户"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
          </el-pagination>
      </div>
    </div>
    <el-dialog :title="isNew ? '发布游戏':'更新信息'" :visible.sync="dialogFormVisible">
      <el-form :model="product" :rules="rules" ref="product">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-switch v-model="product.state" on-color="#13ce66" on-value="1" off-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
              <el-input v-model="product.title" auto-complete="off" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="最低积分" :label-width="formLabelWidth" prop="minscore">
              <el-input v-model="product.minscore" auto-complete="off" placeholder="最低消费积分"></el-input>
            </el-form-item>
            <el-form-item label="最低分组" :label-width="formLabelWidth" prop="minrank">
              <el-select v-model="product.minrank" placeholder="请选择">
                <el-option
                  v-for="item in memberType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Token" :label-width="formLabelWidth" prop="token">
              <el-input v-model="product.token" auto-complete="off" placeholder="请输入Token, 与游戏文件包对应"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <div class="avatar-uploader">
                <el-upload
                  class="upload-demo"
                  :action="uploadapi"
                  :data="{'id': product.id}"
                  :name="media"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="small">点击上传</el-button>
                </el-upload>
                <img v-if="product.image" :src="product.image">
            </div>
          </el-col>
        </el-row>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('product')">重 置</el-button>
        <el-button type="primary" @click="onSubmit('product')" :loading="subloading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import VueQr from 'vue-qr'
export default { 
  data() {
    const self = this;
    return {
      isNew: true,
      loading: true,
      subloading: false,
      delloading: false,
      url: 'admin/game/list',
      uploadapi: 'http://localhost/public/admin/game/list/image',
      media: 'image',
      qrsrc: '../../../static/img/qart.png',
      logosrc: '../../../static/img/logo.png',
      tableData: [],
      cur_page: 1,
      select_word: '',
      del_list: [],
      total: 0,
      memberType: [],
      is_search: false,
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '80px',
      product: {
        id: 0,
        mid: '',
        title: '',
        playurl: '',
        image: '',
        minscore: '',
        minrank: '',
        token: '',
        state: ''
      },
      rules: {
        title: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        minrank: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        minscore: [
          { required: true, message: '必填项', trigger: 'blur' }
        ],
        token: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    VueQr
  },
  watch: {
    isNew: function (val) {
      if (val) {
        this.product = {
          id: 0,
          mid: '',
          title: '',
          playurl: '',
          image: '',
          minscore: '',
          minrank: '',
          token: '',
          state: ''
        }
      }
    }
  },
  beforeMount() {
    let self = this;
    self.$http.get(self.url + '/get/' + self.cur_page).then((res) => {
      if (res.data.errCode === 1) {
        self.tableData = res.data.data.list
        self.total = res.data.data.total
        self.memberType = res.data.data.memberType.list
      }
      self.loading = false
    })
    .catch((response) => {
      // 这里是处理错误的回调
      self.loading = false
      self.$message.error(response.statusText)
    })
  },
  computed: {
    getData() {
      const self = this;
      if (self.isEmptyObject(self.tableData)) {
          return
      }
      return self.tableData.filter(function(d) {
        let is_del = false;
        for (let i = 0; i < self.del_list.length; i++) {
          if (d.title === self.del_list[i].title) {
            is_del = true;
            break;
          }
        }
        if (!is_del) {
          if (d.title.indexOf(self.select_word) > -1) {
            return d;
          }
        }
        
      })
    }
  },
  methods: {
    formatState(data){
      return data.state==1 ? '开启' : '关闭'
    },
    formatRank(data){
      for (let i = 0; i < this.memberType.length; i++) {
        if (data.minrank == this.memberType[i].value) {
          return this.memberType[i].label
          break
        }
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图标上传成功
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.data.errCode == 1) {
        this.product.image = res.data.path
        this.$message.success(res.data.errMsg)
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt300K = file.size / 1024 < 300;
      console.log(file.size)
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt300K) {
        this.$message.error('上传图片大小不能超过 300K!');
      }
      return isJPG && isLt300K;
    },
    isEmptyObject(obj) {
      for (var name in obj) {
        return false;
      }　　
      return true;
    },
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    search() {
      this.is_search = true;
    },
    handleEdit(index, row) {
      this.product = row
      this.isNew = false
      this.dialogFormVisible = true
    },
    handleDelete(index, row) {
        let self = this;
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delloading = true
          self.$http.post(self.url + '/del/' + row.id).then((res) => {
            self.delloading = false
            self.del_list.push(row);
            self.$message.success('删除成功');
          })
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    delAll() {
      const self = this,
        length = self.multipleSelection.length
      let str = ''
      self.del_list = self.del_list.concat(self.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += self.multipleSelection[i].title + ' ';
      }
      self.$message.error('删除了' + str);
      self.multipleSelection = [];
    },
    onSubmit(formName) {
      this.subloading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.url + '/edit/' + self.cur_page, this.product)
              .then((response) => {
                // 这里是处理正确的回调
                this.dialogFormVisible = false
                this.tableData = response.data.data.list
                this.total = response.data.data.total
                this.subloading = false
                this.isNew = true
                this.$message.success(response.errMsg)
                this.$refs[formName].resetFields();
              })
              .catch((response) => {
                // 这里是处理错误的回调
                this.$message.error(response.errMsg)
              })
          return;
        }
        this.subloading = false
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style>
.handle-box {
  margin-bottom: 20px;
  text-align: right;
}
.handle-select {
  width: 120px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.el-form-item .el-form-item__content canvas{
  max-height: 195px;
}
.el-form--inline .el-form-item__label {
  display: block;
  text-align: center
}
.game-image {
  max-height: 195px;
}
.avatar-uploader{
  margin:  0 auto;
  width: 160px;
  min-height: 200px;
}
.avatar-uploader {
  display: block;
  margin: 8px auto;
  width: 130px;
  text-align: center;
}
.avatar-uploader>img {
  margin-top: 30px;
  max-width: 100%
}
</style>
