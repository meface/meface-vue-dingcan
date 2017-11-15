<template>
  <div class="header">
    <div class="logo">控制台</div>

    <div class="user-info">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user-logo" src="../../../static/img/img.jpg">
          {{nickname}}
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>系统消息</el-dropdown-item>
          <el-dropdown-item>个人设置</el-dropdown-item>
          <el-dropdown-item divided command="loginout">安全退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        name: '管理员'
      }
    },
    computed:{
      nickname(){
        let nickname = localStorage.getItem('user_nickname');
        return nickname ? nickname : this.name;
      }
    },
    methods:{
      handleCommand(command) {
        if(command == 'loginout'){
          localStorage.removeItem('userinfo')
          this.$router.push('/admin/login');
        }
      }
    }
  }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        padding-left: 20px;
        width:250px;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
