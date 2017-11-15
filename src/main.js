import Vue from 'vue';
import util from './util'
import App from './App';
import router from './router';
import axios from './components/common/Http'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

Vue.use(ElementUI);

Vue.prototype.$http = axios;

Vue.use(util);

router.beforeEach((to, from, next) => {
    const Token = localStorage.getItem('token')
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (Token) {  // 通过获取当前的token是否存在
            next();
        }
        else {
            //this.$message.error('会话过期');
            next({
                path: '/admin/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})

new Vue({
    router,
    axios,
    render: h => h(App)
}).$mount('#app');