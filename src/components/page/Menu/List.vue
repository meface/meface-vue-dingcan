<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-tickets"></i> 菜品</el-breadcrumb-item>
          <el-breadcrumb-item>菜品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-button type="primary" @click="dialogFormVisible=true;isNew=true">新菜品</el-button>
        <el-select v-model="select_cate" placeholder="选择门店" @change="handleCate" class="handle-select mr10">
          <el-option
            v-for="item in shops"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="pull-right">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
      </div>
        <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
          <el-table-column label="菜品名称">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="left">
                <p><img :src="scope.row.image" class="image-preview"></p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.title }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="sale" label="优惠"></el-table-column>
          <el-table-column prop="total" label="数量"></el-table-column>
          <el-table-column label="门店">
            <template slot-scope="props">
              {{ shopToText(props.row.shopid) }}
            </template>
          </el-table-column>
          <el-table-column label="分类">
            <template slot-scope="props">
              {{ groupToText(props.row.groupid) }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="props">
              <el-switch
                style="display: block"
                v-model="props.row.state"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                active-text="有货"
                inactive-text="售馨"
                @change="handleSwitch(props.$index, props.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @current-change ="handleCurrentChange" layout="prev, pager, next" :total="total"></el-pagination>
        </div>
    </div>
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="状态" prop="state">
              <el-switch v-model="ruleForm.state" active-color="#13ce66" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="门店" prop="shopid">
              <el-select v-model="ruleForm.shopid" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in shops"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="groupid">
              <el-select v-model="ruleForm.groupid" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in groups"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="title">
                <el-input v-model="ruleForm.title" placeholder="菜品名称，2-20个字符" ></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input v-model="ruleForm.price" placeholder="菜品价格，限数字"></el-input>
            </el-form-item>
            <el-form-item label="优惠" prop="sale">
                <el-input v-model="ruleForm.sale" placeholder="菜品优惠，限数字"></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="total">
                <el-input v-model="ruleForm.total" placeholder="菜品数量，限数字"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
              <div class="avatar-uploader">
                <el-upload
                  class="upload-demo"
                  :action="uploadapi"
                  :data="{'id': ruleForm.id}"
                  :name="media"
                  :headers = "uploadheader"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <el-button size="small">{{ ruleForm.image == ''?'点击上传封面':'点击更换封面'}}</el-button>
                </el-upload>
                <img v-if="ruleForm.image" :src="ruleForm.image">
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('ruleForm')" :loading="subloading">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  const Token = localStorage.getItem('token')
  export default {
    data () {
      const self = this;
      return {
        isNew: true,
        loading: false,
        subloading: false,
        delloading: false,
        url: 'admin/menu',
        uploadapi: 'http://localhost/public/admin/menu/upload/image',
        media: 'image',
        tableData: [],
        groups: [], // 分类
        shops: [], // 分类
        cur_page: 1,
        select_word: '',
        select_cate: 0,
        del_list: [],
        total: 0,
        is_search: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        uploadheader: {
          'X-CSRF-TOKEN': Token,
          'Authorization': 'Bearer ' + Token
        },
        ruleForm: {
          id:0,
          state: '',
          title: '',
          image: '',
          price: '',
          sale: '',
          total: '',
          shopid: '',
          groupid: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入菜品名称, 长度在 2 到 20 个字符', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入菜品价格, 限数字', trigger: 'blur' }
          ],
          shopid: [
            { required: true, message: '请选择所属门店', trigger: 'change' }
          ],
          groupid: [
            { required: true, message: '请选择菜品分类', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      isNew: function (val) {
        if (val) {
          this.ruleForm = {
            id:0,
            state: '',
            title: '',
            image: '',
            price: '',
            sale: '',
            total: '',
            shopid: '',
            groupid: ''
          }
        }
      }
    },
    beforeMount(){
      // 获取数据
      this.handleCate()
    },
    computed: {
      getData(){
        const self = this
        if (self.isEmptyObject(self.tableData)){
            return
        }
        return self.tableData.filter(function(d){
          let is_del = false
          for (let i = 0; i < self.del_list.length; i++) {
            if(d.title === self.del_list[i].title){
              is_del = true
              break
            }
          }
          if(!is_del){
            if(d.title.indexOf(self.select_word) > -1 ||
              d.title.indexOf(self.select_word) > -1
            ){
              return d
            }
          }
        })
      }
    },
    methods: {
      // 分类
      groupToText (val) {
        const self = this;
        let groupname = '';
        if (self.isEmptyObject(self.groups)){
            return
        }
        self.groups.filter(function(d){
          if(d.value == val){
            groupname = d.label
            return
          }
        })
        return groupname
      },
      // 门店
      shopToText (val) {
        const self = this;
        let shopname = '';
        if (self.isEmptyObject(self.shops)){
            return
        }
        self.shops.filter(function(d){
          if(d.value == val){
            shopname = d.label
            return
          }
        })
        return shopname
      },
      // 预览封面
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 图标上传成功
      handleAvatarSuccess(res, file) {
        console.log(res)
        if (res.data.errCode == 1) {
          this.ruleForm.image = res.data.path
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
        for (var name in obj){
        　return false
        }　　
        return true
      },
      handleCurrentChange(val){
        this.cur_page = val
        this.handleCate()
      },
      search(){
        this.is_search = true
      },
      handleEdit(index, row) {
        this.ruleForm = row
        this.isNew = false
        this.dialogFormVisible = true
      },
      handleDelete(index, row) {
        let self = this
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delloading = true
          self.$http.post(self.url+'/del/' + row.id).then((res) => {
            self.del_list.push(row);
            self.delloading = false
            self.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')         
        })
      },
      delAll(){
        const self = this
        let length = self.multipleSelection.length
        let str = ''
        self.del_list = self.del_list.concat(self.multipleSelection)
        for (let i = 0; i < length; i++) {
            str += self.multipleSelection[i].title + ' '
        }
        self.$message.error('删除了'+str)
        self.multipleSelection = []
      },
      // 营业状态切换
      handleSwitch (index, row) {
        let self = this
        self.delloading = true
        self.$http.post(self.url+'/switch/' + row.id + '/' +  + row.state)
        .then((res) => {
          self.delloading = false
          self.$message.success(res.errMsg)
        })
        .catch((response) => {
          // 这里是处理错误的回调
          self.$message.error(response.errMsg)
        })
      },

      // 获取数据
      handleCate () {
        let self = this;
        self.loading = true
        self.$http.get(self.url + '/get/' + self.select_cate + '/' + self.cur_page).then((res) => {
          self.tableData = res.data.data.list
          self.shops = res.data.data.shops.list // 门店
          self.groups = res.data.data.groups.list // 门店
          self.total = res.data.data.total
          self.loading = false
        })
        .catch((response) => {
          // 这里是处理错误的回调
          self.$message.error(response.errMsg)
          self.loading = false
        })
      },

      // 新增/编辑
      onSubmit(formName) {
        this.subloading = true
        this.$http.post(this.url+'/edit/' + this.select_cate + '/' + this.cur_page, this.ruleForm)
          .then((response) => {
            // 这里是处理正确的回调
            this.dialogFormVisible = false
            this.tableData = response.data.data.list
            this.total = response.data.data.total
            this.subloading = false
            this.isNew = true
            this.$refs[formName].resetFields()
            this.$message.success(response.errMsg)
          })
          .catch((response) => {
            // 这里是处理错误的回调
            this.$message.error(response.errMsg)
            this.subloading = false
          }
        )
      },
      resetForm(formName) {
          this.subloading = false
          this.$refs[formName].resetFields()
      }
    }
  }
</script>
<style>
.table-expand {
  font-size: 0;
}
.table-expand .el-form-item__label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.handle-box{
  margin-bottom: 20px;
}
.handle-select{
  width: 120px;
}
.pull-right {
  float: right;
}
.handle-input{
  width: 300px;
  display: inline-block;
}
.image-preview {
  width: 150px;
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