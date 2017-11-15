<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-setting"></i> 设置</el-breadcrumb-item>
          <el-breadcrumb-item>支付设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-button type="primary" icon="plus" @click="dialogFormVisible=true;isNew=true">新支付</el-button>
        
      </div>
      <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
        <el-table-column prop="payname" label="名称"></el-table-column>
        <el-table-column prop="appid" label="appid"></el-table-column>
        <el-table-column prop="secert" label="secert"></el-table-column>
        <el-table-column prop="accompany" label="配送费"></el-table-column>
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
    <el-dialog title="新支付" :visible.sync="dialogFormVisible">
      <el-form :model="pay" :rules="rules" ref="pay">
        <el-form-item label="支付名称" :label-width="formLabelWidth" prop="payname">
          <el-input v-model="pay.payname" auto-complete="off" placeholder="支付方式名称"></el-input>
        </el-form-item>
        <el-form-item label="APPID" :label-width="formLabelWidth" prop="appid">
          <el-input v-model="pay.appid" auto-complete="off" placeholder="appid"></el-input>
        </el-form-item>
        <el-form-item label="SECERT" :label-width="formLabelWidth" prop="secert">
          <el-input v-model="pay.secert" auto-complete="off" placeholder="secert"></el-input>
        </el-form-item>
        <el-form-item label="配送费" :label-width="formLabelWidth" prop="accompany">
          <el-input v-model="pay.accompany" auto-complete="off" placeholder="配送费用"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('pay')">重 置</el-button>
        <el-button type="primary" @click="onSubmit('pay')" :loading="subloading">确 定</el-button>
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
        url: 'admin/pay',
        tableData: [],
        cur_page: 1,
        select_word: '',
        del_list: [],
        total: 0,
        is_search: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        pay: {
          id: 0,
          payname: '',
          appid: '',
          secert:'',
          accompany: ''
        },
        rules: {
          payname: [
            { required: true, message: '请输入名称, 长度在 3 到 20 个字符', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          appid: [
            { required: true, message: '请输入appid, 长度在 2 到 30 个字符', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
          ],
          secert: [
            { required: true, message: '请输入secert, 长度在 8 到 60 个字符', trigger: 'blur' },
            { min: 8, max: 60, message: '长度在 8 到 60 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
        isNew: function (val) {
          if (val) {
            this.pay = {
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
                    if(d.payname === self.del_list[i].payname){
                        is_del = true;
                        break;
                    }
                }
                if(!is_del){
                    if(d.payname.indexOf(self.select_word) > -1){
                        return d;
                    }
                }
            })
        }

    },
    
    methods: {
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
            this.pay = row
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
                    this.$http.post(this.url+'/edit/' + self.cur_page, this.pay)
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