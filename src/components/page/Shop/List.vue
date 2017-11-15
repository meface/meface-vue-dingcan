<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-star-on"></i> 门店</el-breadcrumb-item>
          <el-breadcrumb-item>门店列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-button type="primary" @click="dialogFormVisible=true;isNew=true">新门店</el-button>
        <div class="pull-right">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
      </div>
        <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="省份">
                  <span>{{ codeToText(props.row.province) }}</span>
                </el-form-item>
                <el-form-item label="管理员">
                  <span>{{ rankToText(props.row.userid) }}</span>
                </el-form-item>
                <el-form-item label="城市">
                  <span>{{ codeToText(props.row.city) }}</span>
                </el-form-item>
                <el-form-item label="优惠折扣">
                  <span>{{ props.row.sale }}</span>
                </el-form-item>
                <el-form-item label="区域">
                  <span>{{ codeToText(props.row.district) }}</span>
                </el-form-item>
                <el-form-item label="配送方式">
                  <span>{{ deliveryToText(props.row.delivery) }}</span>
                </el-form-item>
                <el-form-item label="营业时间">
                  <span>{{ props.row.starttime }}</span>
                </el-form-item>
                <el-form-item label="最近更新">
                  <span>{{ props.row.updated }}</span>
                </el-form-item>
                <el-form-item label="打烊时间">
                  <span>{{ props.row.endtime }}</span>
                </el-form-item>
                <el-form-item label="详细地址">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
              </el-form>
              <el-row>
                <el-col :span="4" :offset="20">
                  <el-button size="mini"
                        @click="handleEdit(props.$index, props.row)">编辑</el-button>
                  <el-button size="mini" type="danger"
                        @click="handleDelete(props.$index, props.row)">删除</el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="created" label="创建时间" sortable></el-table-column>
          <el-table-column prop="shopname" label="门店名称"></el-table-column>
          <el-table-column prop="linkman" label="联系人"></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="props">
              <el-switch
                style="display: block"
                v-model="props.row.state"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                active-text="营业"
                inactive-text="打烊"
                @change="handleSwitch(props.$index, props.row)">
              </el-switch>
            </template>
            
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @current-change ="handleCurrentChange" layout="prev, pager, next" :total="total"></el-pagination>
        </div>
    </div>
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="门店状态" prop="state">
          <el-switch v-model="ruleForm.state" active-color="#13ce66" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="门店名称" prop="shopname">
            <el-input v-model="ruleForm.shopname" placeholder="外婆家的店" ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
            <el-input v-model="ruleForm.linkman" placeholder="联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="管理员" prop="userid">
          <el-select v-model="ruleForm.userid" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业时间" prop="starttime">
          <el-col :span="11">
            <el-time-select type="fixed-time" value-format="HH:mm:ss" placeholder="开始时间" v-model="ruleForm.starttime" :picker-options="{start: '06:00', step: '00:15', end: '22:30'}" style="width: 100%;"></el-time-select>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11" prop="endtime">
            <el-time-select type="fixed-time" value-format="HH:mm:ss" placeholder="结束时间" v-model="ruleForm.endtime" :picker-options="{start: '06:00', step: '00:15', end: '22:30'}" style="width: 100%;"></el-time-select>
          </el-col>
        </el-form-item>
        <el-form-item label="所属地区" prop="province">
          <el-cascader :options="options" v-model="selectedOptions" change-on-select @change="handleChange" style="width: 100%;"></el-cascader>
        </el-form-item>
        <el-form-item label="门店地址" prop="address">
            <el-input v-model="ruleForm.address" placeholder="外婆家"></el-input>
        </el-form-item>
        <el-form-item label="配送方式" prop="delivery">
          <el-select v-model="ruleForm.delivery" placeholder="请选择配送方式" style="width: 100%;">
            <el-option label="商家配送" value="0"></el-option>
            <el-option label="平台配送" value="1" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店优惠" prop="sale">
            <el-input v-model="ruleForm.sale" placeholder="门店优惠"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('ruleForm')" :loading="subloading">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {regionData, CodeToText} from 'element-china-area-data'
  export default {
    data () {
      const self = this;
      return {
        options: regionData, // 城市三级联动
        selectedOptions: [],
        isNew: true,
        loading: true,
        subloading: false,
        delloading: false,
        url: 'admin/shop',
        tableData: [],
        users: [], // 权限
        cur_page: 1,
        select_word: '',
        del_list: [],
        total: 0,
        is_search: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        ruleForm: {
          id:0,
          state: '',
          shopname: '',
          linkman: '',
          phone: '',
          userid: '',
          address: '',
          delivery: '',
          starttime: '',
          endtime: '',
          sale: '',
          province: '',
          city: '',
          district: ''
        },
        rules: {
          shopname: [
            { required: true, message: '请输入门店名称, 长度在 3 到 20 个字符', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入地址, 长度在 3 到 30 个字符', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
          linkman: [
            { required: true, message: '请输入联系人, 长度在 2 到 10 个字符', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ],
          userid: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ],
          delivery: [
            { required: true, message: '请选择配送方式', trigger: 'change' }
          ],
          starttime: [
            { required: true, message: '请输入营业开始时间', trigger: 'blur' }
          ],
          endtime: [
            { required: true, message: '请输入营业结束时间', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择所属区域', trigger: 'change' }
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
            shopname: '',
            linkman: '',
            phone: '',
            userid: '',
            address: '',
            delivery: '',
            starttime: '',
            endtime: '',
            sale: '',
            province: '',
            city: '',
            district: ''
          }
        }
      }
    },
    beforeMount(){
      let self = this;
      self.$http.get(self.url + '/get/' + self.cur_page).then((res) => {
        self.tableData = res.data.data.list
        self.users = res.data.data.users.list // 权限
        self.total = res.data.data.total
        self.loading = false
      })
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
            if(d.shopname === self.del_list[i].shopname){
              is_del = true
              break
            }
          }
          if(!is_del){
            if(d.shopname.indexOf(self.select_word) > -1 ||
              d.shopname.indexOf(self.select_word) > -1
            ){
              return d
            }
          }
        })
      }
    },
    methods: {
      rankToText (val) {
        const self = this;
        let nickname = '';
        if (self.isEmptyObject(self.users)){
            return
        }
        self.users.filter(function(d){
          if(d.value == val){
            nickname = d.label
            return
          }
        })
        return nickname
      },
      codeToText (val) {
        return CodeToText[val]
      },
      deliveryToText (val) {
        switch(val)
        {
          case '0':
            return '商家配送'
            break
          case '1':
            return '平台配送'
            break
          default:
            return ''
            break
        }
      },
      handleChange (value) {
        this.ruleForm.province = this.selectedOptions[0];
        this.ruleForm.city = this.selectedOptions[1];
        this.ruleForm.district = this.selectedOptions[2];
      },
      isEmptyObject(obj) {   
        for (var name in obj){
        　return false
        }　　
        return true
      },
      handleCurrentChange(val){
        this.cur_page = val
        this.getData()
      },
      search(){
        this.is_search = true
      },
      handleEdit(index, row) {
        this.ruleForm = row
        this.selectedOptions[0] = this.ruleForm.province;
        this.selectedOptions[1] = this.ruleForm.city;
        this.selectedOptions[2] = this.ruleForm.district;
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
      onSubmit(formName) {
        this.subloading = true
        this.$http.post(this.url+'/edit/' + this.cur_page, this.ruleForm)
          .then((response) => {
            // 这里是处理正确的回调
            this.dialogFormVisible = false
            this.tableData = response.data.data.list
            this.total = response.data.data.total
            this.subloading = false
            this.isNew = true
            this.$message.success(response.errMsg)
          })
          .catch((response) => {
            // 这里是处理错误的回调
            this.$message.error(response.errMsg)
          }
        )
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

</style>