<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index">
            <template slot="title"><i :class="item.icon"></i><span>{{ item.title }}</span></template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index">
            <i :class="item.icon"></i>{{ item.title }}
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    
  </div>
</template>
<script>
  export default {
    data() {
      return {
        items: [
          {
            icon: 'el-icon-star-on',
            index: 'game',
            title: '门店',
            subs: [
              {
                index: '/admin/shop/list',
                title: '门店列表'
              }
            ]
          },
          {
            icon: 'el-icon-tickets',
            index: 'data',
            title: '菜品',
            subs: [
              {
                index: '/admin/menu/list',
                title: '菜品列表'
              },
              {
                index: '/admin/menu/group',
                title: '菜品分类'
              }
            ]
          },
          {
            icon: 'el-icon-menu',
            index: 'order',
            title: '订单',
            subs: [
              {
                index: '/admin/order/list',
                title: '订单记录'
              },
              {
                index: '/admin/order/pay',
                title: '支付记录'
              }
            ]
          },
          {
            icon: 'el-icon-location',
            index: 'delivery',
            title: '配送',
            subs: [
              {
                index: '/admin/delivery/list',
                title: '配送记录'
              }
            ]
          },
          {
            icon: 'el-icon-star-on',
            index: 'shop',
            title: '会员',
            subs: [
              {
                index: '/admin/member/list',
                title: '会员列表'
              }
            ]
          },
          {
            icon: 'el-icon-setting',
            index: 'setting',
            title: '设置',
            subs: [
              {
                index: '/admin/setting/config',
                title: '系统设置'
              },
              {
                index: '/admin/setting/notice',
                title: '公告设置'
              },
              {
                index: '/admin/setting/user',
                title: '管理设置'
              },
              {
                index: '/admin/setting/pay',
                title: '支付设置'
              },
              {
                index: '/admin/setting/wechat',
                title: '微信设置'
              },
              {
                index: '/admin/setting/other',
                title: '其他设置'
              },
              {
                index: '/admin/setting/add',
                title: '新增常量'
              }
            ]
          }
        ]
      }
    },
    computed:{
      onRoutes(){
        return this.$route.path.replace('/','');
      }
    }
  }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 240px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
