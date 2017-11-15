export default{
  install(Vue,options)
  {
    Vue.prototype.getUser = JSON.parse(localStorage.getItem('userinfo'))
    
    Vue.prototype.getData = function () {
      console.log('我是插件中的方法');
    }
  }
}