<template>
  <div class="login-wrap">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="userLogin" :rules="rules" ref="userLogin" label-width="0px" class="user-login">
        <el-form-item prop="username">
          <el-input v-model="userLogin.username" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="password" v-model="userLogin.password" @keyup.enter.native="submitForm('userLogin')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('userLogin')" :loading="subloading">登录</el-button>
        </div>
        <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        subloading: false,
        url: 'admin/login',
        userLogin: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    
    methods: {
      submitForm(formName) {
        const self = this;
        self.subloading = true
        self.$refs[formName].validate((valid) => {
          if (valid) {
            self.$http.post('admin/login', self.userLogin)
              .then((response) => {
                // 这里是处理正确的回调
                self.subloading = false
                if (response.errCode === -2) {
                  self.$message.danger(response.errMsg)
                  return;
                }
                if (response.errCode === -1) {
                  self.$message.error(response.errMsg)
                  return;
                }
                if (response.errCode === -1) {
                  self.$message.error(response.errMsg)
                  return;
                }
                localStorage.setItem('userinfo',JSON.stringify(response.data.data));
                localStorage.setItem('token',response.data.data.token);
                //let redirect = self.$router.params.redirect;
                //self.$router.push('/admin');
                location.href= '#/admin/'
              })
              .catch((response) => {
                console.log(response)
                // 这里是处理错误的回调
                self.subloading = false
                self.$message.error(response.errMsg)
              }
            )
            return;
          } 
          self.subloading = false
          return false;
          
        });
      }
    }
  }
</script>

<style scoped>
  .login-wrap{
    position: relative;
    width:100%;
    height:100%;
  }
  .ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;

  }
  .ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
  }
</style>