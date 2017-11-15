<template>
    <div v-loading.body="loading">
        <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-star-on"></i> 会员</el-breadcrumb-item>
                    <el-breadcrumb-item>消费记录</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="handle-box">
                <el-input v-model="select_word" placeholder="搜索订单编号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
                <el-table-column prop="pid" label="订单编号" sortable></el-table-column>
                <el-table-column prop="product" label="来源"></el-table-column>
                <el-table-column prop="scores" label="金额" width="100"></el-table-column>
                <el-table-column prop="ip" label="IP" width="100"></el-table-column>
                <el-table-column prop="mid" label="用户ID" sortable width="100"></el-table-column>
                <el-table-column prop="stime" label="时间"></el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button size="small" type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        
    </div>
</template>
<script>
    export default {
        data () {
            const self = this;
            return {
                loading: true,
                delloading: false,
                url: 'admin/member/order',
                tableData: [],
                cur_page: 1,
                select_word: '',
                del_list: [],
                total: 0,
                is_search: false,
                dialogFormVisible: false,
                formLabelWidth: '80px',
            }
        },
        watch: {
            
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
                        if(d.pid === self.del_list[i].pid){
                            is_del = true;
                            break;
                        }
                    }
                    if(!is_del){
                        if(d.pid.indexOf(self.select_word) > -1){
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
                this.cur_page = val;
                this.getData();
            },
            search(){
                this.is_search = true;
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
                        self.$message.success('删除成功')
                    })
                })
                .catch(() => {
                  this.$message.info('已取消删除');          
                });
                
            },
            delAll(){
                const self = this,
                length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].title + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
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