<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-tickets"></i> 菜单</el-breadcrumb-item>
          <el-breadcrumb-item>菜品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-button type="primary" @click="dialogFormVisible=true;isNew=true">新分类</el-button>
        <div class="pull-right">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
      </div>
        <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
          <el-table-column prop="groupname" label="分类名称" sortable></el-table-column>
          <el-table-column prop="sale" label="折扣优惠"></el-table-column>
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
        <el-form-item label="分类名称" prop="groupname">
            <el-input v-model="ruleForm.groupname" placeholder="分类名称" ></el-input>
        </el-form-item>
        <el-form-item label="优惠折扣" prop="sale">
            <el-input v-model="ruleForm.sale" placeholder="优惠折扣"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('ruleForm')" :loading="subloading">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      const self = this;
      return {
        selectedOptions: [],
        isNew: true,
        loading: true,
        subloading: false,
        delloading: false,
        url: 'admin/menu/group',
        tableData: [],
        cur_page: 1,
        select_word: '',
        del_list: [],
        total: 0,
        is_search: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        ruleForm: {
          id:0,
          groupname: '',
          sale: ''
        },
        rules: {
          groupname: [
            { required: true, message: '请输入名称, 长度在 2 到 20 个字符', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      isNew: function (val) {
        if (val) {
          this.ruleForm = {
            id:0,
            groupname: '',
            sale: ''
          }
        }
      }
    },
    beforeMount(){
      let self = this;
      self.$http.get(self.url + '/get/' + self.cur_page).then((res) => {
        self.tableData = res.data.data.list
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
            if(d.groupname === self.del_list[i].groupname){
              is_del = true
              break
            }
          }
          if(!is_del){
            if(d.groupname.indexOf(self.select_word) > -1 ||
              d.groupname.indexOf(self.select_word) > -1
            ){
              return d
            }
          }
        })
      }
    },
    methods: {
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
            this.$refs[formName].resetFields()
          })
          .catch((response) => {
            // 这里是处理错误的回调
            this.$message.error(response.errMsg)
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

</style>