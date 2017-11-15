<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-setting"></i> 设置</el-breadcrumb-item>
          <el-breadcrumb-item>员工设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-button type="primary" icon="plus" @click="dialogFormVisible=true;isNew=true">新用户</el-button>
        <div class="pull-right">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
      </div>
      <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
        <el-table-column prop="userid" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="rank" label="用户组">
          <template slot-scope="props">
            {{ rankToText(props.row.rank) }}
          </template>
        </el-table-column>
        <el-table-column prop="updated" label="最近登陆" sortable></el-table-column>
        <el-table-column prop="created" label="加入时间" sortable></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
                @current-change ="handleCurrentChange"
                layout="prev, pager, next"
                :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="新员工" :visible.sync="dialogFormVisible">
      <el-form :model="user" :rules="rules" ref="user">
        <el-form-item v-if="isNew" label="用户名" :label-width="formLabelWidth" prop="userid">
          <el-input v-model="user.userid" auto-complete="off" placeholder="字母、数字及组合"></el-input>
        </el-form-item>
        <el-form-item v-else label="用户名" :label-width="formLabelWidth">
          <div v-model="user.userid">{{ user.userid }}</div>  
        </el-form-item>
        <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="user.nickname" auto-complete="off" placeholder="用户昵称，限10字"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="user.password" auto-complete="off" placeholder="至少8位字母、数字及组合"></el-input>
        </el-form-item>
        <el-form-item label="密码确认" :label-width="formLabelWidth" prop="passwordok">
          <el-input v-model="user.passwordok" auto-complete="off" placeholder="请再次输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户组" :label-width="formLabelWidth" prop="rank">
          <el-select v-model="user.rank" placeholder="请选择">
            <el-option label="员工" value="1"></el-option>
            <el-option label="店长" value="5"></el-option>
            <el-option label="超级管理员" value="10"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('user')">重 置</el-button>
        <el-button type="primary" @click="onSubmit('user')" :loading="subloading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      const self = this
      return {
        isNew: true,
        loading: true,
        subloading: false,
        delloading: false,
        url: 'admin/user',
        tableData: [],
        cur_page: 1,
        select_word: '',
        del_list: [],
        total: 0,
        is_search: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        user: {
          id: 0,
          userid: '',
          rank: '',
          nickname:'',
          password: '',
          passwordok: ''
        },
        rules: {
          userid: [
            { required: true, message: '请输入标识, 长度在 3 到 20 个字符', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          nickname: [
            { required: true, message: '请输入昵称, 长度在 2 到 8 个字符', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入名称, 长度在 8 到 20 个字符', trigger: 'blur' },
            { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
          ],
          passwordok:[{validator: (rule,value,callback)=>{
            if (value === '') {
              callback(new Error("请再次输入密码"))
            } else if (value !== this.user.password){
              callback(new Error("两次输入密码不一致"))
            }else{
              callback()
            }
            }, required: true,trigger:'blur'}
          ],
          group: [
            { required: true, message: '请选择用户组', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
        isNew: function (val) {
          if (val) {
            this.user = {
                id: 0,
                userid: '',
                group: '',
                password: '',
                passwordok: ''
            }
          }
        }
    },
    beforeMount(){
        let self = this;
        self.$http.get(self.url + '/get/' + self.cur_page).then((res) => {
            self.tableData = res.data.data.list
            self.total = res.data.data.total
            self.ranks = res.data.data.ranks.list
            self.loading = false
        })
    },
    computed: {
        getData(){
            const self = this;
            if (self.isEmptyObject(self.tableData)){
                return
            }
            return self.tableData.filter(function(d){
                let is_del = false;
                for (let i = 0; i < self.del_list.length; i++) {
                    if(d.userid === self.del_list[i].userid){
                        is_del = true;
                        break;
                    }
                }
                if(!is_del){
                    if(d.userid.indexOf(self.select_word) > -1){
                        return d;
                    }
                }
            })
        }

    },
    
    methods: {
      rankToText (val) {
        const self = this;
        let rank = '';
        if (self.isEmptyObject(self.ranks)){
            return
        }
        self.ranks.filter(function(d){
          if(d.value == val){
            rank = d.label
            return
          }
        })
        return rank
      },
      isEmptyObject(obj) {   
      　　for (var name in obj){
      　　　　return false;
      　　}　　
      　　return true;
      },
      handleCurrentChange(val){
          this.cur_page = val
          this.getData()
      },
      search(){
          this.is_search = true
      },
      handleEdit(index, row) {
          this.user = row
          console.log(row)
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
              self.$http.post(self.url+'/del/' + row.id).then((res) => {
                  self.del_list.push(row)
                  self.delloading = false
                  self.$message.success('删除成功');
              })
          }).catch(() => {
            this.$message.info('已取消删除');          
          });
          
      },
      delAll(){
          const self = this,
          length = self.multipleSelection.length;
          let str = '';
          self.del_list = self.del_list.concat(self.multipleSelection);
          for (let i = 0; i < length; i++) {
              str += self.multipleSelection[i].title + ' '
          }
          self.$message.error('删除了'+str);
          self.multipleSelection = [];
      },
      
      onSubmit(formName) {
          this.subloading = true
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.$http.post(this.url+'/edit/' + self.cur_page, this.user)
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
                  return;
              }
              this.subloading = false
              return false;
          });
      },
      resetForm(formName) {
          this.subloading = false
          this.$refs[formName].resetFields()
      }

    }
  }
</script>
<style scoped>
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
.el-table__expanded-cell {
    padding: 0;
}
.el-form--inline .el-form-item__label {
    display: block;
    padding: 30px 10px;
}
</style>