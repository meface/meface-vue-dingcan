<template>
    <div v-loading.body="loading">
        <div class="table">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-star-on"></i> 会员</el-breadcrumb-item>
                    <el-breadcrumb-item>会员列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="handle-box">
                <el-input v-model="select_word" placeholder="搜索用户ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="getData" border style="width: 100%" ref="multipleTable" v-loading.body="delloading">
                <el-table-column prop="mid" label="ID"></el-table-column>
                <el-table-column prop="scores" label="积分" sortable></el-table-column>
                <el-table-column prop="logintime" label="最近登陆"></el-table-column>
                <el-table-column prop="loginip" label="IP"></el-table-column>
                <el-table-column prop="jointime" label="加入时间"></el-table-column>
                <el-table-column prop="rank" label="特权" ></el-table-column>
                <el-table-column prop="exptime" label="特权剩余天数" ></el-table-column>
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
        <el-dialog title="更新会员" :visible.sync="dialogFormVisible">
            <el-form :model="member" :rules="rules" ref="member">
                <el-form-item label="会员ID" :label-width="formLabelWidth">
                    <div v-model="member.mid">{{ member.mid }}</div>
                </el-form-item>
                <el-form-item label="游戏币" :label-width="formLabelWidth" prop="scores">
                    <el-input v-model="member.scores" auto-complete="off" placeholder="请输入数字"></el-input>
                </el-form-item>
                <el-form-item label="特权类型" :label-width="formLabelWidth" prop="rank">
                  <el-select v-model="member.rank" placeholder="请选择">
                    <el-option
                      v-for="item in memberType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="有效天数" :label-width="formLabelWidth" prop="exptime">
                    <el-input v-model="member.exptime" auto-complete="off" placeholder="请输入数字"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('member')">重 置</el-button>
                <el-button type="primary" @click="onSubmit('member')" :loading="subloading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        const self = this;
        return {
            isNew: true,
            loading: true,
            subloading: false,
            delloading: false,
            url: 'admin/member/list',
            tableData: [],
            memberType: [],
            cur_page: 1,
            select_word: '',
            del_list: [],
            total: 0,
            is_search: false,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            member: {
                mid: 0,
                scores: 0,
                rank: 0,
                exptime: 0
            },
            rules: {
                scores: [
                    { required: true, message: '请输入数字', trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
      
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
                    if (d.mid === self.del_list[i].mid) {
                        is_del = true;
                        break;
                    }
                }
                if (!is_del) {
                    if (d.mid.indexOf(self.select_word) > -1) {
                        return d;
                    }
                }
            })
        }

    },

    methods: {
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
            this.member = row
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
                    self.$http.post(self.url + '/del/' + row.id).then((res) => {
                        self.del_list.push(row)
                        self.delloading = false
                        self.$message.success('删除成功');
                    })
                })
                .catch(() => {
                    this.$message.info('已取消删除');
                });

        },
        delAll() {
            const self = this,
                length = self.multipleSelection.length;
            let str = '';
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
                    this.$http.post(this.url + '/edit/' + this.cur_page, this.member)
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
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.pull-right {
    float: right;
}

.handle-input {
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
