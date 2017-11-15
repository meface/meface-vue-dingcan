<template>
  <div v-loading.body="loading">
    <div class="table">
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-setting"></i> 设置</el-breadcrumb-item>
          <el-breadcrumb-item>公告设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="handle-box">
        <el-button type="primary" @click="dialogFormVisible=true;isNew=true">新公告</el-button>
        <div class="pull-right">
          <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
      </div>
        <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item>
                  <span>{{ props.row.desc }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="日期" sortable width="150">
          </el-table-column>
          <el-table-column prop="title" label="标题">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination @current-change ="handleCurrentChange" layout="prev, pager, next" :total="total"></el-pagination>
        </div>
    </div>
    <el-dialog :title="isNew?'新公告':'修改公告'" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input type="textarea" autosize :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容,限50字" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="subloading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      const self = this;
      return {
        isNew: true,
        loading: true,
        subloading: false,
        delloading: false,
        url: 'admin/notice',
        tableData: [],
        cur_page: 1,
        select_word: '',
        del_list: [],
        total: 0,
        is_search: false,
        dialogFormVisible: false,
        formLabelWidth: '80px',
        form: {
          id: 0,
          title: '',
          desc: ''
        }
      }
    },
    watch: {
      isNew: function (val) {
        if (val) {
          this.form = {
            id: 0,
            title: '',
            desc: ''
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
            if(d.title === self.del_list[i].title){
              is_del = true
              break
            }
          }
          if(!is_del){
            if(d.title.indexOf(self.select_word) > -1 ||
              d.desc.indexOf(self.select_word) > -1
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
        this.form = row
        console.log(row)
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
        this.$http.post(this.url+'/edit/' + self.cur_page, this.form)
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