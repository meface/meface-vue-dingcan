<template>
    <div v-loading.body="loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 设置</el-breadcrumb-item>
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="configForm" :modal="configForm" label-width="100px">

                <el-form-item v-for="item in configForm" :key="item.id" :label="item.info" :prop="item.varname">
                    <el-input v-if="item.type === 'varchar'" v-model="item.value" :placeholder="item.varname" ></el-input>
                    <el-switch v-else-if="item.type === 'switch'" v-model="item.value" active-color="#13ce66" active-value="1" inactive-value="0"></el-switch>
                    <el-input v-else-if="item.type === 'text'" type="textarea" autosize :autosize="{ minRows: 2, maxRows: 4}" v-model="item.value" :placeholder="item.varname" ></el-input>
                  
                    
                </el-form-item>


                <el-form-item v-show="isReady">
                    <el-button type="primary" @click="onSubmit" :loading="subloading">更新</el-button>
                    <el-button >取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                isReady: false,
                loading: true,
                subloading: false,
                configForm:['']
            }
        },
        methods: {
            onSubmit(formName) {
                this.subloading = true
                this.$http.post('admin/config/edit', this.configForm)
                  .then((response) => {
                    // 这里是处理正确的回调
                    this.subloading = false
                    this.$message.success(response.errMsg)
                  })
                  .catch((response) => {
                    // 这里是处理错误的回调
                    this.$message.error(response.errMsg)
                  }
                )
                    
            }
        },
        mounted: function () {
            this.$http.get('admin/config/get/1')
              .then((response) => {
                // 这里是处理正确的回调
                //this.$message.success(response.errMsg)
                this.configForm = response.data.data
                this.isReady = true
                this.loading = false
              })
              .catch((response) => {
                // 这里是处理错误的回调
                this.$message.error(response.errMsg)
              }
            )
        }
    }
</script>