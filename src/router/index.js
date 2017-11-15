import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/admin/login'
        },
        {
            path: '/admin/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },

                {
                    // 系统设置
                    path: '/admin/setting/config',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/Setting.vue'], resolve)
                },
                {
                    // 公告设置
                    path: '/admin/setting/notice',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/Notice.vue'], resolve)
                },
                {
                    // 管理设置
                    path: '/admin/setting/user',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/User.vue'], resolve)
                },
                {
                    // 支付设置
                    path: '/admin/setting/pay',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/Pay.vue'], resolve)
                },
                {
                    // 微信设置
                    path: '/admin/setting/wechat',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/Wechat.vue'], resolve)
                },
                {
                    // 其他设置
                    path: '/admin/setting/other',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/Other.vue'], resolve)
                },
                {
                    // 增加常量
                    path: '/admin/setting/add',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Setting/Add.vue'], resolve)
                },

                {
                    // 门店列表
                    path: '/admin/shop/list',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Shop/List.vue'], resolve)
                },
                {
                    // 菜品
                    path: '/admin/menu/list',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Menu/List.vue'], resolve)
                },
                {
                    // 菜品分类
                    path: '/admin/menu/group',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Menu/Group.vue'], resolve)
                },
            
                {
                    // 会员列表
                    path: 'admin/member/list',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Member/List.vue'], resolve)
                },
            
                {
                    // 订单列表
                    path: 'admin/order/list',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Order/List.vue'], resolve)
                },
                {
                    // 订单支付记录
                    path: 'admin/order/pay',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Order/Pay.vue'], resolve)
                },
                {
                    // 订单配送记录
                    path: '/admin/delivery/list',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['../components/page/Delivery/List.vue'], resolve)
                }
            ]
        },
        {
            path: '/admin/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
