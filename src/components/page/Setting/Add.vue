<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 设置</el-breadcrumb-item>
                <el-breadcrumb-item>增加常量</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="分组" prop="groupid">
                    <el-select v-model="ruleForm.groupid" placeholder="请选择">
                        <el-option key="1" label="系统设置" value="1"></el-option>
                        <el-option key="2" label="微信设置" value="2"></el-option>
                        <el-option key="3" label="其他设置" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择">
                        <el-option key="varchar" label="字符串" value="varchar"></el-option>
                        <el-option key="text" label="文本" value="text"></el-option>
                        <el-option key="switch" label="开关" value="switch"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标识" prop="varname">
                    <el-input v-model="ruleForm.varname" placeholder="CFG_" ></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="info">
                    <el-input v-model="ruleForm.info" placeholder="xxx"></el-input>
                </el-form-item>
                <el-form-item label="参数" prop="value">
                    <el-input v-model="ruleForm.value" placeholder="123"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('ruleForm')" :loading="subloading">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>
<script>
    export default {
        data () {
            return {
                subloading: false,
                ruleForm: {
                    varname: '',
                    info: '',
                    value: '',
                    type: '',
                    groupid: ''
                },
                rules: {
                  groupid: [
                    { required: true, message: '请选择分组', trigger: 'change' }
                  ],
                  type: [
                    { required: true, message: '请选择类型', trigger: 'change' }
                  ],
                  varname: [
                    { required: true, message: '请输入标识, 长度在 3 到 20 个字符', trigger: 'blur' },
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                  ],
                  info: [
                    { required: true, message: '请输入名称, 长度在 3 到 10 个字符', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                  ]
                }
            }
        },
        methods: {
            onSubmit(formName) {
                this.subloading = true
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post('admin/config/add', this.ruleForm)
                          .then((response) => {
                            // 这里是处理正确的回调
                            this.subloading = false
                            this.$message.success(response.errMsg)
                            this.$refs[formName].resetFields();
                          })
                          .catch((response) => {
                            // 这里是处理错误的回调
                            this.$message.error(response.errMsg)
                          }
                        )
                        return;
                    } 
                    //this.$message.error('输入不合法')
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